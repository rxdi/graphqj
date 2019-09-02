import {
  Controller,
  GraphQLControllerOptions,
  Type,
  Subscription,
  Subscribe,
  PubSubService,
  Container,
  Mutation,
  BootstrapService,
  printSchema,
  withFilter,
  GraphQLString,
  GraphQLNonNull
} from '@gapi/core';
import { ClientType } from './types/client.type';
import { Config, ConfigViews } from '../app.tokens';
import {
  mapComponentsPath,
  modifyViewsConfig
} from '../../helpers/component.parser';

export const viewsToArray = <T>(a: { [key: string]: T }): Array<T> =>
  Object.keys(a).reduce(
    (acc, curr) => [...acc, { ...a[curr], name: curr }],
    []
  );
@Controller<GraphQLControllerOptions>({
  guards: [],
  type: []
})
export class ClientController {
  constructor(private pubsub: PubSubService) {}

  @Type(ClientType)
  @Subscribe(
    withFilter(
      function(self: ClientController) {
        return self.pubsub.asyncIterator('listenForChanges');
      },
      function(global, unused, payload, context) {
        const isCorrectLength = context.clientid.length + context.clientid.length;
        if (isCorrectLength === 100 && payload.clientId === context.clientid) {
          return true;
        }
        return false;
      }
    )
  )
  @Subscription({
    clientId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
  async listenForChanges(views: ConfigViews) {
    return this.getViewsConfig(views);
  }

  getViewsConfig(views?: ConfigViews) {
    const config = Container.get<Config>('main-config-compiled');
    return {
      components: config.$components,
      views: viewsToArray(views || config.$views),
      schema: printSchema(Container.get(BootstrapService).schema)
    };
  }

  @Type(ClientType)
  @Mutation()
  async clientReady(root, payload, context) {
    // const config = Container.get<Config>('main-config-compiled');
    // if (config.$views) {
    //   config.$views = modifyViewsConfig(
    //     config.$views,
    //     await mapComponentsPath(config.$views)
    //   );
    //   this.pubsub.publish('listenForChanges', config.$views);
    // }
    return this.getViewsConfig();
  }
}
