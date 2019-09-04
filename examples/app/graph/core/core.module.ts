import { Module } from '@rxdi/core';
import { ContextModule } from './context/context.module';

@Module({
  imports: [ContextModule]
})
export class CoreModule {}
