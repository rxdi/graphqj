import { Module } from '@rxdi/core';
import { HamburgerComponent } from './hamburger.component';
import { ConnectionModule } from '../../core/core.module';

@Module({
  imports: [ConnectionModule],
  components: [HamburgerComponent]
})
export class HamburgerClientModule {}
