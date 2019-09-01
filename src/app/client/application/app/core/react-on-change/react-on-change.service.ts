import { Injectable, Inject } from '@rxdi/core';
import { from, BehaviorSubject, combineLatest, of } from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import {
  html,
  unsafeHTML,
  Component,
  TemplateObservable,
  property
} from '@rxdi/lit-html';
import { ISubscription, IClientViewType } from '../../../../../@introspection';
import { Router } from '@rxdi/router';
import { BaseComponent } from './base.component';
import { buildSchema, GraphQLFieldMap } from 'graphql';
import { FetchPolicy } from 'apollo-client';
import {
  QueryOptions,
  SubscriptionOptions,
  MutationOptions
} from '@rxdi/graphql-client';

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
                policy
              }
              schema
            }
          }
        `
      })
    ).pipe(
      map(({ data }) => data.listenForChanges),
      tap(change =>
        this.loadDynamicBundles(
          [].concat(...change.views.map(v => v.components)).filter(i => !!i)
        )
      ),
      tap(async change => {
        const schema = buildSchema(change.schema);
        const createExecutableQuery = (
          type: GraphQLFieldMap<any, any>,
          method: 'query' | 'mutation' | 'subscription'
        ) => {
          return Object.keys(type).map(k => {
            const nestedFields = type[k].type['getFields']();
            return `${method} ${k} { ${k} { ${Object.keys(nestedFields)
              .map(field => {
                const nestedField = nestedFields[field];
                if (nestedField && nestedField.type.getFields) {
                  const nestedTypes = nestedField.type.getFields();
                  field = `${field} { ${Object.keys(nestedTypes)
                    .filter(t => t !== field)
                    .join(' ')} }`;
                }
                // Refactor this part it will created nested schema to level 2 but we need recursive manage of this particular scenario
                return field;
              })
              .join(' ')} } }`;
          });
        };
        const Queries = createExecutableQuery(
          schema.getQueryType().getFields(),
          'query'
        );
        const Mutations = createExecutableQuery(
          schema.getMutationType().getFields(),
          'mutation'
        );
        const Subscriptions = createExecutableQuery(
          schema.getSubscriptionType().getFields(),
          'subscription'
        );
        const queries = [...Queries, Mutations, Subscriptions];
        this.routes = [];
        change.views.forEach(v => {
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
              const isWrittenQuery = v.query.includes('query') || v.query.includes('mutation') || v.query.includes('subscription');
              let query: string;
              let querySelector: string;

              let queryType: 'mutate' | 'query' | 'subscription';

              if (isWrittenQuery) {
                const splittedQuery = v.query.split(' ');
                querySelector = splittedQuery[1];
                queryType = splittedQuery[0] as any;
                query = gql`${v.query}`;
              } else {
                querySelector = v.query;
                query = gql`
                ${queries.find(q => q.includes(v.query))}
              `;
              }
              let options: QueryOptions | SubscriptionOptions | MutationOptions = {
                fetchPolicy: v.policy as FetchPolicy || 'network-only',
                query: null,
                mutation: null
              };
              if (queryType === 'mutate') {
                options['mutation'] = query;
              }

              if (queryType === 'query' || queryType === 'subscription') {
                options['query'] = query;
              }
              return this[queryType](options).pipe(map(res => (res as any).data[querySelector]));
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
      map(change => this.getApp(change.views))
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
