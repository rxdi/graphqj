import { getMutationFields } from '../helpers/get-mutations-fields';
import { GraphQLFieldResolver } from 'graphql';

export function MutationResolverMutator(
  field: string,
  resolve: GraphQLFieldResolver<any, any>
) {
  const query = getMutationFields()[field];
  query.resolve = resolve;
  return query;
}
