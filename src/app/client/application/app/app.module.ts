import { Module } from '@rxdi/core';
import { GraphqlModule } from '@rxdi/graphql-client';
import { RouterModule } from '@rxdi/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { GraphQLRequest } from 'apollo-link';
import { CoreModule } from './core/core.module';

@Module({
  components: [
    NavbarComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    GraphqlModule.forRoot(
      {
        async onRequest(this: GraphQLRequest) {
          return new Headers();
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