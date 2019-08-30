import { Injector } from '@rxdi/core';
import { html, Component, async, unsafeHTML } from '@rxdi/lit-html';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @customElement app-component
 */
@Component({
  selector: 'app-component',
  template(this: AppComponent) {
    return html`
      ${async(
        from(
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
        )
      )}
    `;
  },
  container: document.body
})
export class AppComponent extends HTMLElement {
  @Injector(ApolloClient) private apollo: ApolloClient;

  parseHtml(template: string) {
    return html`
      ${unsafeHTML(template)}
    `;
  }
}
