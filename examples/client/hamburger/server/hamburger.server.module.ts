import { Module } from '@rxdi/core';
import { HamburgerController } from './hamburger.controller';
import { HamburgerControllerEffect } from './hamburger-controller.effect';

@Module({
  controllers: [HamburgerController],
  effects: [HamburgerControllerEffect]
})
export class HamburgerServerModule {}
