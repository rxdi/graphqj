import { Injector } from '@rxdi/core';
import { ApolloClient, MutationOptions, QueryOptions, SubscriptionOptions } from '@rxdi/graphql-client';
import { LitElement } from '@rxdi/lit-html';
import { from, Observable } from 'rxjs';

export class BaseComponent extends LitElement {
  @Injector(ApolloClient) public graphql: ApolloClient;

  query<T>(options: QueryOptions) {
    return from(this.graphql.query.bind(this.graphql)(options)) as Observable<{ data: T }>;
  }

  mutate<T>(options: MutationOptions) {
    return from(this.graphql.mutate.bind(this.graphql)(options)) as Observable<{ data: T }>;
  }

  subscribe<T>(options: SubscriptionOptions) {
    return from(this.graphql.subscribe.bind(this.graphql)(options)) as Observable<{ data: T }>;
  }
}
