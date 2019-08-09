import {
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType
} from 'graphql';
import { BootstrapService } from '@gapi/core';

export function MakeBasicSchema(config, bootstrap: BootstrapService) {
  Object.keys(config.$resolvers).forEach(method_name => {
    const resolve = config.$resolvers[method_name];
    const fields = {};
    const args = {};

    Object.keys(resolve).forEach(key => {
      if (typeof resolve[key] === 'string') {
        fields[key] = { type: GraphQLString };
      }

      if (typeof resolve[key] === 'number') {
        fields[key] = { type: GraphQLInt };
      }
      if (typeof resolve[key] !== 'string' && resolve[key].length) {
        if (typeof resolve[key][0] === 'string') {
          fields[key] = { type: new GraphQLList(GraphQLString) };
        }

        if (typeof resolve[key][0] === 'number') {
          fields[key] = { type: new GraphQLList(GraphQLInt) };
        }
      }
    });
    bootstrap.Fields.query[method_name] = {
      type: new GraphQLObjectType({
        name: `${method_name}_type`,
        fields: () => fields
      }),
      args,
      method_name,
      public: true,
      method_type: 'query',
      target: () => {},
      resolve: typeof resolve === 'function' ? resolve : () => resolve
    } as any;
  });
}
