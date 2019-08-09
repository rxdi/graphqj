import { GraphQLObjectType } from 'graphql';
import { BootstrapService, Container } from '@gapi/core';
import { TypesToken, Config } from '../app/app.tokens';
import { ParseArgs } from './parse-ast';
import { buildArgumentsSchema } from './parse-args-schema';
import { ParseTypesSchema } from './parse-types.schema';

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
      const ck = config.$args[reusableArgumentKey][o];
      args[o] = ParseArgs(ck, args[o]);
      Arguments.set(reusableArgumentKey, args);
    });
  });
  Object.keys(config.$types).forEach(type => {
    if (types[type]) {
      return;
    }
    Object.keys(config.$types[type]).forEach(key => {
      types[type] = types[type] || {};
      types[type][key] = ParseTypesSchema(config.$types[type][key]);
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
