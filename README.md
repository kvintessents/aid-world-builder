# AID World Builder
An online world builder for AI Dungeon.

https://aid-world-builder.ey.r.appspot.com/
## Development

### Get started

1. Clone the repository
2. `npm install`
3. `npm run dev`

This will start the Nuxt.JS development instance of the server.

### Contributing

Please feel free to clone the code and make pull requests. The code will be reviewed to make sure it matches the required standards and that it is beneficial users and that it fits the webapp.

After a successful merge to the `main` branch a new version will be deployed to the main server.

### Overview

The project is built on Nuxt.JS, a Vue.JS framework, internally running an additional Express server. The code is split into the `/client` and `/api` folder. `/client` is served to the user and `/api` is the RESTful API that talks to the database.

### /client
The `/client` folder has the Vue view files that determine what the user sees in the browser. Nuxt.JS automatically tries to find the `/client/pages/*` file according to the client's request.

For example if the user requests the link https://aid-world-builder.ey.r.appspot.com/world/1 then Nuxt.JS will try to find the file `/client/pages/world/_*.vue` which will in our case match `/client/pages/world/_id.vue`

Since the controller logic is split into a separate "server" (`/api`) then that `_id.vue` file will make HTTP requests to `https://aid-world-builder.ey.r.appspot.com/api/worlds/1` to get the data to render into the view.

### /api
The `/api` folder has the server-side logic that the user cannot access, implemented as a RESTful API. It is an Express app instance.

When the user makes a request to `https://aid-world-builder.ey.r.appspot.com/api/*` then some file in this folder is probably dealing with that. You can take a look at `/api/index.js` for an overview of the API routes.