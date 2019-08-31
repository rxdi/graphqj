import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';

export const ClientViewType = new GraphQLObjectType({
  name: 'ClientViewType',
  fields: () => ({
    html: {
      type: GraphQLString
    },
    components: {
      type: new GraphQLList(GraphQLString)
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
