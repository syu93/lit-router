/**
 * LitPage is a simple page view renderer, based on the current LitRouter selected route.
 */
class LitPage extends HTMLElement {
  constructor() {
    super();

    let shadowRoot = this.attachShadow({mode: 'open'});
    const template = document.createElement('template');
    template.innerHTML = `<style>
  :host { display: block; position: relative; }
  :host ::slotted(:not(slot):not([active])) { display: none !important; }
  ::slotted(*) { display: block; }
</style>
<main class="lit-page"><slot></slot></main>`;
    shadowRoot.appendChild(template.content.cloneNode(true));

    // Initialize properties values
    this.attrForSelected = 'name';
  }

  /**
   * Observe both camelcase and kebab case attribute
   */
  static get observedAttributes() {
    return ['attr-for-selected', 'attrForSelected'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.attrForSelected = newValue;
  }

  /**
   * Itterate over node inside slot element on LitPage component first updated
   * To determine which page is currently activated
   */
  connectedCallback() {
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
    document.$router.getCurrentPage({ nodes: content, attrForSelected: this.attrForSelected, router: document.$router });

    let selectedPage = null;
    for (let el of content) {
      if (el.hasAttribute('active')) { selectedPage = el; };
      el.classList.remove('animated');
    }
    
    if (!selectedPage) return;
    if (!selectedPage.classList.contains('animated')) {
      selectedPage.classList.add('animated');
      selectedPage.classList.add(selectedPage.dataset.animation || "page-enter");
    }
  }
}

window.customElements.define('lit-page', LitPage);
