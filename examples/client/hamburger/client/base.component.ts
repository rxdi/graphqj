import { Injector } from '@rxdi/core';
import {
  ApolloClient,
  QueryOptions,
  MutationOptions,
  SubscriptionOptions
} from '@rxdi/graphql-client';
import { from, Observable } from 'rxjs';
import { LitElement } from '@rxdi/lit-html';

export class BaseComponent extends LitElement {
  @Injector(ApolloClient) public graphql: ApolloClient;

  query<T = any>(options: QueryOptions) {
    return from(this.graphql.query.bind(this.graphql)(
      options
    ) as any) as Observable<{ data: T }>;
  }

  mutate<T = any>(options: MutationOptions) {
    return from(this.graphql.mutate.bind(this.graphql)(
      options
    ) as any) as Observable<{ data: T }>;
  }

  subscribe<T = any>(options: SubscriptionOptions) {
    return from(this.graphql.subscribe.bind(this.graphql)(
      options
    ) as any) as Observable<{ data: T }>;
  }
}
