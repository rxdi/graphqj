import { Effect } from '@rxdi/core';
import { PubSubService } from '@rxdi/graphql-pubsub';
import { OfType } from '@rxdi/graphql';
import { EffectTypes } from '../../api-introspection/EffectTypes';
import { IHamburgerStatisticsType } from '../../api-introspection';

@Effect()
export class HamburgerControllerEffect {

  constructor(private pubsub: PubSubService) {}

  @OfType(EffectTypes.clickHamburgerButton)
  clickHamburgerButtonAction(result: IHamburgerStatisticsType) {
    this.pubsub.publish(EffectTypes.clickHamburgerButton, result);
  }
}
