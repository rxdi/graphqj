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
  constructor(private pubsub: PubSubService) {}

  @Type(ClientType)
  @Subscribe(function(this: ClientController) {
    return this.pubsub.asyncIterator('listenForChanges');
  })
  @Subscription()
  listenForChanges() {
    return {
      html: 'gosho'
    };
  }
}
