import {
  Controller,
  GraphQLControllerOptions,
  Type,
  Subscription,
  Subscribe,
  PubSubService,
  Inject,
  withFilter,
  Query,
  GraphQLString,
  GraphQLNonNull,
  Container
} from '@gapi/core';
import { ClientType } from './types/client.type';
import { Config, ConfigViews } from '../app.tokens';
import { ClientReadyStatusType } from './types/status.type';

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
      views: viewsToArray(views)
    };
    return res;
  }

  @Type(ClientReadyStatusType)
  @Query()
  async clientReady(root, payload, context) {
    const config = Container.get<any>('main-config-compiled')
    this.pubsub.publish('listenForChanges', config.$views);
    return {
      status: 'READY'
    };
  }
}
