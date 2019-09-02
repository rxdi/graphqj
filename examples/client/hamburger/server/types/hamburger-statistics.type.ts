import { GraphQLObjectType, GraphQLInt } from 'graphql';

export const HamburgerStatisticsType = new GraphQLObjectType({
  name: 'HamburgerStatisticsType',
  fields: () => ({
    clicks: {
      type: GraphQLInt
    }
  })
});
