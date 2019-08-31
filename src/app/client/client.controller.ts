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
    this.pubsub.publish('listenForChanges', config.$views.app.html);
  }

  @Type(ClientType)
  @Subscribe(function(this: ClientController) {
    return this.pubsub.asyncIterator('listenForChanges');
  })
  @Subscription()
  listenForChanges(html: string) {
    return {
      html
    };
  }
}
