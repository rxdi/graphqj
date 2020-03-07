import { Component, html, property } from '@rxdi/lit-html';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { IHamburgerStatisticsType } from '../../api-introspection';
import { BaseComponent } from './base.component';
import { style } from './hamburger.component.css';
import { HamburgerTypes } from './hamburger.type';

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
        class="hamburger hamburger--${this.type} ${this.active ? 'is-active' : ''}"
      >
        <div class="hamburger-box">
          <div class="hamburger-inner"></div>
        </div>
      </div>
    `;
  },
})
export class HamburgerComponent extends BaseComponent {
  @property({ type: Boolean }) active: boolean;
  @property() type: HamburgerTypes = '3dx';
  @property({ type: Boolean }) enableBackendStatistics?: boolean;

  private clickHamburgerButton() {
    return of(this.active)
      .pipe(
        tap(active => (this.active = !active)),
        filter(() => !!this.enableBackendStatistics),
        switchMap(() => this.sendClickStatistics()),
        take(1),
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
      `,
    }).pipe(map(mutation => mutation.data.clickHamburgerButton));
  }
}
