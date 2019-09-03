import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType
} from 'graphql';
import { ComponentsType } from './components.type';

export const ClientViewType = new GraphQLObjectType({
  name: 'ClientViewType',
  fields: () => ({
    html: {
      type: GraphQLString
    },
    lhtml: {
      type: GraphQLString
    },
    components: {
      type: new GraphQLList(ComponentsType)
    },
    name: {
      type: GraphQLString
    },
    policy: {
      type: GraphQLString
    },
    query: {
      type: GraphQLString
    },
    props: {
      type: new GraphQLList(GraphQLString)
    },
    output: {
      type: GraphQLString
    }
  })
});
