import {
  Controller,
  GraphQLControllerOptions,
  Type,
  Subscription,
  Subscribe,
  PubSubService,
  Inject
} from '@gapi/core';
import { ClientType } from './types/client.type';
import { Config } from '../app.tokens';
import { objToArray } from '../../helpers/obj-to-array';

@Controller<GraphQLControllerOptions>({
  guards: [],
  type: []
})
export class ClientController {
  constructor(
    private pubsub: PubSubService,
    @Inject(Config) private config: Config
  ) {
      setInterval(() => this.OnInit(), 1000)
  }

  async OnInit() {
    const config = await this.config;
    this.pubsub.publish('listenForChanges', config.$views);
  }

  @Type(ClientType)
  @Subscribe(function(this: ClientController) {
    return this.pubsub.asyncIterator('listenForChanges');
  })
  @Subscription()
  listenForChanges(views) {
    return {
      views: objToArray(views)
    };
  }
}
