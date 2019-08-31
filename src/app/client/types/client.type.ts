import { GraphQLObjectType, GraphQLList } from 'graphql';
import { ClientViewType } from './client-view.type';

export const ClientType = new GraphQLObjectType({
  name: 'ClientType',
  fields: {
    views: {
      type: new GraphQLList(ClientViewType)
    }
  }
});
