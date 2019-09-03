import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLEnumType } from 'graphql';

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
      type: new GraphQLList(GraphQLString)
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
