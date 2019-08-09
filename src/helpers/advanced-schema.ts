import {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull
} from 'graphql';
import { BootstrapService } from '@gapi/core';

export function MakeAdvancedSchema(config, bootstrap: BootstrapService) {
  const types = {};

  Object.keys(config.$types).forEach(type => {
    if (types[type]) {
      return;
    }
    Object.keys(config.$types[type]).forEach(key => {
      types[type] = types[type] || {};
      if (config.$types[type][key] === 'string') {
        types[type][key] = { type: GraphQLString };
      }
      if (config.$types[type][key] === 'string[]') {
        types[type][key] = { type: new GraphQLList(GraphQLString) };
      }
      if (config.$types[type][key] === 'number') {
        types[type][key] = { type: GraphQLInt };
      }
      if (config.$types[type][key] === 'number[]') {
        types[type][key] = { type: new GraphQLList(GraphQLInt) };
      }
    });
    types[type] = new GraphQLObjectType({
      name: type,
      fields: types[type]
    });
  });
  const buildArgumentsSchema = (args: { [key: string]: string }) => {
    const fields = {};
    args = args || fields;
    Object.keys(args).forEach(a => {
      if (args[a] === 'string') {
        fields[a] = { type: GraphQLString };
      }

      if (args[a] === 'string[]') {
        fields[a] = { type: new GraphQLList(GraphQLString) };
      }

      if (args[a] === 'string!') {
        fields[a] = { type: new GraphQLNonNull(GraphQLString) };
      }

      if (args[a] === 'string[]!') {
        fields[a] = {
          type: new GraphQLNonNull(new GraphQLList(GraphQLString))
        };
      }
    });
    return fields;
  };
  Object.keys(config.$resolvers).forEach(method_name => {
    const resolve = config.$resolvers[method_name].resolve;
    const type = config.$resolvers[method_name].type;
    if (!types[type]) {
      throw new Error(
        `Missing type '${type}', Available types: '${Object.keys(
          types
        ).toString()}'`
      );
    }
    bootstrap.Fields.query[method_name] = {
      type: types[type],
      method_name,
      args: buildArgumentsSchema(config.$resolvers[method_name].args),
      public: true,
      method_type: 'query',
      target: () => {},
      resolve: typeof resolve === 'function' ? resolve : () => resolve
    } as any;
  });
}
