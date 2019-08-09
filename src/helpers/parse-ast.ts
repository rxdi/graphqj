import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} from 'graphql';

export function ParseArgs(ck, type) {
  /* Basic */
  if (ck === 'string' || ck === 'String') {
    type = { type: GraphQLString };
  }

  if (ck === 'boolean' || ck === 'Boolean' || ck === 'Bool') {
    type = { type: GraphQLBoolean };
  }

  if (ck === 'number' || ck === 'Number' || ck === 'Int') {
    type = { type: GraphQLInt };
  }

  /* False negative */
  if (ck === 'string!' || ck === 'String!') {
    type = { type: new GraphQLNonNull(GraphQLString) };
  }

  if (ck === 'boolean!' || ck === 'Boolean!') {
    type = { type: new GraphQLNonNull(GraphQLString) };
  }

  if (ck === 'number!' || ck === 'Number!' || ck === 'Int') {
    type = { type: new GraphQLNonNull(GraphQLInt) };
  }

  /* Array */
  if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
    type = { type: new GraphQLList(GraphQLString) };
  }

  if (
    ck === 'boolean[]' ||
    ck === 'Boolean[]' ||
    ck === '[Boolean]' ||
    ck === '[Bool]'
  ) {
    type = { type: new GraphQLList(GraphQLBoolean) };
  }

  if (
    ck === 'number[]' ||
    ck === 'Number[]' ||
    ck === '[Number]' ||
    ck === '[Int]'
  ) {
    type = { type: new GraphQLList(GraphQLInt) };
  }

  /* False negative Array */
  if (ck === 'string[]!' || ck === 'String[]!' || ck === '[String]!') {
    type = {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString))
    };
  }

  if (
    ck === 'boolean[]!' ||
    ck === 'Boolean[]!' ||
    ck === '[Boolean]!' ||
    ck === '[Bool]'
  ) {
    type = {
      type: new GraphQLNonNull(new GraphQLList(GraphQLBoolean))
    };
  }

  if (
    ck === 'number[]!' ||
    ck === 'Number[]!' ||
    ck === '[Number]!' ||
    ck === '[Int]!'
  ) {
    type = {
      type: new GraphQLNonNull(new GraphQLList(GraphQLInt))
    };
  }
  return type;
}
