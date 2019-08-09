import {
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLScalarType,
  GraphQLType
} from 'graphql';
import { GlobalUnion } from '../app/app.tokens';
import { Container, InjectionToken } from '@rxdi/core';

export function ParseTypesSchema(
  ck: GlobalUnion,
  key: string,
  validators: InjectionToken<((value: any) => any)>[],
  interceptor?: (value: any) => any
) {
  let type: { type: GraphQLScalarType | GraphQLList<GraphQLType> };
  if (ck === 'string' || ck === 'String') {
    type = { type: GraphQLString };
  }

  if (ck === 'boolean' || ck === 'Boolean') {
    type = { type: GraphQLString };
  }

  if (ck === 'number' || ck === 'Number') {
    type = { type: GraphQLInt };
  }

  if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
    type = { type: new GraphQLList(GraphQLString) };
  }

  if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]') {
    type = { type: new GraphQLList(GraphQLString) };
  }

  if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]') {
    type = { type: new GraphQLList(GraphQLInt) };
  }
  type['resolve'] = async function(...args) {
    let defaultValue = args[0][key];
    for (const validator of validators) {
      await Container.get(validator)(defaultValue);
    }
    if (interceptor) {
      defaultValue = await interceptor(defaultValue)
    }
    return defaultValue;
  };
  return type;
}
