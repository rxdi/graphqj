import { GraphQLFieldResolver } from 'graphql';

import { getMutationFields } from '../helpers/get-mutations-fields';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MutationResolverMutator(field: string, resolve: GraphQLFieldResolver<any, any>) {
  const query = getMutationFields()[field];
  query.resolve = resolve;
  return query;
}
