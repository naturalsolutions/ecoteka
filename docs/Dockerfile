FROM squidfunk/mkdocs-material as builder

RUN pip install markdown_include

COPY ./docs /docs
COPY ./ /docs_src/

#RUN mkdocs build -f /docs/mkdocs.yml -d /site

#FROM nginx:alpine

#COPY --from=builder /site /usr/share/nginx/html/docs