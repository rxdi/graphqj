import { Inject } from '@rxdi/core';
import { html, Component, async } from '@rxdi/lit-html';
import { ReactOnChangeService } from './core/react-on-change/react-on-change.service';

/**
 * @customElement app-component
 */
@Component({
  selector: 'app-component',
  template(this: AppComponent) {
    return html`
      ${async(this.reactToChanges.react())}
    `;
  },
  container: document.body
})
export class AppComponent extends HTMLElement {
  @Inject(ReactOnChangeService) private reactToChanges: ReactOnChangeService;
}
