import { Module } from '@rxdi/core';

import { ReactOnChangeService } from './react-on-change/react-on-change.service';

@Module({
  providers: [ReactOnChangeService],
})
export class CoreModule {}
