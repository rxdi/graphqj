import { Effect } from '@rxdi/core';
import { OfType } from '@rxdi/graphql';
import { PubSubService } from '@rxdi/graphql-pubsub';

import { IHamburgerStatisticsType } from '../../api-introspection';
import { EffectTypes } from '../../api-introspection/EffectTypes';

@Effect()
export class HamburgerControllerEffect {
  constructor(private pubsub: PubSubService) {}

  @OfType(EffectTypes.clickHamburgerButton)
  clickHamburgerButtonAction(result: IHamburgerStatisticsType) {
    this.pubsub.publish(EffectTypes.clickHamburgerButton, result);
  }
}
