import { Injectable, Inject, Container } from '@rxdi/core';
import {
  from,
  BehaviorSubject,
  combineLatest,
  of,
  merge,
  Observable
} from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map, tap, mergeMap, switchMap, filter } from 'rxjs/operators';
import {
  html,
  unsafeHTML,
  Component,
  TemplateObservable,
  property
} from '@rxdi/lit-html';
import {
  ISubscription,
  IClientViewType,
  IClientType,
  IMutation,
  IClientViewRenderingEnumEnum,
  IComponentsType
} from '../../../../../@introspection';

import {
  ClientViewRenderingEnum,
  ConditionalOperators
} from '../../../../../shared/enums/render';

import { Router } from '@rxdi/router';
import { BaseComponent } from './base.component';
import { buildSchema, GraphQLFieldMap } from 'graphql';
import { FetchPolicy } from 'apollo-client';
import {
  QueryOptions,
  SubscriptionOptions,
  MutationOptions
} from '@rxdi/graphql-client';
import { parse, parseDefaults, stringify } from 'himalaya';
import { GraphqlRequestTypes } from '../../../../../shared/types/graphql-request-type';

interface Element {
  tagName: string;
  children: Element[];
  content: string;
  type: 'element' | 'text';
  attributes: { value: string; key: string }[];
  position: { end: { index: number }; start: { index: number } };
}

const reusableViewQuery = `
views {
  name
  lhtml
  html
  query
  props
  output
  rendering
  components {
    link
    selector
  }
  policy
}
components {
  link
  selector
}
schema
`;

const CLIENT_READY_QUERY = gql`
  mutation {
    clientReady {
      ${reusableViewQuery}
    }
  }
`;

const SUBSCRIBE_TO_CHANGES = gql`
  subscription listenForChanges($clientId: String!) {
    listenForChanges(clientId: $clientId) {
      ${reusableViewQuery}
    }
  }
`;

interface MixinReactToChanges {
  data: { clientReady: IClientType; listenForChanges: IClientType };
}

function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2);
}

@Injectable()
export class ReactOnChangeService {
  @Inject(ApolloClient)
  private apollo: ApolloClient;

  @Router()
  private router: Router;

  private loadedComponents: Map<
    string,
    BehaviorSubject<IClientViewType>
  > = new Map();
  private routes = [];
  private initalized: boolean;

  subscribeToAppChanges() {
    return merge(
      this.ready(),
      from(
        this.apollo.subscribe<ISubscription>({
          query: SUBSCRIBE_TO_CHANGES,
          variables: {
            clientId: Container.get('clientId')
          }
        })
      )
    ).pipe(
      map(
        ({ data: { clientReady, listenForChanges } }: MixinReactToChanges) =>
          clientReady || listenForChanges
      ),
      switchMap(async change => {
        await this.loadComponents(change);
        return change;
      }),
      tap(change => this.applyChanges(change)),
      map(change => this.getApp(change.views))
    );
  }

  private async loadComponents(change: IClientType) {
    await this.loadDynamicComponents(
      []
        .concat(
          ...(change.components ? change.components : []),
          ...change.views.map(v => v.components)
        )
        .filter(i => !!i)
    );
    return change;
  }

