import { Injectable, Inject } from '@rxdi/core';
import { from, BehaviorSubject, merge, combineLatest, of } from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map, tap, filter, race } from 'rxjs/operators';
import {
  html,
  unsafeHTML,
  Component,
  TemplateObservable,
  property
} from '@rxdi/lit-html';
import { ISubscription, IClientViewType } from '../../../../../@introspection';
import { Router } from '@rxdi/router';
import { async } from '@rxdi/lit-html';
import { BaseComponent } from './base.component';
const QueryGenerator = require('graphql-query-generator'); // Remove this it is 400 KB :O 

@Injectable()
export class ReactOnChangeService {
  @Inject(ApolloClient)
  private apollo: ApolloClient;
  private loadedComponents: Map<string, BehaviorSubject<string>> = new Map();
  private routes = [];
  @Router()
  private router: Router;
  private clientReady: boolean;

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
              schema
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
      tap(async views => {
        QueryGenerator;
        const queryGenerator = new QueryGenerator(
          'http://localhost:9000/graphql'
        );
        let { queries }: { queries: string[] } = await queryGenerator.run();
        queries = queries.map((q: string) => {
          let newString: string = '';
          const gg = q.split(' ').filter(query => !query.includes(':'));
          gg.map((v: string) => (!v ? ' ' : v)).forEach(
            (v: string) => (newString += v)
          );
          return newString;
        });
        this.routes = [];
        views.forEach(v => {
          const selector = `${v.name}-component`;
          if (v.name === 'app') {
            return;
          }
          let observable: BehaviorSubject<string>;
          const exists = this.loadedComponents.get(selector);
          if (exists) {
            this.routes.push({
              path: `/${v.name}`,
              component: selector
            });
            exists.next(v.html);
            return;
          } else {
            observable = new BehaviorSubject(v.html);
          }

          @Component({ selector })
          class NewElement extends BaseComponent {
            @property()
            values: Object;

            @TemplateObservable()
            private BasicTemplate = observable.pipe(map(h => unsafeHTML(h)));

            @TemplateObservable()
            private QueryTemplate = combineLatest(
              observable,
              v.query ? this.makeQuery() : of({})
            ).pipe(
              map(([html, query]) => this.parseTemplateQuery(html, query))
            );

            parseTemplateQuery(h: string, query: any) {
              let stringValue = h
                .split('{')
                .join('')
                .split('}')
                .join('');

              Object.keys(query)
                .reduce((acc, curr) => [...acc, curr], [])
                .forEach(v =>
                  stringValue.includes(v)
                    ? (stringValue = stringValue.replace(v, query[v]))
                    : null
                );
              return unsafeHTML(stringValue);
            }

            async OnDestroy() {
              console.log(`Leave component ${selector}`);
            }

            async OnInit() {
              console.log(`Enter component ${selector}`);
            }

            makeQuery() {
              return this.query({
                fetchPolicy: 'cache-first',
                query: gql`
                  ${queries.find(q => q.includes(v.query))}
                `
              })
                .pipe(map(res => res.data[v.query]))
            }

            render() {
              return v.query
                ? html`
                    ${this.QueryTemplate}
                  `
                : html`
                    ${this.BasicTemplate}
                  `;
            }
          }
          this.routes.push({
            path: `/${v.name}`,
            component: selector
          });
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
      }, 200);
    }
    return app;
  }

  async ready() {
    await this.apollo.mutate({
      mutation: gql`
        mutation {
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
