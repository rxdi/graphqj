import { Container, Module } from '@rxdi/core';
import { GraphqlModule } from '@rxdi/graphql-client';
import { RouterModule } from '@rxdi/router';
import { GraphQLRequest } from 'apollo-link';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2);
}

// generateId :: Integer -> String
function generateId(len) {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}
const clientId = generateId(50);
Container.set('clientId', clientId);
@Module({
  imports: [
    GraphqlModule.forRoot(
      {
        async onRequest(this: GraphQLRequest) {
          const headers = new Headers();

          headers.append('clientId', clientId);
          return headers;
        },
        pubsub: 'ws://localhost:9000/subscriptions',
        uri: 'http://localhost:9000/graphql',
      },
      {},
    ),
    RouterModule.forRoot<string>([], { log: true }),
    CoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
