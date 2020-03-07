import { Container, createUniqueHash, InjectionToken } from '@rxdi/core';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';

import { Config, Externals, GlobalUnion, Roots } from '../../../app/app.tokens';
import { ParseTypesSchema } from '../../parse-types.schema';
function findInterceptor(symbol: string, method: string, externals: Externals[]) {
  const usedExternalModule = externals.find(s => s.map === symbol);
  if (!usedExternalModule.module[method]) {
    throw new Error(`Missing method ${method} inside ${usedExternalModule.file}`);
  }
  return usedExternalModule.module[method];
}
function getSymbolInjectionToken(symbol: string, method: string, externals: Externals[]) {
  const interceptor = findInterceptor(symbol, method, externals);
  return {
    token: new InjectionToken(createUniqueHash(`${interceptor}`)),
    interceptor,
  };
}
function setPart(externals: Externals[], resolver: string, symbolMap: string) {
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
    for (let i = parts.length; i-- > 1; ) {
      parts.splice(i, 0, symbolMap);
    }
    decorator = parts;
  }
  decorator = decorator.filter(i => !!i);

  const symbol = decorator[0];
  const methodToExecute = decorator[1].replace(/ +?/g, '');

  const { token, interceptor } = getSymbolInjectionToken(symbol, methodToExecute, externals);
  return {
    token,
    interceptor,
  };
}

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
          injector,
        };
      }
    })
    .filter(i => !!i);
}

export function buildTypes(config: Config, types, buildedSchema: GraphQLSchema) {
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
        const [symbol] = config.$externals.map(e => e.map).filter(s => resolver.includes(s));
        if (symbol) {
          const hasMultipleSymbols = [...new Set(resolver.split('=>').map(r => r.replace(/ +?/g, '').trim()))];
          if (hasMultipleSymbols.length > 2) {
            const directives = hasMultipleSymbols.slice(1, hasMultipleSymbols.length);
            for (const injectorSymbol of getInjectorSymbols(config.$externals, directives)) {
              Container.set(injectorSymbol.token, injectorSymbol.method);
              interceptors.push(injectorSymbol.token);
            }
          } else {
            const { token, interceptor } = setPart(config.$externals, resolver, symbol);
            Container.set(token, interceptor);
            interceptors.push(token);
          }
          resolver = Object.keys(Roots)
            .map(node => {
              const types = Object.keys(Roots[node]).filter(key => resolver.includes(key));
              if (types.length) {
                return types[0];
              }
            })
            .filter(i => !!i)[0] as GlobalUnion;
        }
      }
      types[type][key] = ParseTypesSchema(resolver, key, type, interceptors, types);
    });
    buildedSchema[type] = new GraphQLObjectType({
      name: type,
      fields: () => types[type],
    });
  });
}
