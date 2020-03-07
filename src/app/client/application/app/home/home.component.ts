import { async, Component, html, LitElement, OnDestroy, OnInit, OnUpdate, property, queryAll } from '@rxdi/lit-html';
import { RouteParams } from '@rxdi/router';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @customElement 'home-component'
 */
@Component({
  selector: 'home-component',
  template(this: HomeComponent) {
    return html`
      <header>
        <h1>${this.name}</h1>
      </header>
      ${async(this.timer)} ${JSON.stringify(this.params)}
      <div>
        1
      </div>
      <div>
        2
      </div>
    `;
  },
})
export class HomeComponent extends LitElement implements OnInit, OnDestroy, OnUpdate {
  @property() private name: string;

  @RouteParams() private params;

  @queryAll('div') private divs: HTMLElement[];

  private timer = timer(1, 1000).pipe(map(v => v));

  OnInit() {
    console.log('HomeComponent component init');
  }

  OnDestroy() {
    console.log('HomeComponent component destroyed');
  }

  OnUpdate() {
    console.log('HomeComponent component updated');
  }
}
