import { Inject } from '@rxdi/core';
import { async, Component, html } from '@rxdi/lit-html';

import { ReactOnChangeService } from './core/react-on-change/react-on-change.service';

/**
 * @customElement app-component
 */
@Component({
  selector: 'app-component',
  template(this: AppComponent) {
    return html`
      <router-outlet>
        ${async(this.reactToChanges.subscribeToAppChanges())}
      </router-outlet>
    `;
  },
  container: document.body,
})
export class AppComponent extends HTMLElement {
  @Inject(ReactOnChangeService) private reactToChanges: ReactOnChangeService;
}
