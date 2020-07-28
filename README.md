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

[backend]: https://gitlab.com/natural-solutions/ecoteka/-/tree/dev/backend
[frontend]: https://gitlab.com/natural-solutions/ecoteka/-/tree/dev/frontend

## Docker Compose

To start with docker-compose we just need to copy `.env.example` to `.env`. We 
use the following command:

```bash
$ cp .env.example .env
``` 

`.env` contains all the environment variables that we can modify in out project.

Once the variables are set, you car start with the following command:

```bash
$ docker-compose up -d

Starting ecoteka_proxy_1    ... done
Starting ecoteka_db_1       ... done
Starting ecoteka_backend_1  ... done
Starting ecoteka_frontend_1 ... done
```