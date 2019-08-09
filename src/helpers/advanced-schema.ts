import {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';
import { BootstrapService } from '@gapi/core';

function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
      res[key] = key;
      return res;
  }, Object.create(null));
}

const BooleanUnion = strEnum([
  'Boolean',
  'Bool',
  'boolean'
])

const StringUnion = strEnum([
  'String',
  'string'
])

const IntegerUnion = strEnum([
  'Int',
  'integer',
  'number',
  'Num',
  'int'
])

type BooleanUnion = keyof typeof BooleanUnion;
type StringUnion = keyof typeof StringUnion;
type IntegerUnion = keyof typeof IntegerUnion;

const Roots = {
  booleanNode: BooleanUnion,
  stringNode: StringUnion,
  numberNode: IntegerUnion
}

export function MakeAdvancedSchema(config, bootstrap: BootstrapService) {
  const types = {};

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
  const buildArgumentsSchema = (args: { [key: string]: string }) => {
    const fields = {};
    args = args || fields;
    Object.keys(args).forEach(a => {
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

      if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]' || ck === '[Bool]') {
        fields[a] = { type: new GraphQLList(GraphQLBoolean) };
      }

      if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]' || ck === '[Int]') {
        fields[a] = { type: new GraphQLList(GraphQLInt) };
      }

      /* False negative Array */
      if (ck === 'string[]!' || ck === 'String[]!' || ck === '[String]!') {
        fields[a] = {
          type: new GraphQLNonNull(new GraphQLList(GraphQLString))
        };
      }

      if (ck === 'boolean[]!' || ck === 'Boolean[]!' || ck === '[Boolean]!' || ck === '[Bool]') {
        fields[a] = {
          type: new GraphQLNonNull(new GraphQLList(GraphQLBoolean))
        };
      }

      if (ck === 'number[]!' || ck === 'Number[]!' || ck === '[Number]!' || ck === '[Int]!') {
        fields[a] = {
          type: new GraphQLNonNull(new GraphQLList(GraphQLInt))
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
