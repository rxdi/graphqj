import { Module } from '@rxdi/core';

import { ServeComponents } from './services/serve-components.service';

@Module({
  plugins: [ServeComponents],
})
export class CoreModule {}
