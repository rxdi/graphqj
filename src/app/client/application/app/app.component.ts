import { Inject } from '@rxdi/core';
import { html, Component } from '@rxdi/lit-html';

/**
 * @customElement app-component
 */
@Component({
  selector: 'app-component',
  template() {
    return html`
      <router-outlet>
        <navbar-component slot="header"></navbar-component>
        <footer-component slot="footer"></footer-component>
      </router-outlet>
    `;
  },
  container: document.body
})
export class AppComponent extends HTMLElement {
}