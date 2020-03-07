import { Module } from '@rxdi/core';

import { ConnectionModule } from '../../core/core.module';
import { HamburgerComponent } from './hamburger.component';

@Module({
  imports: [ConnectionModule],
  components: [HamburgerComponent],
})
export class HamburgerClientModule {}
