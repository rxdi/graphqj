import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { ClientViewType } from './client-view.type';
import { ComponentsType } from './components.type';

export const ClientType = new GraphQLObjectType({
  name: 'ClientType',
  fields: {
    components: {
      type: new GraphQLList(ComponentsType),
    },
    views: {
      type: new GraphQLList(ClientViewType),
    },
    schema: {
      type: GraphQLString,
    },
  },
});
