import { GraphQLList, GraphQLScalarType, GraphQLType } from 'graphql';
import { GlobalUnion } from '../app/app.tokens';
import { InjectionToken } from '@rxdi/core';
export declare function ParseTypesSchema(ck: GlobalUnion, key: string, parentType: string, interceptors: InjectionToken<(...args: any[]) => any>[], types: any): {
    type: GraphQLScalarType | GraphQLList<GraphQLType>;
};
