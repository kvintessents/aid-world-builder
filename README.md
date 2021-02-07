# AID World Builder
An online world builder for AI Dungeon.

https://aid-world-builder.ey.r.appspot.com/

## Contributing

Please feel free to clone the code and make pull requests. The code will be reviewed to make sure it matches the required standards and that it is beneficial users and that it fits the webapp.

After a successful merge to the `main` branch a new version will be deployed to the main server.
## Development

### Get started

#### Prerequisites

1. Docker
2. Node

#### Installation

1. Clone the repository
2. Run `npm install` to install the required package dependencies
3. Run `npm run db` to start the MySQL server in Docker
4. Create an `.env` file in the root of the project with the following contents:

```
DB_HOST=127.0.0.1
DB_DATABASE=aid-world-builder
DB_USER=root
DB_PASS=password
DB_MIGRATION_PASSWORD=password
```

5. Run `npm run dev` to start the server
6. Navigate to `http://localhost:3000/api/migrate/all?passwd=password`

You can now navigate to `http://localhost:3000/` and you should have a working server instance.

### Overview

The project is built on Nuxt.JS, a Vue.JS framework, internally running an additional Express server. The code is split into the `/client` and `/api` folder. `/client` is served to the user and `/api` is the RESTful API that talks to the database.

### /client
The `/client` folder has the Vue view files that determine what the user sees in the browser. Nuxt.JS automatically tries to find the `/client/pages/*` file according to the client's request.

For example if the user requests the link https://aid-world-builder.ey.r.appspot.com/world/1 then Nuxt.JS will try to find the file `/client/pages/world/_*.vue` which will in our case match `/client/pages/world/_id.vue`

Since the controller logic is split into a separate "server" (`/api`) then that `_id.vue` file will make HTTP requests to `https://aid-world-builder.ey.r.appspot.com/api/worlds/1` to get the data to render into the view.

### /api
The `/api` folder has the server-side logic that the user cannot access, implemented as a RESTful API. It is an Express app instance.

When the user makes a request to `https://aid-world-builder.ey.r.appspot.com/api/*` then some file in this folder is probably dealing with that. You can take a look at `/api/index.js` for an overview of the API routes.

### Export formats

The export formats are in [/client/utils/formatters/](https://github.com/kvintessents/aid-world-builder/tree/main/client/utils/formatters). Check out the README.md in that folder for an explanation on how to build your own formatter.

## Troubleshooting

##### Client does not support authentication protocol requested by server; consider upgrading MySQL client

Get into the DB Docker instance:
```
docker exec -it aid-world-builder-mysql /bin/bash
```

Get into the MySQL server:
`mysql -u root -p` and type in `password`

Run the following commands
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password'
flush privileges;
```

Type `exit` twice to exit the database and docker instance. Run `npm run dev` again to start the server and it should connect correctly.