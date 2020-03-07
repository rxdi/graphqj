import { GraphQLObjectType, GraphQLString } from 'graphql';

export const ClientReadyStatusType = new GraphQLObjectType({
  name: 'ClientReadyStatusType',
  fields: () => ({
    status: {
      type: GraphQLString,
    },
  }),
});
