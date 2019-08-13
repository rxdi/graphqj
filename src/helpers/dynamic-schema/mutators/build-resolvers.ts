import { Config, ResolverDependencies } from '../../../app/app.tokens';
import { isFunction } from '../../isFunction';
import { lazyTypes } from '../../lazy-types';

import { getFirstItem } from '../../get-first-item';
import { buildArgumentsSchema } from '../../parse-args-schema';

import { Container } from '@rxdi/core';
import { BootstrapService, GraphQLSchema } from '@gapi/core';

export function buildResolvers(
  config: Config,
  types,
  buildedSchema: GraphQLSchema
) {
  Object.keys(config.$resolvers).forEach(resolver => {
    const type = config.$resolvers[resolver].type;
    const method = (
      config.$resolvers[resolver].method || 'query'
    ).toLocaleLowerCase();
    let deps = config.$resolvers[resolver].deps || [];

    const mapDependencies = <T>(
      dependencies: ResolverDependencies[]
    ): { [map: string]: ResolverDependencies } =>
      dependencies
        .map(({ provide, map }) => ({
          container: Container.get<keyof T>(provide),
          provide,
          map
        }))
        .reduce((acc, curr) => ({ ...acc, [curr.map]: curr.container }), {});

    if (!buildedSchema[type]) {
      throw new Error(
        `Missing type '${type}', Available types: '${Object.keys(
          types
        ).toString()}'`
      );
    }
    let resolve = config.$resolvers[resolver].resolve;
    if (!isFunction(resolve) && !Array.isArray(resolve)) {
      /* Take the first method inside file for resolver */
      resolve = getFirstItem(resolve);
    }
    const oldResolve = resolve;
    resolve = isFunction(resolve) ? resolve : () => oldResolve;

    Array.from(lazyTypes.keys()).forEach(type => {
      Object.keys(lazyTypes.get(type)).forEach(k => {
        buildedSchema[type].getFields()[k].type = buildedSchema[type];
        // types[type].getFields()[k].resolve = resolve;
      });
    });
    Container.get(BootstrapService).Fields[method][resolver] = {
      type: buildedSchema[type],
      method_name: resolver,
      args: buildArgumentsSchema(config, resolver),
      public: true,
      method_type: method,
      target: mapDependencies(deps),
      resolve
    } as any;
  });
}
