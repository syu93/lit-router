import page from 'page';
import { LitElement, css, html } from 'lit-element';

/**
 * LitRouter a simple page.js based component loader (PRPL)
 */

class LitRouter {
  /**
   * LitRouter constructor
   * @param {Array} routes An array containing routes configuration
   * @param {String} basePath A string representing the base path of the application
   */
  constructor(routes, basePath) {
    this._beforeEach = (route, ctx, next) => {
      next();
    };

    this._afterEach = (route, ctx, next) => {
      console.log('after');
      next();
    };

    this.routes = routes;
    if (basePath) page.base(basePath);
    document.page = page;
  }
  /**
   * BeforeEach golbal middleware
   * @param {Function} callback A callback function to call before each route
   */


  beforeEach(callback) {
    return this._beforeEach = callback;
  }
  /**
   * AfterEach golbal middleware
   * @param {Function} callback A callback function to call after each route
   */


  afterEach(callback) {
    return this._afterEach = callback;
  }
  /**
   * Start the router instance and apply the routes configuration
   */


  start() {
    this._createRoute(this.routes, null);

    page();
  }
  /**
   * Enable the `active` attribute inside a LitPage element. The active element is the selected page
   * @param {Object} route ROute definition object
   * @param {Array} nodes LitPage slotted view element to be displayed
   */


  getCurrentPage() {
    var {
      nodes = [],
      attrForSelected = 'name',
      router = document.$router
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var route = router; // Itterate through slot nodes to add the activate attribute

    nodes.map(node => {
      node.getAttribute(attrForSelected) == route.name ? node.setAttribute('active', true) : false;
    });
    if (route.component) route.component();
    if (route.parent) return this.getCurrentPage({
      nodes,
      attrForSelected,
      router: route.parent
    });
    return route.name;
  }
  /**
   * Apply route configuratio to page.js
   * @param {Array} routes An array containing routes configuration
   * @param {Object} parent Object of parent route in case of nested route
   */


  _createRoute(routes, parent) {
    routes.map(route => {
      var {
        name,
        path,
        component,
        middlewares
      } = route;

      if (parent) {
        route.parent = parent;
      } // If no additional middleware added


      middlewares = middlewares || []; // If no component given

      component = component || false;
      var argumentArray = [path, this._beforeEach.bind(null, route), ...middlewares, (ctx, next) => {
        if (parent) {
          ctx.parent = route;
          this.getCurrentPage({
            router: parent
          });
        }

        ctx.name = name;
        ctx.component = component;
        route.ctx = ctx;
        var event = new CustomEvent("page-changed", {
          detail: {
            context: ctx
          }
        });
        route.getCurrentPage = this.getCurrentPage; // Set the route context in document for global access

        window.document.$router = route;
        document.dispatchEvent(event);
        if (component) component();
      }];
      page.apply(null, argumentArray);

      this._afterEach.bind(null, route);

      if (route.children && route.children.length > 0) this._createRoute(route.children, route);
    });
  }

}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<main class=\"lit-page\"><slot></slot></main>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      :host {\n        display: block;\n        position: relative;\n      }\n      :host ::slotted(:not(slot):not([active])) { display: none !important; }\n      ::slotted(*) { display: block; }\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
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
    var slot = this.shadowRoot.querySelector('main slot');
    var content = slot.assignedNodes().filter(node => !node.nodeValue);

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
    for (var el of content) {
      el.removeAttribute('active');
    }

    document.$router.getCurrentPage({
      nodes: content,
      attrForSelected: this.attrForSelected,
      router: document.$router
    });
    var selectedPage = null;

    for (var _el of content) {
      if (_el.hasAttribute('active')) {
        selectedPage = _el;
      }

      _el.classList.remove('animated');
    }

    if (!selectedPage) return;

    if (!selectedPage.classList.contains('animated')) {
      selectedPage.classList.add('animated');
      selectedPage.classList.add(selectedPage.dataset.animation || "page-enter");
    }
  }

  static get styles() {
    return css(_templateObject());
  }

  render() {
    return html(_templateObject2());
  }

}

window.customElements.define('lit-page', LitPage);

class LitView extends LitElement {
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

export { LitRouter };
