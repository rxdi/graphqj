import { Module } from '@rxdi/core';
import { ClientController } from './client.controller';

@Module({
  controllers: [ClientController],
})
export class ClientModule {}
