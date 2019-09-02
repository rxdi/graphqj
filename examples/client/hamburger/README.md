

# Hamburger Component

#### Usage on Client side with @rxdi/lit-html

```typescript
import { Module } from '@rxdi/core';
import { HamburgerClientModule } from '@rxdi/ui-components/hamburger/client';

@Module({
  imports: [HamburgerClientModule],
})
export class SharedModule {}
```

#### Usage on Server side with @rxdi/graphql @rxdi/hapi

```typescript
import { Module } from '@rxdi/core';
import { HamburgerServerModule } from '@rxdi/ui-components/hamburger/server';

@Module({
  imports: [HamburgerServerModule],
})
export class SharedModule {}
```


##### Using it inside html

```html
<hamburger-component type="3dx" active=${true} enableBackendStatistics=${true}></hamburger-component>
```

`enableBackendStatistics` - Will count how many times this button is clicked

Available types:

```typescript
'3dx',
'3dx-r',
'3dy',
'3dy-r',
'3dxy',
'3dxy-r',
'arrow',
'arrow-r',
'arrowalt',
'arrowalt-r',
'arrowturn',
'arrowturn-r',
'boring',
'collapse',
'collapse-r',
'elastic',
'elastic-r',
'emphatic',
'emphatic-r',
'minus',
'slider',
'slider-r',
'spin',
'spin-r',
'spring',
'spring-r',
'stand',
'stand-r',
'squeeze',
'vortex',
'vortex-r'
```



Hamburger component Front end

```typescript
import { Component, html, property } from '@rxdi/lit-html';
import { style } from './hamburger.component.css';
import { HamburgerTypes } from './hamburger.type';
import { BaseComponent } from '../base.component';
import { take, switchMap, filter, tap, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { of, Observable } from 'rxjs';
import { IHamburgerStatisticsType } from '../../api-introspection';

/**
 * @customElement hamburger-component
 */
@Component({
  selector: 'hamburger-component',
  style,
  template(this: HamburgerComponent) {
    return html`
      <div
        @click=${this.clickHamburgerButton}
        class="hamburger hamburger--${this.type} ${this.active
          ? 'is-active'
          : ''}"
      >
        <div class="hamburger-box">
          <div class="hamburger-inner"></div>
        </div>
      </div>
    `;
  }
})
export class HamburgerComponent extends BaseComponent {
  @property() active: boolean;
  @property() type: HamburgerTypes = '3dx';
  @property() enableBackendStatistics?: boolean;

  private clickHamburgerButton() {
    return of(this.active)
      .pipe(
        tap(active => (this.active = !active)),
        filter(() => !!this.enableBackendStatistics),
        switchMap(() => this.sendClickStatistics()),
        take(1)
      )
      .subscribe();
  }

  sendClickStatistics(): Observable<IHamburgerStatisticsType> {
    return this.mutate({
      mutation: gql`
        mutation clickHamburgerButton {
          clickHamburgerButton {
            clicks
          }
        }
      `
    }).pipe(map(mutation => mutation.data.clickHamburgerButton));
  }
}
```


Hamburger Controller on the backend


```typescript
import { Controller } from '@rxdi/core';
import { Mutation } from '@rxdi/graphql';
import { Subscription, Subscribe, PubSubService } from '@rxdi/graphql-pubsub';
import { HamburgerStatisticsType } from './types/hamburger-statistics.type';
import { IHamburgerStatisticsType } from '../api-introspection';
import { EffectTypes } from '../api-introspection/EffectTypes';

@Controller({
  type: HamburgerStatisticsType
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
```


Every Mutation, Subscription, Query can have side effects called @Effect()
@OfType() represents the name of the Query/Mutation/Subscription 
This will be triggered after success execution of `clickHamburgerButton` query
```typescript
import { Effect } from '@rxdi/core';
import { PubSubService } from '@rxdi/graphql-pubsub';
import { OfType } from '@rxdi/graphql';
import { EffectTypes } from '../api-introspection/EffectTypes';
import { IHamburgerStatisticsType } from '../api-introspection';

@Effect()
export class HamburgerControllerEffect {

  constructor(private pubsub: PubSubService) {}

  @OfType(EffectTypes.clickHamburgerButton)
  clickHamburgerButtonAction(result: IHamburgerStatisticsType) {
    this.pubsub.publish(EffectTypes.clickHamburgerButton, result);
  }
}
```