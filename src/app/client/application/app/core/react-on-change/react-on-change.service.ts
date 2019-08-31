import { Injectable, Inject } from '@rxdi/core';
import { from } from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { html, unsafeHTML } from '@rxdi/lit-html';
import { ISubscription, IClientViewType } from '../../../../../@introspection';
import { Router } from '@rxdi/router';

@Injectable()
export class ReactOnChangeService {
  @Inject(ApolloClient)
  private apollo: ApolloClient;

  @Router()
  private router: Router;
  react() {
    return from(
      this.apollo.subscribe<ISubscription>({
        query: gql`
          subscription {
            listenForChanges {
              views {
                html
                query
                props
                output
              }
            }
          }
        `
      })
    ).pipe(
      map(({ data }) => data.listenForChanges.views),
      map(views => this.parseViews(views))
    );
  }

  parseViews(views: IClientViewType[]) {
    return this.parseHtml(views[0].html);
  }

  parseHtml(template: string) {
    return html`
      ${unsafeHTML(template)}
    `;
  }
}
