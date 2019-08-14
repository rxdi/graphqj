import { GraphQLSchema } from 'graphql';
import { Config } from '../app/app.tokens';
import { buildArguments } from '../helpers/dynamic-schema/mutators/build-arguments';
import { buildTypes } from '../helpers/dynamic-schema/mutators/build-types';
import { buildResolvers } from '../helpers/dynamic-schema/mutators/build-resolvers';

export async function MakeAdvancedSchema(config: Config) {
  const types = {};
  const buildedSchema: GraphQLSchema = {} as any;
  config.$args = config.$args || {};
  buildArguments(config);
  buildTypes(config, types, buildedSchema);
  buildResolvers(config, types, buildedSchema);
  return buildedSchema;
}
