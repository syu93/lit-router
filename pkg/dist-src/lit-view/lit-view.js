import { LitElement } from 'lit-element';
export class LitView extends LitElement {
  // Only render this page if it's actually visible.
  shouldUpdate() {
    return this.active;
  }

  static get properties() {
    return {
      active: {
        type: Boolean
      },
      page: {
        type: String
      }
    };
  }

}
window.customElements.define('lit-view', LitView);