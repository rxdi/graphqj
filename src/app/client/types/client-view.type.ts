import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType
} from 'graphql';
import { ComponentsType } from './components.type';
import { IClientType, IClientViewType } from 'src/app/@introspection';

export const ClientViewType = new GraphQLObjectType({
  name: 'ClientViewType',
  fields: () => ({
    html: {
      type: GraphQLString
    },
    lhtml: {
      type: GraphQLString
    },
    rendering: {
      type: new GraphQLEnumType({
        name: 'ClientViewRenderingEnum',
        values: {
          server: {
            value: 'server'
          },
          client: {
            value: 'client'
          }
        },
      }),
      resolve: (root: IClientViewType) => !root.rendering ? 'client' : 'server'
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
