import { GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql';
import { ClientViewType } from './client-view.type';

export const ClientType = new GraphQLObjectType({
  name: 'ClientType',
  fields: {
    components: {
      type: new GraphQLList(GraphQLString)
    },
    views: {
      type: new GraphQLList(ClientViewType)
    },
    schema: {
      type: GraphQLString
    }
  }
});
