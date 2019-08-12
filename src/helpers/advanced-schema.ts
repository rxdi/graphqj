import { GraphQLObjectType } from 'graphql';
import {
  BootstrapService,
  Container,
  InjectionToken,
  createUniqueHash
} from '@gapi/core';
import {
  TypesToken,
  Config,
  Roots,
  GlobalUnion,
  Externals
} from '../app/app.tokens';
import { ParseArgs } from './parse-ast';
import { buildArgumentsSchema } from './parse-args-schema';
import { ParseTypesSchema } from './parse-types.schema';
import { isFunction } from './isFunction';
import { resolversMap } from './resolvers.map';

function getInjectorSymbols(symbols: Externals[] = [], directives: string[]) {
  return symbols
    .map(symbol => {
      const [isPresent] = directives.filter(d => d.includes(symbol.map));
      if (isPresent) {
        const injector = isPresent.replace(/[^\w\s]/gi, '').replace(/ +?/g, '');
        const method = symbol.module[injector];
        if (!method) {
          throw new Error(`Missing method ${injector} inside ${symbol.file}`);
        }
        return {
          symbol: symbol.map,
          token: new InjectionToken(createUniqueHash(`${method}`)),
          module: symbol.module,
          method,
          injector
        };
      }
    })
    .filter(i => !!i);
}

function findInterceptor(
  symbol: string,
  method: string,
  externals: Externals[]
) {
  const usedExternalModule = externals.find(s => s.map === symbol);
  if (!usedExternalModule.module[method]) {
    throw new Error(
      `Missing method ${method} inside ${usedExternalModule.file}`
    );
  }
  return usedExternalModule.module[method];
}

function getSymbolInjectionToken(
  symbol: string,
  method: string,
  externals: Externals[]
) {
  const interceptor = findInterceptor(symbol, method, externals);
  return {
    token: new InjectionToken(createUniqueHash(`${interceptor}`)),
    interceptor
  };
}

function setPart(externals: Externals[], resolver, symbolMap) {
  const isCurlyPresent = resolver.includes('{');
  let leftBracket = '(';
  let rightBracket = ')';

  if (isCurlyPresent) {
    leftBracket = '{';
    rightBracket = '}';
  }

  const directive = resolver.split(leftBracket);
  let decorator: string[];

  if (resolver.includes('@')) {
    decorator = directive[1].replace(rightBracket, '').split('@');
  } else {
    const parts = directive[1].replace(rightBracket, '').split(symbolMap);
    for (var i = parts.length; i-- > 1; ) {
      parts.splice(i, 0, symbolMap);
    }
    decorator = parts;
  }
  decorator = decorator.filter(i => !!i);

  const symbol = decorator[0];
  const methodToExecute = decorator[1].replace(/ +?/g, '');

  const { token, interceptor } = getSymbolInjectionToken(
    symbol,
    methodToExecute,
    externals
  );
  return {
    token,
    interceptor
  };
}
export async function MakeAdvancedSchema(
  config: Config,
  bootstrap: BootstrapService
) {
  const types = {};
  const Arguments = Container.get(TypesToken);
  config.$args = config.$args || {};
  Object.keys(config.$args).forEach(reusableArgumentKey => {
    const args = {};
    Object.keys(config.$args[reusableArgumentKey]).forEach(o => {
      args[o] = ParseArgs(config.$args[reusableArgumentKey][o]);
      Arguments.set(reusableArgumentKey, args);
    });
  });
  Object.keys(config.$types).forEach(type => {
    if (types[type]) {
      return;
    }
    const currentType = config.$types[type];
    Object.keys(currentType).forEach(key => {
      types[type] = types[type] || {};

      let resolver = currentType[key];
      const interceptors = [];

      if (config.$externals) {
        const [symbol] = config.$externals
          .map(e => e.map)
          .filter(s => resolver.includes(s));
        if (symbol) {
          const hasMultipleSymbols = [
            ...new Set(
              resolver.split('=>').map(r => r.replace(/ +?/g, '').trim())
            )
          ];
          if (hasMultipleSymbols.length > 2) {
            const directives = hasMultipleSymbols.slice(
              1,
              hasMultipleSymbols.length
            );
            for (const injectorSymbol of getInjectorSymbols(
              config.$externals,
              directives
            )) {
              Container.set(injectorSymbol.token, injectorSymbol.method);
              interceptors.push(injectorSymbol.token);
            }
          } else {
            const { token, interceptor } = setPart(
              config.$externals,
              resolver,
              symbol
            );
            Container.set(token, interceptor);
            interceptors.push(token);
          }
          resolver = Object.keys(Roots)
            .map(node => {
              const types = Object.keys(Roots[node]).filter(key =>
                resolver.includes(key)
              );
              if (types.length) {
                return types[0];
              }
            })
            .filter(i => !!i)[0] as GlobalUnion;
        }
      }
      types[type][key] = ParseTypesSchema(resolver, key, interceptors);
    });
    types[type] = new GraphQLObjectType({
      name: type,
      fields: types[type]
    });
  });

  Object.keys(config.$resolvers).forEach(resolver => {
    const type = config.$resolvers[resolver].type;
    if (!types[type]) {
      throw new Error(
        `Missing type '${type}', Available types: '${Object.keys(
          types
        ).toString()}'`
      );
    }
    let resolve = config.$resolvers[resolver].resolve;
    if (!isFunction(resolve) && !Array.isArray(resolve)) {
      /* Take the first method inside file for resolver */
      let firstKey: string;
      for (var key in resolve) {
        firstKey = key;
        break;
      }
      if (!resolve[firstKey]) {
        throw new Error(
          `Missing resolver for ${JSON.stringify(config.$resolvers[resolver])}`
        );
      }
      if (isFunction(resolve[firstKey])) {
        resolve = resolve[firstKey];
      }
    }

    resolve =  isFunction(resolve) ? resolve : () => resolve;

    bootstrap.Fields.query[resolver] = {
      type: types[type],
      method_name: resolver,
      args: buildArgumentsSchema(config, resolver),
      public: true,
      method_type: 'query',
      target: () => {},
      resolve
    } as any;
  });
}
