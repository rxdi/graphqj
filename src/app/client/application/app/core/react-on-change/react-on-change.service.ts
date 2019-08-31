import { Injectable, Inject } from '@rxdi/core';
import { from, of } from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map, tap, switchMap, combineLatest } from 'rxjs/operators';
import { html, unsafeHTML } from '@rxdi/lit-html';
import { ISubscription, IClientViewType } from '../../../../../@introspection';
import { Router } from '@rxdi/router';
import { ExternalImporter } from '@rxdi/core';

@Injectable()
export class ReactOnChangeService {
  @Inject(ApolloClient)
  private apollo: ApolloClient;
  loadedComponents: Map<string, any> = new Map();
  @Inject(ExternalImporter)
  private importer: ExternalImporter;

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
                components
              }
            }
          }
        `
      })
    ).pipe(
      map(({ data }) => data.listenForChanges.views),
      tap(views =>
        this.loadDynamicBundles(
          [].concat(...views.map(v => v.components)).filter(i => !!i)
        )
      ),
      map(views => this.getApp(views))
    );
  }

  getApp(views: IClientViewType[]) {
    return this.parseHtml(views.find(v => v.name === 'app').html);
  }

  parseHtml(template: string) {
    return html`
      ${unsafeHTML(template)}
    `;
  }

  loadDynamicBundles(bundles: string[]) {
    bundles.forEach(link => {
      if (this.loadedComponents.has(link)) {
        return;
      }
      const scriptFileEl = document.createElement('script');
      scriptFileEl.setAttribute('async', '');
      scriptFileEl.setAttribute('src', link);
      this.loadedComponents.set(link, scriptFileEl);
      document.body.appendChild(scriptFileEl);
    });
  }
}
