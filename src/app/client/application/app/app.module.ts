import { Module, Container } from '@rxdi/core';
import { GraphqlModule } from '@rxdi/graphql-client';
import { RouterModule } from '@rxdi/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { GraphQLRequest } from 'apollo-link';
import { CoreModule } from './core/core.module';

function dec2hex (dec) {
  return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
function generateId (len) {
  var arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

@Module({
  components: [
    // NavbarComponent,
    HomeComponent,
    // FooterComponent
  ],
  imports: [
    GraphqlModule.forRoot(
      {
        async onRequest(this: GraphQLRequest) {
          const headers = new Headers();
          return headers;
        },
        pubsub: 'ws://localhost:9000/subscriptions',
        uri: 'http://localhost:9000/graphql'
      },
      {}
    ),
    RouterModule.forRoot<string>([
      {
        path: '/',
        component: HomeComponent
      },
      {
        path: '(.*)',
        component: 'not-found-component',
      }
      //   { path: '/users/:user', component: 'x-user-profile' },
    ], { log: true }),
    CoreModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}