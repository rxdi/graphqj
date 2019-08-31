import { Injectable, Inject } from '@rxdi/core';
import { from } from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { html, unsafeHTML } from '@rxdi/lit-html';

@Injectable()
export class ReactOnChangeService {
  @Inject(ApolloClient) private apollo: ApolloClient;
  react() {
    return from(
      this.apollo.subscribe({
        query: gql`
          subscription {
            listenForChanges {
              html
            }
          }
        `
      })
    ).pipe(
      map(({ data }) => data.listenForChanges.html),
      map(template => this.parseHtml(template))
    );
  }

  parseHtml(template: string) {
    return html`
      ${unsafeHTML(template)}
    `;
  }
}
