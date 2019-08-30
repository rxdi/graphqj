import { GraphQLObjectType, GraphQLString } from 'graphql';

export const ClientType = new GraphQLObjectType({
  name: 'ClientType',
  fields: {
    html: {
      type: GraphQLString
    }
  }
});
