import { InjectionToken } from '@rxdi/core';
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
export interface Config {
    $mode: 'basic' | 'advanced';
    $types: {
        [key: string]: Args;
    };
    $resolvers: {
        [key: string]: {
            type: string;
            args: Args;
            resolve: any;
        };
    };
    $directives: string;
    $externals: {
        map: string;
        file: string;
        module?: any;
    }[];
    $args: any;
}
export declare const TypesToken: InjectionToken<Map<string, Args>>;
export declare const ArgumentsToken: InjectionToken<Map<string, Args>>;
export declare const ResolversToken: InjectionToken<Map<string, Args>>;
export declare const GuardsToken: InjectionToken<Map<string, Args>>;
export declare const Config: InjectionToken<Map<string, Args>>;
export declare type TypesToken = Map<string, Args>;
export declare type ArgumentsToken = Map<string, Args>;
export declare type ResolversToken = Map<string, Args>;
export declare type GuardsToken = Map<string, Args>;
