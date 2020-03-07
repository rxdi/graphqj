import { GraphQLSchema } from 'graphql';

import { Config } from '../app/app.tokens';
import { buildArguments } from '../helpers/dynamic-schema/mutators/build-arguments';
import { buildResolvers } from '../helpers/dynamic-schema/mutators/build-resolvers';
import { buildTypes } from '../helpers/dynamic-schema/mutators/build-types';
import { buildExternals } from './dynamic-schema/mutators/build-externals';

export async function MakeAdvancedSchema(config: Config) {
  const types = {};
  const buildedSchema: GraphQLSchema = {} as GraphQLSchema;
  config.$args = config.$args || {};
  config.$types = config.$types || {};
  if (config.$externals && config.$externals.length) {
    config.$externals = await buildExternals(config);
  }
  buildArguments(config);
  buildTypes(config, types, buildedSchema);
  buildResolvers(config, types, buildedSchema);
  return buildedSchema;
}
