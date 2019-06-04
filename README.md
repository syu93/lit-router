# lit-router
**LitRouter** is a simple client side router, component loader (see [PRPL](https://developers.google.com/web/fundamentals/performance/prpl-pattern/)) based on [page.js](https://github.com/visionmedia/page.js). It's designed to work well with [**Web Components**](https://developer.mozilla.org/en-US/docs/Web/Web_Components) and [**LitElement**](https://lit-element.polymer-project.org).

Inspired by **vue-router**.

## Import

The **lit-router** package comes with sub packages `lit-page` and `lit-view` which are lightweight web-components that handle display of the selected route and view rendering based on the `active` attribute.

### Full import

To import all three classes, just import  lit-router global package :

```javascript
import { LitRouter } from "lit-router";
```



### Import as you use

You can also only import what you need :

```javascript
import { LitRouter } from "lit-router/pkg/dist-src/lit-router/lit-router.js";
```

```javascript
import "lit-router/pkg/dist-src/lit-page/lit-page.js";
```

```javascript
import "lit-router/pkg/dist-src/lit-view/lit-view.js";
```



## Usage

Define your routes as an Array of route Objects containing a name, a path, and a component to load (if needed).

Then call `router.start();` to activate the router.

You can also define `sub routes` and add route `middlewares`.



### Define routes

```javascript
import { LitRouter } from "lit-router/pkg/dist-src/lit-router/lit-router.js";

// Define your routes and the view component associated
const router = new LitRouter([
  {
    name: "view1",
    path: "/",
    component: () => import("./views/my-view1.js"), // Dynamically import component
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
  }, {
    name: "404",
    path: '*',
    middlewares: [
      (ctx, next) => {
        console.log(`Oups, I'm lost 😱 !!!`);
        next();
      }
    ]
  }
]);

// Start the router
router.start();
```



### Define route guard

You can define route guard with the **beforeEach** method like this :

```javascript
router.beforeEach((route, ctx, next) => {
  if (route.name == 'view2') { return document.page.redirect('/login'); }
  next();
});
```



### Define the view to display

Once your have define your routes, you can now listen on the `page-changed` event fired by the router to detect page changes.

Your can access the current matched route object via `document.$router`.

The router object expose a `getCurrentPage` method to retrieve the current view name. 

```javascript
// my-app.js
import { LitElement, html, css } from "lit-element";

// ...

class MyApp extends LitElement {
  constructor() {
    super();
    // Add an event listener on the `page-changed` event
    document.addEventListener('page-changed', () => {
      const router = document.$router;
      this.page = route.getCurrentPage(router);
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



## API

### LitRouter

Import **LitRouter** from the lit-route ES module.

```javascript
import { LitRouter } from "./lit-router.js";
```

Then start defining you routes by giving an **array** of route **objects**.

Route (*option*) :

**name** : The name of the route path. (this option is mandatory).

**path** : The path that need to be matched. (this option is mandatory).

**component** : This is used to load the component that need to be displayed for this route. It use [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports) to load component. See [PRPL](https://developers.google.com/web/fundamentals/performance/prpl-pattern/) for more information. 

**middlewares** : An array of middleware function to be executed before the route handler. This function takes two argument, a `context` object which represent the matched route, and a `next` method used to pass to the next middleware or route handler.

**children** : An array of sub route objects.
**NOTE**  : The child path must be the full path. e.g : `/view` and `/view/details`.



# lit-page

**lit-page** is a simple Web Component, that works with **lit-router**, that handle the display of the selected view.

## Import

Either import the whole **lit-router** package or just import the **lit-page** component.

```javascript
import "lit-router/pkg/dist-src/lit-page/lit-page.js";
```



## Usage

```javascript
// my-app.js
import { LitElement, html, css } from "lit-element";
import "lit-router/pkg/dist-src/lit-page/lit-page.js";

// ...

class MyApp extends LitElement {
  render() {
  	return html`
      <lit-page>
        <my-view1 name="view1" data-animation="page-enter"></my-view1>
        <my-view2 name="view2"></my-view2>
        <my-view3 name="view3"></my-view3>
        <section name="404">
          <h1>Oups, I'm lost 😱 !!!</h1>
        </section>
      </lit-page>
	`;
  }
}
```



## API

### Properties

**attrForSelected**		`String`	= 	'*name*'

*The **attrForSelected** property can be used to define the selective attribute to use on view component or tags* 

### Events

**page-changed**

*The page-changed event is fired when navigating to different page*

