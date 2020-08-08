<h1 align="center">Ecoteka</h1>

## Requirements

All work environments need at least the following requirements:

- Docker: [how to install it][docker]
- Docker Compose: [how to install it][docker-compose]

## Structure

- We use [Traefik][traefik] as proxy
- The project uses as database [PostgreSQL 12][postgresql], 
  [SQLAlchemy][sql-alchemy] as toolkit and Object Relational Mapper and 
  [Alembic][alembic] as database migration tool.
- The [backend] uses the [FastAPI][fastapi] framework.
- The [frontend] uses [next.js][next.js] as framework and 
  [Material-UI][material-ui] as components library.
- [Mapbox GL JS][mapbox-gl-js] as library to render interactive maps.
- [Tippecanoe][tippecanoe] to build vector tilesets.


## Quick Start With Docker Compose

To start with docker-compose we just need to copy `.env.example` to `.env`. You 
can use the following command:

```bash
$ cp .env.example .env
``` 

`.env` contains all the environment variables that we can modify in out project.

Once the variables are set, you can start with the following command:

```bash
$ docker-compose up -d

Starting ecoteka_proxy_1    ... done
Starting ecoteka_db_1       ... done
Starting ecoteka_backend_1  ... done
Starting ecoteka_frontend_1 ... done
```

With our container running, we should be able to see the main page of the 
project on the following link:

  - http://localhost:8000

## Access To API Documentation

The project's API documentation is found once the local instance of the 
backend is started on the next path:

  - http://localhost:8000/api/v1/docs

## Environment variables

These are the environment variables that you can set in docker-compose to 
configure it and their default values:

### GLOBAL

#### `NS_ECOTEKA_DOMAIN_NAME`

The domain name associated to the stack

By default:

  - localhost

### PROXY

#### `NS_ECOTEKA_PROXY_IMAGE`

The name of the traefik docker image.

By default:

  - traefik:v2.2

#### `NS_ECOTEKA_PROXY_CERTIFICATESRESOLVERS_LE_ACME_EMAIL`

By default:

  - noreply@localhost

#### `NS_ECOTEKA_PROXY_HTTP_PORT`

The external [Traefik][traefik] port.

By default:

  - 8000

#### `NS_ECOTEKA_PROXY_API_PORT`

The external [Traefik][traefik] API port.

By default:

  - 8080

### DB

#### `NS_ECOTEKA_DB_IMAGE`

The name of the postgres docker image.

By default:

  - traefik:v2.2

#### `NS_ECOTEKA_DB_PORT`

The [PostgreSQL][postgresql] database port.

By default:

  - 5432

#### `NS_ECOTEKA_DB_SERVER`

The [PostgreSQL][postgresql] server host.

By default:

  - db

#### `NS_ECOTEKA_DB_USER`

The [PostgresSQL][postgresql] user.

By default:

  - postgres

#### `NS_ECOTEKA_DB_PASSWORD`

The [PostgresSQL][postgresql] user password.

By default:

  - password

#### `NS_ECOTEKA_DB_NAME`

The [PostgresSQL][postgresql] database name.

By default:

  - ecoteka

### FRONTEND

#### `NS_ECOTEKA_FRONTEND_IMAGE`

The path of the frontend docker image.

By default:

  - registry.gitlab.com/natural-solutions/ecoteka:latest


### BACKEND

#### `NS_ECOTEKA_BACKEND_IMAGE`

The path of the backend docker image.

By default:

  - registry.gitlab.com/natural-solutions/ecoteka:backend-latest

#### `NS_ECOTEKA_BACKEND_PROJECT_NAME`

The project name for [FastAPI][fastapi].

By default:

  - ecoTeka

#### `NS_ECOTEKA_BACKEND_BASE_PATH`

To allow [FastAPI][fastapi] to run behind a proxy it is possible to set the
--root-path parameter to [Uvicorn][uvicorn].

More information can be found on FastAPI's documentation page: https://fastapi.tiangolo.com/advanced/behind-a-proxy/#about-root_path

By default:

  - /api/v1

#### `NS_ECOTEKA_BACKEND_EXTERNAL_PATH`

External URL for API access

By default:

  - http://localhost:8000/api/v1

#### `NS_ECOTEKA_BACKEND_FIRST_SUPERUSER_EMAIL`

The first time the project is started up, a super admin is created. `NS_ECOTEKA_BACKEND_FIRST_SUPERUSER_EMAIL` defines the email with which the 
user will be created.

By default:

  - admin@ecoteka.natural-solutions.eu

#### `NS_ECOTEKA_BACKEND_FIRST_SUPERUSER_PASSWORD`

The password for the super admin user explained above.

By default:

  - password

#### `NS_ECOTEKA_BACKEND_SMTP_TLS`

By default:

  - True

#### `NS_ECOTEKA_BACKEND_SMTP_PORT`

By default:

  - 438

#### `NS_ECOTEKA_BACKEND_SMTP_HOST`

By default:

  - localhost

#### `NS_ECOTEKA_BACKEND_SMTP_USER`

By default:

  - user

#### `NS_ECOTEKA_BACKEND_SMTP_PASSWORD`

By default:

  - password

#### `NS_ECOTEKA_BACKEND_EMAILS_ENABLED`

By default:

  - False

#### `NS_ECOTEKA_BACKEND_EMAILS_TEMPLATES_DIR`

By default:

  - app/app/email-templates/build

#### `NS_ECOTEKA_BACKEND_EMAILS_FROM_EMAIL`

By default:

  - contact@ecoteka.natural-solutions.eu

#### `NS_ECOTEKA_BACKEND_EMAIL_RESET_TOKEN_EXPIRE_HOURS`

By default:

  - 48



[docker]: https://docs.docker.com/get-docker
[docker-compose]: https://docs.docker.com/compose/install
[traefik]: https://docs.traefik.io
[postgresql]: https://www.postgresql.org/docs/12/index.html
[sql-alchemy]: https://www.sqlalchemy.org
[alembic]: https://alembic.sqlalchemy.org/en/latest
[fastapi]: https://fastapi.tiangolo.com
[next.js]: https://nextjs.org
[material-ui]: https://material-ui.com
[mapbox-gl-js]: https://docs.mapbox.com/mapbox-gl-js/api
[tippecanoe]: https://github.com/mapbox/tippecanoe
[uvicorn]: https://www.uvicorn.org/settings

[backend]: https://gitlab.com/natural-solutions/ecoteka/-/tree/dev/backend
[frontend]: https://gitlab.com/natural-solutions/ecoteka/-/tree/dev/frontend