# lit-router
**LitRouter** is a simple client side router, component loader (PRPL) based [page.js](https://github.com/visionmedia/page.js) , 



## Usage

Define your routes as an Array of route objects containing a name, a path, and a component to load (if needed).

```javascript
import { LitRouter } from "./lit-router.js";

// Define your routes and the view component associated
const router = new LitRouter([
  {
    name: "view1",
    path: "/",
    component: () => import("./views/my-view1.js"), // Dynamicly import component
    middlewares: [
      (ctx, next) => {
        // Do stuff ...
        next();
      },
    ],
    children: [
      {
        name: "subview1",
        path: "/view1/detail",
        component: () => import("./views/my-detail.js"),
      }
    ]
  }, {
    name: "view2",
    path: "/view2",
    component: () => import("./views/my-view2.js")
  }, {
    name: "view3",
    path: "/view3",
    component: () => import("./views/my-view3.js")
  }
]);

// Start the router
router.start();
```







```javascript
// my-app.js
...

class MyApp extends LitElement {
  constructor() {
    super();
    // Add an event listener on the `page-changed` event
    document.addEventListener('page-changed', () => {
      const route = document.$route;
      this.page = route.getCurrentPage(route);
    });
  }

  static get properties() {
    return {
      page: String
    };
  }

  static get styles() {
    return css`
      main > * {
        display: none;
      }
      main [active] {
        display: block;
      }
    `;
  } 

  render() {
  	return html`
      <main id="view">
        <my-view1 name="view1" ?active="${this.page == 'view1'}"></my-view1>
        <my-view2 name="view2" ?active="${this.page == 'view2'}"></my-view2>
        <my-view3 name="view3" ?active="${this.page == 'view3'}"></my-view3>
      </main>
	`;
  }
}
```





It also provide a simple **LitPage** component that handle which view to display.

You just need to define a name attribute

```html
// my-app.js
...
<lit-page>
    <my-view1 name="view1"></my-view1>
    <my-view2 name="view2"></my-view2>
    <my-view3 name="view3"></my-view3>
</lit-page>
```

