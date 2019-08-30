import {
  Controller,
  GraphQLControllerOptions,
  Type,
  Subscription,
  Subscribe,
  PubSubService
} from '@gapi/core';
import { ClientType } from './types/client.type';

@Controller<GraphQLControllerOptions>({
  guards: [],
  type: []
})
export class ClientController {
  constructor(private pubsub: PubSubService) {
    let count = 0;
    setInterval(() => {
      this.pubsub.publish('listenForChanges', `${count++}`);
    }, 1000);
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
