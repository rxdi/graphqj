import {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';
import { BootstrapService, Container } from '@gapi/core';
import { TypesToken, Config, Args } from '../app/app.tokens';

export function MakeAdvancedSchema(
  config: Config,
  bootstrap: BootstrapService
) {
  const types = {};
  const Types = Container.get(TypesToken);
  const Arguments = Container.get(TypesToken);
  const Resolvers = Container.get(TypesToken);

  Object.keys(config.$types).forEach(type => {
    if (types[type]) {
      return;
    }
    Object.keys(config.$types[type]).forEach(key => {
      types[type] = types[type] || {};
      const ck = config.$types[type][key];

      if (ck === 'string' || ck === 'String') {
        types[type][key] = { type: GraphQLString };
      }

      if (ck === 'boolean' || ck === 'Boolean') {
        types[type][key] = { type: GraphQLString };
      }

      if (ck === 'number' || ck === 'Number') {
        types[type][key] = { type: GraphQLInt };
      }

      if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
        types[type][key] = { type: new GraphQLList(GraphQLString) };
      }

      if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]') {
        types[type][key] = { type: new GraphQLList(GraphQLString) };
      }

      if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]') {
        types[type][key] = { type: new GraphQLList(GraphQLInt) };
      }
    });
    types[type] = new GraphQLObjectType({
      name: type,
      fields: types[type]
    });
  });
  const buildArgumentsSchema = (args: Args) => {
    const fields = {};
    args = args || fields;
    Object.keys(args).forEach(a => {
      console.log(a, args[a]);
      const ck = args[a];

      /* Basic */
      if (ck === 'string' || ck === 'String') {
        fields[a] = { type: GraphQLString };
      }

      if (ck === 'boolean' || ck === 'Boolean' || ck === 'Bool') {
        fields[a] = { type: GraphQLBoolean };
      }

      if (ck === 'number' || ck === 'Number' || ck === 'Int') {
        fields[a] = { type: GraphQLInt };
      }

      /* False negative */
      if (ck === 'string!' || ck === 'String!') {
        fields[a] = { type: new GraphQLNonNull(GraphQLString) };
      }

      if (ck === 'boolean!' || ck === 'Boolean!') {
        fields[a] = { type: new GraphQLNonNull(GraphQLString) };
      }

      if (ck === 'number!' || ck === 'Number!' || ck === 'Int') {
        fields[a] = { type: new GraphQLNonNull(GraphQLInt) };
      }

      /* Array */
      if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
        fields[a] = { type: new GraphQLList(GraphQLString) };
      }

      if (
        ck === 'boolean[]' ||
        ck === 'Boolean[]' ||
        ck === '[Boolean]' ||
        ck === '[Bool]'
      ) {
        fields[a] = { type: new GraphQLList(GraphQLBoolean) };
      }

      if (
        ck === 'number[]' ||
        ck === 'Number[]' ||
        ck === '[Number]' ||
        ck === '[Int]'
      ) {
        fields[a] = { type: new GraphQLList(GraphQLInt) };
      }

      /* False negative Array */
      if (ck === 'string[]!' || ck === 'String[]!' || ck === '[String]!') {
        fields[a] = {
          type: new GraphQLNonNull(new GraphQLList(GraphQLString))
        };
      }

      if (
        ck === 'boolean[]!' ||
        ck === 'Boolean[]!' ||
        ck === '[Boolean]!' ||
        ck === '[Bool]'
      ) {
        fields[a] = {
          type: new GraphQLNonNull(new GraphQLList(GraphQLBoolean))
        };
      }

      if (
        ck === 'number[]!' ||
        ck === 'Number[]!' ||
        ck === '[Number]!' ||
        ck === '[Int]!'
      ) {
        fields[a] = {
          type: new GraphQLNonNull(new GraphQLList(GraphQLInt))
        };
      }
    });
    return fields;
  };

  Object.keys(config.$resolvers).forEach(resolver => {
    console.log(resolver);
    const resolve = config.$resolvers[resolver].resolve;
    const type = config.$resolvers[resolver].type;
    if (!types[type]) {
      throw new Error(
        `Missing type '${type}', Available types: '${Object.keys(
          types
        ).toString()}'`
      );
    }
    bootstrap.Fields.query[resolver] = {
      type: types[type],
      method_name: resolver,
      args: buildArgumentsSchema(config.$resolvers[resolver].args),
      public: true,
      method_type: 'query',
      target: () => {},
      resolve: typeof resolve === 'function' ? resolve : () => resolve
    } as any;
  });
}
