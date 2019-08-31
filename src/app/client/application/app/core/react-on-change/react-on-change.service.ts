import { Injectable, Inject } from '@rxdi/core';
import { from } from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import { html, unsafeHTML } from '@rxdi/lit-html';
import { ISubscription, IClientViewType } from '../../../../../@introspection';
import { Router } from '@rxdi/router';

@Injectable()
export class ReactOnChangeService {
  @Inject(ApolloClient)
  private apollo: ApolloClient;

  @Router()
  private router: Router;

  subscribeToAppChanges() {
    return from(
      this.apollo.subscribe<ISubscription>({
        query: gql`
          subscription {
            listenForChanges {
              views {
                name
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
      tap((views) => {
        }),
      map(views => this.getApp(views))
    );
  }

  getApp(views : IClientViewType[]) {
    return this.parseHtml(views.find(v => v.name === 'app').html)
  }

  parseViews(views: IClientViewType[]) {
    return this.parseHtml(`
    <router-outlet>
      <navbar-component slot="header"></navbar-component>
      <footer-component slot="footer"></footer-component>
    </router-outlet>
    `);
  }

  parseHtml(template: string) {
    return html`
      ${unsafeHTML(template)}
    `;
  }
}
