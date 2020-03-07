import { GraphQLObjectType, GraphQLString } from 'graphql';

export const ComponentsType = new GraphQLObjectType({
  name: 'ComponentsType',
  fields: {
    link: {
      type: GraphQLString,
    },
    selector: {
      type: GraphQLString,
    },
  },
});
