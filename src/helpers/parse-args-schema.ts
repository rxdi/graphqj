import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { Container } from '@rxdi/core';
import { ParseArgs } from './parse-ast';
import { Config, TypesToken } from '../app/app.tokens';

const InputObjectTypes = new Map<string, GraphQLInputObjectType>();

export const buildArgumentsSchema = (config: Config, resolver: string) => {
  let args = config.$resolvers[resolver].args || {};
  let fields = {};
  const Arguments = Container.get(TypesToken);
  Object.keys(args).forEach(a => {
    const name = args[a].replace('!', '');
    if (Arguments.has(name)) {
      let reusableType = new GraphQLInputObjectType({
        name,
        fields: () => Arguments.get(name) as any
      });
      if (InputObjectTypes.has(name)) {
        reusableType = InputObjectTypes.get(name);
      }
      InputObjectTypes.set(name, reusableType);
      if (args[a].includes('!')) {
        fields = {
          payload: {
            type: new GraphQLNonNull(reusableType)
          }
        };
      } else {
        fields = {
          payload: {
            type: reusableType
          }
        };
      }
      return;
    }
    fields[a] = ParseArgs(args[a], fields[a]);
  });
  return fields;
};
