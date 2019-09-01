import { InjectionToken } from '@rxdi/core';
import { GraphQLInputFieldConfigMap } from 'graphql';
import { IClientViewType } from './@introspection';

function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

export const BooleanUnion = strEnum([
  'Boolean',
  'Bool',
  'boolean',
  'Boolean[]',
  'boolean[]',
  '[Boolean]',
  '[Bool]',
  'boolean!',
  'Boolean!',
  '[Boolean]!',
  'boolean[]!',
  'Boolean[]!'
]);

export const StringUnion = strEnum([
  'String',
  'string',
  'String[]',
  'string[]',
  '[String]',
  'string!',
  'String!',
  'String[]!',
  'string[]!',
  '[String]!'
]);

export const IntegerUnion = strEnum([
  'Int',
  'integer',
  'number',
  'Number',
  'Num',
  'int',
  'Number[]',
  'number[]',
  '[Number]',
  'number!',
  '[Int]',
  'Number!',
  'number[]!',
  'Number[]!',
  '[Number]!',
  '[Int]!'
]);

export type BooleanUnion = keyof typeof BooleanUnion;
export type StringUnion = keyof typeof StringUnion;
export type IntegerUnion = keyof typeof IntegerUnion;
export type GlobalUnion = BooleanUnion | StringUnion | IntegerUnion;

export const Roots = {
  booleanNode: BooleanUnion,
  stringNode: StringUnion,
  numberNode: IntegerUnion
};

export type Args = { [key: string]: GlobalUnion };
export type Externals = {
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
    method:
      | 'Query'
      | 'Mutation'
      | 'Subscription'
      | 'query'
      | 'mutation'
      | 'subscription';
    deps?: ResolverDependencies[];
  };
}

export interface ConfigViews {
  [key: string]: IClientViewType;
}
export interface Config {
  $mode: 'basic' | 'advanced';
  $types: { [key: string]: Args };
  $resolvers: Resolver;
  $directives: string;
  $externals: Externals[];
  $args: any;
  $views?: ConfigViews;
  _meta: { [key: string]: string }; // Folder mapping for every module
}

export const TypesToken = new InjectionToken<
  Map<string, GraphQLInputFieldConfigMap>
>('(@rxdi/graphqj): types-token');
export const ArgumentsToken = new InjectionToken<Map<string, Args>>(
  '(@rxdi/graphqj): arguments-token'
);
export const ResolversToken = new InjectionToken<Map<string, Args>>(
  '(@rxdi/graphqj): resolvers-token'
);
export const GuardsToken = new InjectionToken<Map<string, Args>>(
  '(@rxdi/graphqj): resolvers-token'
);
export const IsBundlerInstalled = new InjectionToken<{
  parcel: boolean;
  gapi: boolean;
}>('(@rxdi/graphqj): is-bundler-installed');
export const Config = new InjectionToken<Config>();

export type TypesToken = Map<string, Args>;
export type ArgumentsToken = Map<string, Args>;
export type ResolversToken = Map<string, Args>;
export type GuardsToken = Map<string, Args>;
export type IsBundlerInstalled = { parcel: boolean; gapi: boolean };
