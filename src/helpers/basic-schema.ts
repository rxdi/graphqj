import { BootstrapService, Container } from '@gapi/core';
import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { Config } from '../app/app.tokens';

export function MakeBasicSchema(config: Config) {
  Object.keys(config.$resolvers).forEach(method_name => {
    const resolve = config.$resolvers[method_name];
    const fields = {};
    const args = {};

    Object.keys(resolve).forEach(key => {
      const resolver = resolve[key];
      if (typeof resolver === 'string') {
        fields[key] = { type: GraphQLString };
      }

      if (typeof resolver === 'number') {
        fields[key] = { type: GraphQLInt };
      }
      if (typeof resolver === 'boolean') {
        fields[key] = { type: GraphQLBoolean };
      }
      if (typeof resolver !== 'string' && resolver.length) {
        if (typeof resolver[0] === 'string') {
          fields[key] = { type: new GraphQLList(GraphQLString) };
        }

        if (typeof resolver[0] === 'number') {
          fields[key] = { type: new GraphQLList(GraphQLInt) };
        }
        if (typeof resolver[0] === 'boolean') {
          fields[key] = { type: new GraphQLList(GraphQLBoolean) };
        }
      }
    });
    Container.get(BootstrapService).Fields.query[method_name] = {
      type: new GraphQLObjectType({
        name: `${method_name}_type`,
        fields: () => fields,
      }),
      args,
      method_name,
      public: true,
      method_type: 'query',
      target: () => ({}),
      resolve: typeof resolve === 'function' ? resolve : () => resolve,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });
}
