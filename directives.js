export async function toUppercase() {
  return new GraphQLCustomDirective({
    name: 'toUpperCase',
    description: 'change the case of a string to uppercase',
    locations: [DirectiveLocation.FIELD],
    resolve: async resolve => (await resolve()).toUpperCase()
  });
}

export async function toUppercase2() {
  return new GraphQLCustomDirective({
    name: 'toUpperCase2',
    description: 'change the case of a string to uppercase',
    locations: [DirectiveLocation.FIELD],
    resolve: async resolve => (await resolve()).toUpperCase()
  });
}
