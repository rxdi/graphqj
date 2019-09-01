import { Injector } from '@rxdi/core';
import { from, Observable } from 'rxjs';
import { LitElement } from '@rxdi/lit-html';
import { DataProxy } from 'apollo-cache';
import {
  ApolloClient,
  importQuery,
  QueryOptions,
  SubscriptionOptions,
  MutationOptions
} from '@rxdi/graphql-client';

export class BaseComponent extends LitElement {
  @Injector(ApolloClient)
  public graphql: ApolloClient;

  query<T = {}>(options: ImportQueryMixin, raw?: boolean) {
    return from(this.graphql.query.bind(this.graphql)(
      options
    ) as any) as Observable<{ data: T }>;
  }

  mutate<T = {}>(options: ImportMutationMixin, raw?: boolean) {
    return from(this.graphql.mutate.bind(this.graphql)(
      options
    ) as any) as Observable<{ data: T }>;
  }

  mutation<T = {}>(options: ImportMutationMixin, raw?: boolean) {
    return this.mutate(options, raw)  as Observable<{ data: T }>;
  }

  subscribe<T = {}>(options: ImportSubscriptionMixin, raw?: boolean) {
    return from(this.graphql.subscribe.bind(this.graphql)(
      options
    ) as any) as Observable<{ data: T }>;
  }
}

interface ImportQueryMixin extends QueryOptions {
  query: any;
}

interface ImportSubscriptionMixin extends SubscriptionOptions {
  query: any;
}

interface ImportMutationMixin extends MutationOptions {
  mutation: any;
  update?(proxy: DataProxy, res: { data: any }): void;
}
