import { GraphQLObjectType, GraphQLString } from 'graphql';

export const ClientViewType = new GraphQLObjectType({
  name: 'ClientViewType',
  fields: () => ({
    html: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    query: {
      type: GraphQLString
    },
    props: {
      type: GraphQLString
    },
    output: {
      type: GraphQLString
    }
  })
});