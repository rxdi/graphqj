import { getQueryFields } from '../helpers/get-query-fields';
import { GraphQLFieldResolver } from 'graphql';

export function QueryResolverMutator(
  field: string,
  resolve: GraphQLFieldResolver<any, any>
) {
  const query = getQueryFields()[field];
  query.resolve = resolve;
  return query;
}
