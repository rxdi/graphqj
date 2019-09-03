import { Injectable, Inject, Container, createUniqueHash } from '@rxdi/core';
import { from, BehaviorSubject, combineLatest, of, merge } from 'rxjs';
import { ApolloClient } from '@rxdi/graphql-client';
import gql from 'graphql-tag';
import { map, tap, mergeMap, switchMap } from 'rxjs/operators';
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
  IComponentsType
} from '../../../../../@introspection';
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
interface Element {
  tagName: string;
  children: Element[];
  content: string;
  type: 'element' | 'text';
  attributes: { value: string; key: string }[];
  position: { end: { index: number }; start: { index: number } };
}
const CLIENT_READY_QUERY = gql`
  mutation {
    clientReady {
      components {
        link
        selector
      }
      views {
        name
        lhtml
        html
        query
        props
        output
        components {
          link
          selector
        }
        policy
      }
      schema
    }
  }
`;
const SUBSCRIBE_TO_CHANGES = gql`
  subscription listenForChanges($clientId: String!) {
    listenForChanges(clientId: $clientId) {
      views {
        name
        lhtml
        html
        query
        props
        output
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
    }
  }
`;

interface MixinReactToChanges {
  data: { clientReady: IClientType; listenForChanges: IClientType };
}

interface Attributes {
  argument: undefined;
  endPos: 147;
  literalValue: string;
  name: string;
  pos: 137;
  value: string;
}
interface EventParser {
  argument: any;
  attributes: Attributes[];
  concise: boolean;
  emptyTagName: any;
  endPos: number;
  openTagOnly: boolean;
  params: any;
  pos: number;
  selfClosed: boolean;
  setParseOptions: Function;
  tagName: string;
  tagNameEndPos: number;
  tagNameExpression: undefined;
  type: 'openTag' | string;
}
function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2);
}

// generateId :: Integer -> String
function generateId(len) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
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
    method: 'query' | 'mutation' | 'subscription'
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
      'query'
    );
    const Mutations = this.createExecutableQuery(
      schema.getMutationType().getFields(),
      'mutation'
    );
    const Subscriptions = this.createExecutableQuery(
      schema.getSubscriptionType().getFields(),
      'subscription'
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
            left: '{',
            right: '}'
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
                  a => a.key === '*if'
                );
                const specialIteratorOperator = element.attributes.find(
                  a => a.key === '*let'
                );

                const ofOperator = element.attributes.find(a => a.key === 'of');

                if (specialIteratorOperator && ofOperator) {
                  const findRecursive = (childrens: Element[]) => {
                    return childrens.map(c => {
                      if (c.attributes) {
                        const TemplateOperator = c.attributes.find(
                          a => a.key === '*template'
                        );
                        if (
                          TemplateOperator &&
                          c.children &&
                          c.children.length
                        ) {
                          const values = JSON.parse(ofOperator.value) as Array<
                            string
                          >;

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
                            debugger
                            if (
                              specialExtractor &&
                              specialExtractor.length >= 1
                            ) {
                              const o = specialExtractor[1]
                                .replace('{', '')
                                .replace('}', '')
                                .trim()
                                .split('.');
                              o.shift();
                              return c.children[0].content.replace(
                                specialExtractor[0],
                                values
                                  .map(v => {
                                    return `<${
                                      element.tagName
                                    } ${element.attributes
                                      .map(a => ` ${a.key}="${a.value}"`)
                                      .join(' ')}>${resolve(o.join('.'), v) ||
                                      v}</${element.tagName}>`;
                                  })
                                  .join(' ')
                              );
                            }
                            return '';
                          };
                          c.children[0].content = parseLoop();
                          c.children.splice(c.children.indexOf(element), 1)
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
                  if (
                    !object[
                      replaceSpecialBracklets(specialConditionalOperator.value)
                    ]
                  ) {
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
                  element.content.includes('') &&
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
          const HTML = stringify(newTemplate);
          return HTML;
        };

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
            tap(options => (this.options = options)),
            map(({ html }) => unsafeHTML(html))
          );

          @TemplateObservable()
          private QueryTemplate = observable.pipe(
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
            let querySelector: string;

            let queryType: 'mutate' | 'query' | 'subscription' | 'subscribe';

            if (isWrittenQuery) {
              const splittedQuery = this.options.query.split(' ');
              querySelector = splittedQuery[1];
              queryType = splittedQuery[0] as any;
              query = gql`
                ${this.options.query}
              `;
            } else {
              querySelector = this.options.query;
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
              map(res => (res as any).data[querySelector])
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
              ${v.query
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
