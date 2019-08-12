import {
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLScalarType,
  GraphQLType
} from 'graphql';
import { GlobalUnion } from '../app/app.tokens';
import { Container, InjectionToken } from '@rxdi/core';
import { of, isObservable } from 'rxjs';

export function ParseTypesSchema(
  ck: GlobalUnion,
  key: string,
  interceptors: InjectionToken<(...args: any[]) => any>[]
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
  if (!type) {
    throw new Error(`Wrong plugged type ${ck}`)
  }

  type['resolve'] = async function(...args) {
    let defaultValue = args[0][key];
    for (const interceptor of interceptors) {
      defaultValue = await Container.get(interceptor)(
        of(defaultValue),
        args[0],
        args[1],
        args[2],
        args[3]
      );
      if (isObservable(defaultValue)) {
        defaultValue = await defaultValue.toPromise();
      }
    }
    return defaultValue;
  };
  return type;
}
