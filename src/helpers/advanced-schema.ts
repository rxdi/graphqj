import { GraphQLObjectType } from 'graphql';
import {
  BootstrapService,
  Container,
  InjectionToken,
  createUniqueHash
} from '@gapi/core';
import { TypesToken, Config, Roots, GlobalUnion } from '../app/app.tokens';
import { ParseArgs } from './parse-ast';
import { buildArgumentsSchema } from './parse-args-schema';
import { ParseTypesSchema } from './parse-types.schema';
import { join } from 'path';

export function MakeAdvancedSchema(
  config: Config,
  bootstrap: BootstrapService
) {
  const types = {};
  const Types = Container.get(TypesToken);
  const Arguments = Container.get(TypesToken);
  const Resolvers = Container.get(TypesToken);
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

      const hasSymbol = config.$externals.filter(symbol =>
        resolver.includes(symbol.map)
      );
      const interceptors = [];

      if (hasSymbol.length) {
        const isCurlyPresent = resolver.includes('{');
        let stringLeft = '(';
        let stringRight = ')';

        if (isCurlyPresent) {
          stringLeft = '{';
          stringRight = '}';
        }
        const directive = resolver.split(stringLeft);
        const decorator = directive[1].replace(stringRight, '').split('@');
        const symbol = decorator[0];
        const methodToExecute = decorator[1].replace(/ +?/g, '');
        const usedExternalModule = config.$externals.find(
          s => s.map === symbol
        );
        let m: any;
        if (process.env.LAZY) {
          m = require('esm')(module)(
            join(process.cwd(), usedExternalModule.file)
          );
        } else {
          m = usedExternalModule.module;
        }
        if (!m[methodToExecute]) {
          throw new Error(
            `Missing method ${methodToExecute} inside ${
              usedExternalModule.file
            }`
          );
        }
        const containerSymbol = new InjectionToken(
          createUniqueHash(`${m[methodToExecute]}`)
        );
        Container.set(containerSymbol, m[methodToExecute]);

        interceptors.push(containerSymbol);
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
    const resolve = config.$resolvers[resolver].resolve;
    bootstrap.Fields.query[resolver] = {
      type: types[type],
      method_name: resolver,
      args: buildArgumentsSchema(config, resolver),
      public: true,
      method_type: 'query',
      target: () => {},
      resolve: typeof resolve === 'function' ? resolve : () => resolve
    } as any;
  });
}
