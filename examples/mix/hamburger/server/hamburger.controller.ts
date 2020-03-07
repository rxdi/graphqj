import { Controller } from '@rxdi/core';
import { Mutation } from '@rxdi/graphql';
import { PubSubService, Subscribe, Subscription } from '@rxdi/graphql-pubsub';

import { IHamburgerStatisticsType } from '../../api-introspection/';
import { EffectTypes } from '../../api-introspection/EffectTypes';
import { HamburgerStatisticsType } from './types/hamburger-statistics.type';

@Controller({
  type: HamburgerStatisticsType,
})
export class HamburgerController {
  private payload: IHamburgerStatisticsType = { clicks: 1 };

  constructor(private pubsub: PubSubService) {}

  @Mutation()
  clickHamburgerButton(): IHamburgerStatisticsType {
    this.payload.clicks++;
    return this.payload;
  }

  @Subscribe(function(this: HamburgerController) {
    return this.pubsub.asyncIterator(EffectTypes.clickHamburgerButton);
  })
  @Subscription()
  subscribeToStatistics(payload: IHamburgerStatisticsType): IHamburgerStatisticsType {
    return payload;
  }
}
