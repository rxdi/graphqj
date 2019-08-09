import {
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLScalarType,
  GraphQLType
} from 'graphql';
import { GlobalUnion } from '../app/app.tokens';

export function ParseTypesSchema(ck: GlobalUnion) {
  let key: { type: GraphQLScalarType | GraphQLList<GraphQLType> };
  if (ck === 'string' || ck === 'String') {
    key = { type: GraphQLString };
  }

  if (ck === 'boolean' || ck === 'Boolean') {
    key = { type: GraphQLString };
  }

  if (ck === 'number' || ck === 'Number') {
    key = { type: GraphQLInt };
  }

  if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
    key = { type: new GraphQLList(GraphQLString) };
  }

  if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]') {
    key = { type: new GraphQLList(GraphQLString) };
  }

  if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]') {
    key = { type: new GraphQLList(GraphQLInt) };
  }
  return key;
}
