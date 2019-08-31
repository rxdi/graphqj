import { Inject, Plugin } from '@rxdi/core';
import { HAPI_SERVER } from '@rxdi/hapi';
import { Server } from 'hapi';

@Plugin()
export class ServeComponents {
  constructor(@Inject(HAPI_SERVER) private server: Server) {}

  async register() {
    this.server.route({
      method: 'GET',
      path: '/components/{param*}',
      handler: {
        directory: {
          path: `${process.cwd()}/components`,
          index: ['index.html', 'default.html']
        }
      }
    });
  }
}
