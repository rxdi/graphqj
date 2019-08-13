import { GraphQLObjectType, GraphQLSchema } from 'graphql';
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
  Externals,
  ResolverDependencies
} from '../app/app.tokens';
import { buildArgumentsSchema } from './parse-args-schema';
import { ParseTypesSchema } from './parse-types.schema';
import { isFunction } from './isFunction';
import { lazyTypes } from './lazy-types';
import { getFirstItem } from './get-first-item';
import { buildArguments } from '../helpers/dynamic-schema/mutators/build-arguments';
import { buildTypes } from '../helpers/dynamic-schema/mutators/build-types';
import { buildResolvers } from '../helpers/dynamic-schema/mutators/build-resolvers';

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

export async function MakeAdvancedSchema(config: Config) {
  const types = {};
  const buildedSchema: GraphQLSchema = {} as any;
  config.$args = config.$args || {};
  buildArguments(config);
  buildTypes(config, types, buildedSchema);
  buildResolvers(config, types, buildedSchema);
  return buildedSchema;
}
