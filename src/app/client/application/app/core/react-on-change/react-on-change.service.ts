import { Injectable, Inject, Container } from '@rxdi/core';
import { from, BehaviorSubject } from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import {
  html,
  unsafeHTML,
  LitElement,
  Component,
  async,
  TemplateObservable,
  TemplateResult,
  property
} from '@rxdi/lit-html';
import { ISubscription, IClientViewType } from '../../../../../@introspection';
import { Router } from '@rxdi/router';
import { ExternalImporter } from '@rxdi/core';

@Injectable()
export class ReactOnChangeService {
  @Inject(ApolloClient)
  private apollo: ApolloClient;
  loadedComponents: Map<string, BehaviorSubject<string>> = new Map();
  @Inject(ExternalImporter)
  private importer: ExternalImporter;
  routes = []
  @Router()
  private router: Router;
  clientReady: boolean;

  subscribeToAppChanges() {
    const app = from(
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
      tap(views => {
        this.routes = [];
        views.forEach(v => {
          const selector = `${v.name}-component`;
          if (v.name === 'app') {
            return;
          }
          let observable: BehaviorSubject<string>;
          const exists = this.loadedComponents.get(selector);
          if (exists) {
            this.routes.push(            {
              path: `/${v.name}`,
              component: selector
            })
            exists.next(v.html)
            return;
          } else {
            observable = new BehaviorSubject(v.html)
          }

          @Component({
            selector
          })
          class NewElement extends LitElement {
            @TemplateObservable()
            private templateObservable = observable.pipe(map(h => html`${unsafeHTML(h)}`));
            render() {
              return html`${this.templateObservable}`;
            }
          }
          this.routes.push(            {
            path: `/${v.name}`,
            component: selector
          })
          this.loadedComponents.set(selector, observable);
        });
        this.router.setRoutes([
          {
            path: '/',
            component: 'home-component'
          },
          ...this.routes,
          {
            path: '(.*)',
            component: 'not-found-component'
          }
        ]);
      }),
      map(views => this.getApp(views))
    );
    if (!this.clientReady) {
      setTimeout(async () => {
        await this.ready();
        this.clientReady = true;
      }, 100);
    }
    return app;
  }

  async ready() {
    await this.apollo.query({
      query: gql`
        query {
          clientReady {
            status
          }
        }
      `
    });
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
        // location.reload();
        return;
      }
      const scriptFileEl = document.createElement('script');
      scriptFileEl.setAttribute('async', '');
      scriptFileEl.setAttribute('src', link);
      this.loadedComponents.set(link, scriptFileEl as any);
      document.body.appendChild(scriptFileEl);
    });
  }
}
