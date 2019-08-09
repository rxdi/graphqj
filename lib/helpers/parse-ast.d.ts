import { GraphQLList, GraphQLScalarType, GraphQLType } from 'graphql';
import { GlobalUnion } from '../app/app.tokens';
export declare function ParseArgs(ck: GlobalUnion): {
    type: GraphQLScalarType | GraphQLList<GraphQLType>;
};
