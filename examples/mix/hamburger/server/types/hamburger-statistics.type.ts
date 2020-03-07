import { GraphQLInt, GraphQLObjectType } from 'graphql';

export const HamburgerStatisticsType = new GraphQLObjectType({
  name: 'HamburgerStatisticsType',
  fields: () => ({
    clicks: {
      type: GraphQLInt,
    },
  }),
});
