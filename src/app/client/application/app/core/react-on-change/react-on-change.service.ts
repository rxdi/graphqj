import { Injectable, Inject } from '@rxdi/core';
import { from, BehaviorSubject, of, combineLatest } from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map, tap, switchMap, mergeMap } from 'rxjs/operators';
import {
  html,
  unsafeHTML,
  Component,
  TemplateObservable
} from '@rxdi/lit-html';
import { ISubscription, IClientViewType } from '../../../../../@introspection';
import { Router } from '@rxdi/router';
import { BaseComponent } from './base.component';
import { objToArray } from '../../../../../../helpers/obj-to-array';
const QueryGenerator = require('graphql-query-generator');

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
            values: any = {};
            @TemplateObservable() private templateObservable = observable.pipe(
              map(h => {
                let stringValue = h
                  .split('{')
                  .join('')
                  .split('}')
                  .join('');
                const mappedValues = Object.keys(this.values).reduce(
                  (acc, curr) => [...acc, curr],
                  []
                );
                mappedValues.forEach(v => {
                  if (stringValue.includes(v)) {
                    stringValue = stringValue.replace(v, this.values[v]);
                  }
                });
                return unsafeHTML(`${stringValue}`);
              })
            );
            // async OnInit() {
            //     if (v.query) {
            //       this.values = await this.query({
            //         fetchPolicy: 'network-only',
            //         query: gql`
            //           ${queries.find(q => q.includes(v.query))}
            //         `
            //       })
            //         .pipe(map(res => res.data[v.query]))
            //         .toPromise();
            //     }
            //     debugger
            // }
            render() {
              return html`
                ${this.templateObservable}
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
