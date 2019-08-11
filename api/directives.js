import {
  DirectiveLocation,
  GraphQLCustomDirective,
  GraphQLNonNull,
  GraphQLString
} from '@gapi/core';

export async function toUppercase() {
  return new GraphQLCustomDirective({
    name: 'toUpperCase',
    description: 'change the case of a string to uppercase',
    locations: [DirectiveLocation.FIELD],
    resolve: async resolve => (await resolve()).toUpperCase()
  });
}

export async function AddTextDirective() {
  return new GraphQLCustomDirective({
    name: 'AddTextDirective',
    description: 'change the case of a string to uppercase',
    locations: [DirectiveLocation.FIELD],
    args: {
      inside: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'the times to duplicate the string'
      },
      outside: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'the times to duplicate the string'
      }
    },
    resolve: async (
      resolve,
      root,
      args
    ) => args.inside + (await resolve()).toUpperCase() + args.outside
  });
}