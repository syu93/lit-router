import page from "page";

/**
 * LitRouter a simple page.js based component loader (PRPL)
 */
export class LitRouter {

  /**
   * LitRouter constructor
   * @param {Array} routes An array containing routes configuration
   * @param {String} basePath A string representing the base path of the application
   */
  constructor(routes, basePath) {
    this._beforeEach = (route, ctx, next) => { next() };
    this._afterEach = (route, ctx, next) => { console.log('after'); next() };
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
  getCurrentPage({ nodes = [], attrForSelected = 'name', router = document.$router} = {}) {
    const route = router;
    // Itterate through slot nodes to add the activate attribute
    nodes.map(node => {
      node.getAttribute(attrForSelected) == route.name ? node.setAttribute('active', true) : false;
    });
    if (route.component) route.component();
    if (route.parent)
      return this.getCurrentPage({ nodes, attrForSelected, router: route.parent });
    return route.name;
  }

  /**
   * Apply route configuratio to page.js
   * @param {Array} routes An array containing routes configuration
   * @param {Object} parent Object of parent route in case of nested route
   */
  _createRoute(routes, parent) {
    routes.map(route => {
      let { name, path, component, middlewares } = route;
      if (parent) { route.parent = parent; }
      // If no additional middleware added
      middlewares = middlewares || [];
      // If no component given
      component = component || false;
      const argumentArray = [path, this._beforeEach.bind(null, route), ...middlewares, (ctx, next) => {
        if (parent) {
          ctx.parent = route;
          this.getCurrentPage({ router: parent });
        }
        ctx.name = name;
        ctx.component = component;
        route.ctx = ctx;
        const event = new CustomEvent("page-changed", {detail: { context: ctx }});

        route.getCurrentPage = this.getCurrentPage;
        // Set the route context in document for global access
        window.document.$router = route;
        document.dispatchEvent(event);
        if (component) component();
      }];
      
      page.apply(null, argumentArray);

      this._afterEach.bind(null, route);
      if(route.children && route.children.length > 0) this._createRoute(route.children, route);
    });
  }
};
