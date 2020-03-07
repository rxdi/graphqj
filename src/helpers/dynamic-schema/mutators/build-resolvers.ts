import { BootstrapService, GraphQLSchema } from '@gapi/core';
import { Container } from '@rxdi/core';

import { Config, IResolverDependencies } from '../../../app/app.tokens';
import { getFirstItem } from '../../get-first-item';
import { isFunction } from '../../isFunction';
import { lazyTypes } from '../../lazy-types';
import { buildArgumentsSchema } from '../../parse-args-schema';

export function buildResolvers(config: Config, types, buildedSchema: GraphQLSchema) {
  Object.keys(config.$resolvers).forEach(resolver => {
    const type = config.$resolvers[resolver].type;
    const method = (config.$resolvers[resolver].method || 'query').toLocaleLowerCase();
    const deps = config.$resolvers[resolver].deps || [];

    const mapDependencies = <T>(dependencies: IResolverDependencies[]): { [map: string]: IResolverDependencies } =>
      dependencies
        .map(({ provide, map }) => ({
          container: Container.get<keyof T>(provide),
          provide,
          map,
        }))
        .reduce((acc, curr) => ({ ...acc, [curr.map]: curr.container }), {});

    if (!buildedSchema[type]) {
      throw new Error(`Missing type '${type}', Available types: '${Object.keys(types).toString()}'`);
    }
    let resolve = config.$resolvers[resolver].resolve;
    if (resolve && !isFunction(resolve) && !Array.isArray(resolve)) {
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
      resolve,
    };
  });
}
