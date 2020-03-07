import { GraphQLFieldResolver } from 'graphql';

import { getQueryFields } from '../helpers/get-query-fields';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function QueryResolverMutator(field: string, resolve: GraphQLFieldResolver<any, any>) {
  const query = getQueryFields()[field];
  query.resolve = resolve;
  return query;
}
