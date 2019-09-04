import { Module } from '@rxdi/core';
import { ON_REQUEST_HANDLER, GRAPHQL_PLUGIN_CONFIG } from '@rxdi/graphql';
import { ResponseToolkit } from 'hapi';

@Module({
  providers: [
    {
      provide: ON_REQUEST_HANDLER,
      deps: [GRAPHQL_PLUGIN_CONFIG],
      useFactory: (config: GRAPHQL_PLUGIN_CONFIG) => async (
        next,
        request: Request,
        h: ResponseToolkit,
        err: Error
      ) => {
        // Authenticate user here if it is not authenticated return Boom.unauthorized()
        // if (request.headers.authorization) {
        //     const tokenData = ValidateToken(request.headers.authorization);
        //     const user = {};
        //     if (!user) {
        //         return Boom.unauthorized();
        //     } else {
        //         context.user = {id: 1, name: 'pesho'};
        //     }
        // }
        config.graphqlOptions.context = config.graphqlOptions.context || {};
        config.graphqlOptions.context.clientId = request.headers['clientid'];
        console.log('OMG', request.headers);
        return next();
      }
    }
  ]
})
export class ContextModule {}
