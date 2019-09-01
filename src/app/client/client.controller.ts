import {
  Controller,
  GraphQLControllerOptions,
  Type,
  Subscription,
  Subscribe,
  PubSubService,
  Inject,
  Container,
  Mutation,
  BootstrapService,
  printSchema
} from '@gapi/core';
import { ClientType } from './types/client.type';
import { Config, ConfigViews } from '../app.tokens';
import { ClientReadyStatusType } from './types/status.type';
import { mapComponentsPath, modifyViewsConfig } from '../../helpers/component.parser';

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
  constructor(
    private pubsub: PubSubService,
    @Inject(Config) private config: Config
  ) {}

  @Type(ClientType)
  @Subscribe(function(this: ClientController) {
    return this.pubsub.asyncIterator('listenForChanges');
  })
  @Subscription()
  listenForChanges(views: ConfigViews) {
    const res = {
      views: viewsToArray(views),
      schema: printSchema(Container.get(BootstrapService).schema)
    };
    return res;
  }

  @Type(ClientReadyStatusType)
  @Mutation()
  async clientReady(root, payload, context) {
    const config = Container.get<Config>('main-config-compiled');
    config.$views = modifyViewsConfig(config.$views, await mapComponentsPath(config.$views));
    this.pubsub.publish('listenForChanges', config.$views);
    return {
      status: 'READY'
    };
  }
}
