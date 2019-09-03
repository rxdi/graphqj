import { Injectable, Inject, Container } from '@rxdi/core';
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
  IMutation
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
import { parse, parseDefaults } from 'himalaya';

const CLIENT_READY_QUERY = gql`
  mutation {
    clientReady {
      components
      views {
        name
        lhtml
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
        components
        policy
      }
      components
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
          (clientReady || listenForChanges) as IClientType
      ),
      tap(change => this.loadBundles(change)),
      tap(change => this.applyChanges(change)),
      map(change => this.getApp(change.views))
    );
  }

  private loadBundles(change: IClientType) {
    return this.loadDynamicBundles(
      []
        .concat(
          ...(change.components ? change.components : []),
          ...change.views.map(v => v.components)
        )
        .filter(i => !!i)
    );
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

    change.views.forEach(v => {
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
        let modifiedTemplate: string = template;
        const replaceArray = Object.keys(object);
        let directives: {
          attributes: { value: string }[];
          position: { end: { index: number }; start: { index: number } };
        }[] = [];
        try {
          directives = [].concat(
            parse(modifiedTemplate, {
              ...parseDefaults,
              includePositions: true
            })
              .filter(
                e =>
                  e.attributes &&
                  e.attributes.length &&
                  e.attributes.find(a => a.key === '*if')
              )
              .filter(i => !!i)
          );
        } catch (e) {}
        let toReplace = [];
        for (const directive of directives) {
          const magicKey = directive.attributes[0].value
            .replace(options.left, '')
            .replace(options.right, '');
          const isTruthy = Boolean(
            object[magicKey] || resolve(magicKey, object)
          );
          const partLength =
            directive.position.end.index - directive.position.start.index;
          const uniqueId = generateId(partLength);
          if (!isTruthy) {
            toReplace.push(uniqueId);
            modifiedTemplate = modifiedTemplate.replace(
              modifiedTemplate.substring(
                directive.position.start.index,
                directive.position.end.index
              ),
              uniqueId
            );
          } else {
            const onlyDirective = modifiedTemplate
              .substring(
                directive.position.start.index,
                directive.position.end.index
              )
              .replace(` *if="${directive.attributes[0].value}"`, '');
            modifiedTemplate = modifiedTemplate.replace(
              modifiedTemplate.substring(
                directive.position.start.index,
                directive.position.end.index
              ),
              onlyDirective
            );
          }
        }
        toReplace.forEach(
          v => (modifiedTemplate = modifiedTemplate.replace(v, ''))
        );
        toReplace = [];
        for (var i = 0; i < replaceArray.length; i++) {
          const character = replaceArray[i];
          if (modifiedTemplate.includes(`${character}.`)) {
            const specialExtractor = modifiedTemplate.match(
              new RegExp(options.left + '(.*)' + options.right)
            );
            if (specialExtractor && specialExtractor.length > 1) {
              const specialCharacters = specialExtractor[1];
              const prop = resolve(specialCharacters, object);
              if (prop) {
                modifiedTemplate = modifiedTemplate.replace(
                  `${options.left}${specialCharacters}${options.right}`,
                  prop
                );
              }
            }
          } else {
            if (object[character]) {
              modifiedTemplate = modifiedTemplate.replace(
                new RegExp(options.left + character + options.right, 'gi'),
                object[character]
              );
            }
          }
        }

        return modifiedTemplate;
      };

      @Component({ selector })
      class NewElement extends BaseComponent {
        @property()
        values: Object;
        @property()
        loaded: Object;
        @property()
        options: IClientViewType;

        @TemplateObservable()
        private BasicTemplate = observable.pipe(
          tap(options => (this.options = options)),
          map(({ html }) => html),
          map(h => unsafeHTML(h))
        );

        @TemplateObservable()
        private QueryTemplate = observable.pipe(
          tap(options => (this.options = options)),
          map(({ html }) => html),
          mergeMap(html =>
            combineLatest(
              of(html),
              this.options.query ? from(this.makeQuery()) : of({})
            ).pipe(
              map(([html, query]) =>
                unsafeHTML(replaceSpecialCharacter(html, query))
              ),
              tap(() => this.loaded = true)
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
          let options: QueryOptions | SubscriptionOptions | MutationOptions = {
            fetchPolicy: (this.options.policy as FetchPolicy) || 'network-only',
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
          ${!this.loaded ? html`${v.lhtml ? unsafeHTML(v.lhtml) : html`<loading-screen-component></loading-screen-component>`}` : ''}
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
      this.routes.push({
        path: `/${v.name}`,
        component: selector
      });
      this.loadedComponents.set(selector, observable);
    });
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
