import { LitElement, html, css } from "lit-element";
/**
 * LitPage is a simple page view renderer, based on the current LitRouter selected route.
 */

class LitPage extends LitElement {
  constructor() {
    super();
    this.attrForSelected = 'name';
  }

  static get properties() {
    return {
      attrForSelected: String
    };
  }
  /**
   * Itterate over node inside slot element on LitPage component first updated
   * To determine which page is currently activated
   */


  firstUpdated() {
    const slot = this.shadowRoot.querySelector('main slot');
    const content = slot.assignedNodes().filter(node => !node.nodeValue);

    this._renderView(content);

    document.addEventListener('page-changed', e => {
      this._renderView(content);
    });
  }
  /**
   * Itterate through dom nodes to enable/disable `active` attribute on nodes
   * @param {DomNodes} content LitPage slot content
   */


  _renderView(content) {
    for (let el of content) el.removeAttribute('active');

    document.$router.getCurrentPage({
      nodes: content,
      attrForSelected: this.attrForSelected,
      router: document.$router
    });
    let selectedPage = null;

    for (let el of content) {
      if (el.hasAttribute('active')) {
        selectedPage = el;
      }

      ;
      el.classList.remove('animated');
    }

    if (!selectedPage) return;

    if (!selectedPage.classList.contains('animated')) {
      selectedPage.classList.add('animated');
      selectedPage.classList.add(selectedPage.dataset.animation || "page-enter");
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
      :host ::slotted(:not(slot):not([active])) { display: none !important; }
      ::slotted(*) { display: block; }
    `;
  }

  render() {
    return html`<main class="lit-page"><slot></slot></main>`;
  }

}

window.customElements.define('lit-page', LitPage);