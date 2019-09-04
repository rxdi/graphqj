import { strEnum } from '../helpers/string-to-enum';

export const GraphqlRequestTypes = strEnum([
  'query',
  'mutation',
  'subscription'
]);
export type GraphqlRequestTypes = keyof typeof GraphqlRequestTypes;
