import { Module } from '@rxdi/core';

import { HamburgerControllerEffect } from './hamburger-controller.effect';
import { HamburgerController } from './hamburger.controller';

@Module({
  controllers: [HamburgerController],
  effects: [HamburgerControllerEffect],
})
export class HamburgerServerModule {}
