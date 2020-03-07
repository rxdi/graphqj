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
  'Boolean[]!',
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
  '[String]!',
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
  '[Int]!',
]);

export type BooleanUnion = keyof typeof BooleanUnion;
export type StringUnion = keyof typeof StringUnion;
export type IntegerUnion = keyof typeof IntegerUnion;
export type GlobalUnion = BooleanUnion | StringUnion | IntegerUnion;
export interface IPredictedTranspilation {
  originalPath: string;
  filePath: string;
  transpilerPath: string;
  newPath: string;
  link: string;
}

export const Roots = {
  booleanNode: BooleanUnion,
  stringNode: StringUnion,
  numberNode: IntegerUnion,
};

export type Args = { [key: string]: GlobalUnion };
export type Externals = {
  map: string;
  file: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module?: any;
  transpiledFile?: string;
};

export interface IResolverDependencies {
  provide: string;
  map: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: any;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface Resolver {
  [key: string]: {
    type: string;
    args: Args;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: any;
    method: 'Query' | 'Mutation' | 'Subscription' | 'query' | 'mutation' | 'subscription';
    deps?: IResolverDependencies[];
  };
}

export interface IConfigViews {
  [key: string]: IClientViewType;
}
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface Config {
  $mode: 'basic' | 'advanced';
  $imports?: string[];
  $components?: string[] | IPredictedTranspilation[];
  $types: { [key: string]: Args };
  $resolvers: Resolver;
  $directives: string;
  $externals: Externals[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $args: any;
  $views?: IConfigViews;
  _meta: { [key: string]: string }; // Folder mapping for every module
}

export const TypesToken = new InjectionToken<Map<string, GraphQLInputFieldConfigMap>>('(@rxdi/graphqj): types-token');
export const ArgumentsToken = new InjectionToken<Map<string, Args>>('(@rxdi/graphqj): arguments-token');
export const ResolversToken = new InjectionToken<Map<string, Args>>('(@rxdi/graphqj): resolvers-token');
export const GuardsToken = new InjectionToken<Map<string, Args>>('(@rxdi/graphqj): resolvers-token');
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
