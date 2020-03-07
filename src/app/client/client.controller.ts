import {
  BootstrapService,
  Container,
  Controller,
  GraphQLControllerOptions,
  GraphQLNonNull,
  GraphQLString,
  Mutation,
  printSchema,
  PubSubService,
  Subscribe,
  Subscription,
  Type,
  withFilter,
} from '@gapi/core';

import { IClientViewType } from '../@introspection';
import { Config, IConfigViews, IPredictedTranspilation } from '../app.tokens';
import { ClientType } from './types/client.type';

interface IReader<R, A> {
  (r: R): A;
}
interface IViewConfig {
  components: string[] | IPredictedTranspilation[];
  views: IClientViewType[];
  schema: string;
}

export const viewsToArray = <T>(a: { [key: string]: T }): Array<T> =>
  Object.keys(a).reduce((acc, curr) => [...acc, { ...a[curr], name: curr }], []);
const getViewsConfig = (views?: IConfigViews): IReader<Config, IViewConfig> => (config: Config) => ({
  components: config.$components,
  views: viewsToArray(views || config.$views),
  schema: printSchema(Container.get(BootstrapService).schema),
});

@Controller<GraphQLControllerOptions>({
  guards: [],
  type: [],
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
      },
    ),
  )
  @Subscription({
    clientId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
  async listenForChanges(views: IConfigViews) {
    return getViewsConfig(views)(Container.get<Config>('main-config-compiled'));
  }

  @Type(ClientType)
  @Mutation()
  async clientReady() {
    // const config = Container.get<Config>('main-config-compiled');
    // if (config.$views) {
    //   config.$views = modifyViewsConfig(
    //     config.$views,
    //     await mapComponentsPath(config.$views)
    //   );
    //   this.pubsub.publish('listenForChanges', config.$views);
    // }
    return getViewsConfig()(Container.get<Config>('main-config-compiled'));
  }
}
