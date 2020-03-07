import { Injector } from '@rxdi/core';
import { ApolloClient, MutationOptions, QueryOptions, SubscriptionOptions } from '@rxdi/graphql-client';
import { LitElement } from '@rxdi/lit-html';
import { DataProxy } from 'apollo-cache';
import { from, Observable } from 'rxjs';

export class BaseComponent extends LitElement {
  @Injector(ApolloClient)
  public graphql: ApolloClient;

  query<T = {}>(options: IImportQueryMixin) {
    return from(this.graphql.query.bind(this.graphql)(options)) as Observable<{ data: T }>;
  }

  mutate<T = {}>(options: IImportMutationMixin) {
    return from(this.graphql.mutate.bind(this.graphql)(options)) as Observable<{ data: T }>;
  }

  mutation<T = {}>(options: IImportMutationMixin) {
    return this.mutate(options) as Observable<{ data: T }>;
  }

  subscribe<T = {}>(options: IImportSubscriptionMixin) {
    return from(this.graphql.subscribe.bind(this.graphql)(options)) as Observable<{ data: T }>;
  }
}

interface IImportQueryMixin extends QueryOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
}

interface IImportSubscriptionMixin extends SubscriptionOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
}

interface IImportMutationMixin extends MutationOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update?(proxy: DataProxy, res: { data: any }): void;
}