  private createExecutableQuery(
    type: GraphQLFieldMap<any, any>,
    method: GraphqlRequestTypes
  ) {
    return Object.keys(type).map(k => {
      const nestedFields = type[k].type['getFields']();
      return `${method} ${k} { ${k} { ${Object.keys(nestedFields)
        .map(field => {
          const nestedField = nestedFields[field];
          if (nestedField && nestedField.type && nestedField.type.getFields) {
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
  }

  async applyChanges(change: IClientType) {
    const schema = buildSchema(change.schema);

    const Queries = this.createExecutableQuery(
      schema.getQueryType().getFields(),
      GraphqlRequestTypes.query
    );
    const Mutations = this.createExecutableQuery(
      schema.getMutationType().getFields(),
      GraphqlRequestTypes.mutation
    );
    const Subscriptions = this.createExecutableQuery(
      schema.getSubscriptionType().getFields(),
      GraphqlRequestTypes.subscription
    );
    const queries = [...Queries, Mutations, Subscriptions];
    this.routes = [];
    await Promise.all(
      change.views.map(async v => {
        const selector = `${v.name}-component`;
        if (v.name === 'app') {
          return;
        }
        let observable: BehaviorSubject<IClientViewType>;
        const exists = this.loadedComponents.get(selector);
        if (exists) {
          this.routes.push({
            path: `/${v.name}`,
            component: selector
          });
          exists.next(v);
          return;
        } else {
          observable = new BehaviorSubject(v);
        }
        const resolve = (path: string, obj: Object, separator = '.') =>
          (Array.isArray(path) ? path : path.split(separator)).reduce(
            (prev, curr) => prev && prev[curr],
            obj as string
          );
        const replaceSpecialCharacter = (
          template: string,
          object: Object,
          options: { left: string; right: string } = {
            left: ConditionalOperators['{'],
            right: ConditionalOperators['}']
          }
        ) => {
          function replaceSpecialBracklets(symbol: string) {
            return symbol.replace(options.left, '').replace(options.right, '');
          }
          let elementToRemove = [];
          const iterateOverElement = (elements: Element[]) => {
            return elements.map(element => {
              if (element.children) {
                element.children = iterateOverElement(element.children);
              }
              if (element.attributes && element.type === 'element') {
                const specialConditionalOperator = element.attributes.find(
                  a => a.key === ConditionalOperators['*if']
                );
                const specialIteratorOperator = element.attributes.find(
                  a => a.key === ConditionalOperators['*let']
                );
                const ofOperator = element.attributes.find(
                  a => a.key === ConditionalOperators.of
                );

                if (specialIteratorOperator && ofOperator) {
                  let values: string[] = resolve(ofOperator.value, object);
                  if (!values) {
                    try {
                      values = JSON.parse(ofOperator.value);
                    } catch (e) {
                      values = [];
                    }
                  }
                  const findRecursive = (childrens: Element[]) => {
                    return childrens.map(c => {
                      if (c.type === 'text') {
                        const specialExtractor = c.content.match(
                          new RegExp(options.left + '(.*)' + options.right)
                        );
                        if (specialExtractor && specialExtractor.length) {
                          const key = specialExtractor[1]
                            .replace(ConditionalOperators['{'], '')
                            .replace(ConditionalOperators['}'], '');
                          c.content = c.content.replace(
                            specialExtractor[0],
                            values
                              .map(val => {
                                return `<${
                                  element.tagName
                                } ${element.attributes
                                  .map(a => ` ${a.key}="${a.value}"`)
                                  .join(' ')}>${resolve(key, val) || val}</${
                                  element.tagName
                                }>`;
                              })
                              .join(' ')
                          );
                        }
                      }
                      if (c.attributes) {
                        const TemplateOperator = c.attributes.find(
                          a => a.key === ConditionalOperators['*template']
                        );
                        if (
                          TemplateOperator &&
                          c.children &&
                          c.children.length
                        ) {
                          const highOrderComponent = c.children.find(
                            c => c.type === 'element'
                          );

                          let element: Element;
                          if (highOrderComponent) {
                            element = highOrderComponent;
                          } else {
                            element = c;
                          }
                          if (c.children && c.children.length) {
                            c.children[0].tagName = element.tagName;
                          }
                          // c.children[0].content = '';

                          const parseLoop = () => {
                            const specialExtractor = c.children[0].content.match(
                              new RegExp(options.left + '(.*)' + options.right)
                            );
                            if (
                              specialExtractor &&
                              specialExtractor.length >= 1
                            ) {
                              const key = specialExtractor[1]
                                .replace(ConditionalOperators['{'], '')
                                .replace(ConditionalOperators['}'], '');
                              return c.children[0].content.replace(
                                specialExtractor[0],
                                values
                                  .map(val => {
                                    return `<${
                                      element.tagName
                                    } ${element.attributes
                                      .map(a => ` ${a.key}="${a.value}"`)
                                      .join(' ')}>${resolve(key, val) ||
                                      val}</${element.tagName}>`;
                                  })
                                  .join(' ')
                              );
                            }
                            return '';
                          };
                          c.children[0].content = parseLoop();
                          c.children.splice(c.children.indexOf(element), 1);
                          c.attributes.splice(
                            c.attributes.indexOf(TemplateOperator),
                            1
                          );
                        }
                      }
                      if (c.children) {
                        c.children = findRecursive(c.children);
                      }
                      return c;
                    });
                  };
                  element.children = findRecursive(element.children);
                  // const uniqueContainerId = createUniqueHash(
                  //   JSON.stringify(element.position)
                  // );
                  // Container.set(uniqueContainerId, ofOperator.value);
                  // const container = Container.get(uniqueContainerId)
                  element.attributes.splice(
                    element.attributes.indexOf(specialIteratorOperator, 1)
                  );
                  element.attributes.splice(
                    element.attributes.indexOf(ofOperator, 1)
                  );
                }
                if (specialConditionalOperator) {
                  const val = replaceSpecialBracklets(
                    specialConditionalOperator.value
                  );
                  const obj = resolve(val, object);
                  if (!obj) {
                    elementToRemove.push(elements.indexOf(element));
                  }
                  element.attributes.splice(
                    element.attributes.indexOf(specialConditionalOperator, 1)
                  );
                }
              }
              if (element.content) {
                const specialExtractor = element.content.match(
                  new RegExp(options.left + '(.*)' + options.right)
                );
                if (
                  element.type === 'text' &&
                  specialExtractor &&
                  specialExtractor.length > 1
                ) {
                  const specialCharacters = specialExtractor[1];
                  const prop = resolve(specialCharacters, object);
                  if (prop) {
                    element.content = element.content.replace(
                      `${options.left}${specialCharacters}${options.right}`,
                      prop
                    );
                  }
                }
              }
              return element;
            });
          };
          let newTemplate = iterateOverElement(
            parse(template || '', {
              ...parseDefaults,
              includePositions: true
            })
          );
          elementToRemove.forEach(e => newTemplate.splice(e, 1));
          elementToRemove = [];
          return stringify(newTemplate);
        };

        const isServerSideRender = (clientView: IClientViewType) =>
          clientView.rendering === ClientViewRenderingEnum.server;
        const isClientSideRender = (clientView: IClientViewType) =>
          clientView.rendering === ClientViewRenderingEnum.client;
        function renderAtTheEnd() {
          return new Observable(o => {
            setTimeout(() => {
              o.next(true);
              o.complete();
            }, 0);
          });
        }
        @Component({ selector })
        class NewElement extends BaseComponent {
          @property()
          values: Object;
          @property()
          loaded: Object;
          @property()
          options: IClientViewType = v;
          @TemplateObservable()
          private BasicTemplate = observable.pipe(
            filter(options => isClientSideRender(options)),
            tap(options => (this.options = options)),
            map(({ html }) => unsafeHTML(html))
          );

          @TemplateObservable()
          private QueryTemplate = observable.pipe(
            filter(options => isClientSideRender(options)),
            tap(options => (this.options = options)),
            mergeMap(clientView =>
              combineLatest(
                of(clientView.html),
                clientView.query ? from(this.makeQuery()) : of({})
              ).pipe(
                map(([html, query]) => replaceSpecialCharacter(html, query)),
                map(html => unsafeHTML(html)),
                tap(() => (this.loaded = true))
              )
            )
          );

          @TemplateObservable()
          private ServerSideRenderTemplate = observable.pipe(
            filter(options => isServerSideRender(options)),
            tap(options => (this.options = options)),
            mergeMap(clientView =>
              combineLatest(of(clientView.html), renderAtTheEnd()).pipe(
                map(([html]) => html),
                map(html => unsafeHTML(html)),
                tap(() => (this.loaded = true))
              )
            )
          );

          async OnDestroy() {
            console.log(`Leave component ${selector}`);
          }

          async OnInit() {
            console.log(`Enter component ${selector}`);
          }

          private makeQuery() {
            const isWrittenQuery =
              this.options.query.includes('query') ||
              this.options.query.includes('mutation') ||
              this.options.query.includes('subscription');
            let query: string;
            let queryType: 'mutate' | 'query' | 'subscription' | 'subscribe';

            if (isWrittenQuery) {
              const splittedQuery = this.options.query.split(' ');
              queryType = splittedQuery[0] as any;
              query = gql`
                ${this.options.query}
              `;
            } else {
              queryType = 'query';
              query = gql`
                ${queries.find(q => q.includes(this.options.query))}
              `;
            }
            let options:
              | QueryOptions
              | SubscriptionOptions
              | MutationOptions = {
              fetchPolicy: this.options.policy as FetchPolicy,
              query: null,
              mutation: null
            };
            if (queryType === 'mutate') {
              options['mutation'] = query;
            }

            if (queryType === 'query') {
              options['query'] = query;
            }
            if (queryType === 'subscription') {
              options['query'] = query;
              queryType = 'subscribe';
            }
            return this[queryType as string](options).pipe(
              map(res => (res as any).data)
            );
          }

          render() {
            return html`
              ${!this.loaded && this.options.query
                ? html`
                    ${this.options.lhtml
                      ? unsafeHTML(this.options.lhtml)
                      : html`
                          <loading-screen-component></loading-screen-component>
                        `}
                  `
                : ''}
              ${v.rendering === 'server'
                ? html`
                    ${this.ServerSideRenderTemplate}
                  `
                : v.query
                ? html`
                    ${this.QueryTemplate}
                  `
                : html`
                    ${this.BasicTemplate}
                  `}
            `;
          }
        }
        await window.customElements.whenDefined(selector);
        this.routes.push({
          path: `/${v.name}`,
          component: selector
        });
        this.loadedComponents.set(selector, observable);
      })
    );

    if (!this.initalized) {
      this.router.setRoutes([
        {
          path: '/',
          component: 'home-component'
        }
      ]);
      this.initalized = true;
    }
    this.router.addRoutes([
      ...this.routes,
      {
        path: '(.*)',
        component: 'not-found-component'
      }
    ]);
  }

  ready() {
    return from(
      this.apollo.mutate<IMutation>({
        mutation: CLIENT_READY_QUERY
      })
    );
  }

  getApp(views: IClientViewType[]) {
    return this.parseHtml(views[0].html);
  }

  parseHtml(template: string) {
    return html`
      ${unsafeHTML(template)}
    `;
  }

  async loadDynamicComponents(bundles: IComponentsType[]) {
    return await Promise.all(
      bundles.map(async ({ link, selector }) => {
        if (this.loadedComponents.has(link)) {
          // location.reload();
          return;
        }
        const scriptFileEl = document.createElement('script');
        scriptFileEl.setAttribute('async', '');
        scriptFileEl.setAttribute('src', link);
        this.loadedComponents.set(link, scriptFileEl as any);
        document.body.appendChild(scriptFileEl);
        await window.customElements.whenDefined(selector);
      })
    );
  }
}
