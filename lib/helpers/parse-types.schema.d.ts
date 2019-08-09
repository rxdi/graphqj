import { GraphQLList, GraphQLScalarType, GraphQLType } from 'graphql';
import { GlobalUnion } from '../app/app.tokens';
export declare function ParseTypesSchema(ck: GlobalUnion, key: string, validators: ((value: any) => any)[], interceptor?: (value: any) => any): {
    type: GraphQLScalarType | GraphQLList<GraphQLType>;
};
