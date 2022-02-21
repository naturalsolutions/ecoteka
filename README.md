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
- [DeckGL][deckgl] as library to render interactive maps.
- [Tippecanoe][tippecanoe] to build vector tilesets.

## Install environment for development

You need to login to the gitlab registry the first time in order to download the images. For that, you have to execute the following command:

```console
docker login registry.gitlab.com
```

Then you can use the setup script to start the dev environment.

```shell
./scripts/setup_dev.sh
```

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

## How to deploy in production

First create an .env file and modify the necessary variables:

```bash
cp .env.example .env
```

and you can execute the following command to deploy in production:

```bash
./script/deploy.sh
```

[![logo-natural-solutions][logo-ns]][ns]

[logo-ns]: docs/logos/natural-solutions-logo-horizontal.png
[ns]: https://www.natural-solutions.eu/
[docker]: https://docs.docker.com/get-docker
[docker-compose]: https://docs.docker.com/compose/install
[traefik]: https://docs.traefik.io
[postgresql]: https://www.postgresql.org/docs/12/index.html
[sql-alchemy]: https://www.sqlalchemy.org
[alembic]: https://alembic.sqlalchemy.org/en/latest
[fastapi]: https://fastapi.tiangolo.com
[next.js]: https://nextjs.org
[material-ui]: https://material-ui.com
[deckgl]: https://deck.gl/
[tippecanoe]: https://github.com/mapbox/tippecanoe
[uvicorn]: https://www.uvicorn.org/settings
[cypress]: https://docs.cypress.io/
[backend]: https://gitlab.com/natural-solutions/ecoteka/-/tree/dev/backend
[frontend]: https://gitlab.com/natural-solutions/ecoteka/-/tree/dev/frontend
