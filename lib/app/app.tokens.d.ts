import { InjectionToken } from '@rxdi/core';
import { GraphQLInputFieldConfigMap } from 'graphql';
export declare const BooleanUnion: {
    boolean: "boolean";
    Boolean: "Boolean";
    Bool: "Bool";
    "Boolean[]": "Boolean[]";
    "boolean[]": "boolean[]";
    "[Boolean]": "[Boolean]";
    "[Bool]": "[Bool]";
    "boolean!": "boolean!";
    "Boolean!": "Boolean!";
    "[Boolean]!": "[Boolean]!";
    "boolean[]!": "boolean[]!";
    "Boolean[]!": "Boolean[]!";
};
export declare const StringUnion: {
    string: "string";
    String: "String";
    "String[]": "String[]";
    "string[]": "string[]";
    "[String]": "[String]";
    "string!": "string!";
    "String!": "String!";
    "String[]!": "String[]!";
    "string[]!": "string[]!";
    "[String]!": "[String]!";
};
export declare const IntegerUnion: {
    number: "number";
    Int: "Int";
    integer: "integer";
    Number: "Number";
    Num: "Num";
    int: "int";
    "Number[]": "Number[]";
    "number[]": "number[]";
    "[Number]": "[Number]";
    "number!": "number!";
    "[Int]": "[Int]";
    "Number!": "Number!";
    "number[]!": "number[]!";
    "Number[]!": "Number[]!";
    "[Number]!": "[Number]!";
    "[Int]!": "[Int]!";
};
export declare type BooleanUnion = keyof typeof BooleanUnion;
export declare type StringUnion = keyof typeof StringUnion;
export declare type IntegerUnion = keyof typeof IntegerUnion;
export declare type GlobalUnion = BooleanUnion | StringUnion | IntegerUnion;
export declare const Roots: {
    booleanNode: {
        boolean: "boolean";
        Boolean: "Boolean";
        Bool: "Bool";
        "Boolean[]": "Boolean[]";
        "boolean[]": "boolean[]";
        "[Boolean]": "[Boolean]";
        "[Bool]": "[Bool]";
        "boolean!": "boolean!";
        "Boolean!": "Boolean!";
        "[Boolean]!": "[Boolean]!";
        "boolean[]!": "boolean[]!";
        "Boolean[]!": "Boolean[]!";
    };
    stringNode: {
        string: "string";
        String: "String";
        "String[]": "String[]";
        "string[]": "string[]";
        "[String]": "[String]";
        "string!": "string!";
        "String!": "String!";
        "String[]!": "String[]!";
        "string[]!": "string[]!";
        "[String]!": "[String]!";
    };
    numberNode: {
        number: "number";
        Int: "Int";
        integer: "integer";
        Number: "Number";
        Num: "Num";
        int: "int";
        "Number[]": "Number[]";
        "number[]": "number[]";
        "[Number]": "[Number]";
        "number!": "number!";
        "[Int]": "[Int]";
        "Number!": "Number!";
        "number[]!": "number[]!";
        "Number[]!": "Number[]!";
        "[Number]!": "[Number]!";
        "[Int]!": "[Int]!";
    };
};
export declare type Args = {
    [key: string]: GlobalUnion;
};
export declare type Externals = {
    map: string;
    file: string;
    module?: any;
    transpiledFile?: string;
};
export interface ResolverDependencies {
    provide: string;
    map: string;
    container: any;
}
export interface Resolver {
    [key: string]: {
        type: string;
        args: Args;
        resolve: any;
        method: 'Query' | 'Mutation' | 'Subscription' | 'query' | 'mutation' | 'subscription';
        deps?: ResolverDependencies[];
    };
}
export interface Config {
    $mode: 'basic' | 'advanced';
    $types: {
        [key: string]: Args;
    };
    $resolvers: Resolver;
    $directives: string;
    $externals: Externals[];
    $args: any;
    $views?: {
        [key: string]: {
            query: string;
            payload: any;
            html: string;
        };
    };
}
export declare const TypesToken: InjectionToken<Map<string, GraphQLInputFieldConfigMap>>;
export declare const ArgumentsToken: InjectionToken<Map<string, Args>>;
export declare const ResolversToken: InjectionToken<Map<string, Args>>;
export declare const GuardsToken: InjectionToken<Map<string, Args>>;
export declare const Config: InjectionToken<Map<string, Args>>;
export declare type TypesToken = Map<string, Args>;
export declare type ArgumentsToken = Map<string, Args>;
export declare type ResolversToken = Map<string, Args>;
export declare type GuardsToken = Map<string, Args>;
