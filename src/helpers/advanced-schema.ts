import {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean
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
      const currentKey = config.$types[type][key];
      if (currentKey === 'string' || currentKey === 'String') {
        types[type][key] = { type: GraphQLString };
      }

      if (currentKey === 'boolean' || currentKey === 'Boolean') {
        types[type][key] = { type: GraphQLString };
      }

      if (currentKey === 'number' || currentKey === 'Number') {
        types[type][key] = { type: GraphQLInt };
      }

      if (currentKey === 'string[]' || currentKey === 'String[]') {
        types[type][key] = { type: new GraphQLList(GraphQLString) };
      }
      if (currentKey === 'boolean[]' || currentKey === 'Boolean[]') {
        types[type][key] = { type: new GraphQLList(GraphQLString) };
      }

      if (currentKey === 'number[]' || currentKey === 'Number[]') {
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
      const currentArg = args[a];
      if (currentArg === 'string' || currentArg === 'String') {
        fields[a] = { type: GraphQLString };
      }

      if (currentArg === 'boolean' || currentArg === 'Boolean') {
        fields[a] = { type: GraphQLBoolean };
      }

      if (currentArg === 'string[]' || currentArg === 'String[]') {
        fields[a] = { type: new GraphQLList(GraphQLString) };
      }

      if (currentArg === 'boolean[]' || currentArg === 'Boolean[]') {
        fields[a] = { type: new GraphQLList(GraphQLBoolean) };
      }

      if (currentArg === 'string!' || currentArg === 'String!') {
        fields[a] = { type: new GraphQLNonNull(GraphQLString) };
      }

      if (currentArg === 'boolean!' || currentArg === 'Boolean!') {
        fields[a] = { type: new GraphQLNonNull(GraphQLString) };
      }

      if (currentArg === 'string[]!' || currentArg === 'String[]!') {
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
