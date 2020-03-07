import { Inject, Plugin } from '@rxdi/core';
import { HAPI_SERVER } from '@rxdi/hapi';
import { Server } from 'hapi';

import { includes } from '../../../helpers/args-extractors';

@Plugin()
export class ServeComponents {
  constructor(@Inject(HAPI_SERVER) private server: Server) {}

  async register() {
    if (includes('--client')) {
      this.server.route({
        method: 'GET',
        path: '/components/{param*}',
        handler: {
          directory: {
            path: `${process.cwd()}/components`,
            index: ['index.html', 'default.html'],
          },
        },
      });
      this.server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
          directory: {
            path: __dirname,
            redirectToSlash: true,
            listing: false,
            index: ['index.html'],
          },
        },
      });
    }
  }
}
