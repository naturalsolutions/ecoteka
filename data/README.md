# Ecoteka Data

## Docker notes

If docker is installed you can build an image and run this as a container.

```bash
docker build -t natural-solutions/ecoteka-data .
```

Once the image is build, ecoteka-data can be invoked by running the following:

```bash
docker run --rm -p 8000:80 natural-solutions/ecoteka-data
```

The optional --rm flag removes the container filesystem on completion to prevent cruft build-up. See:
https://docs.docker.com/engine/reference/run/#clean-up---rm
