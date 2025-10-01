## Dockerfile used to mimic the IMI Python pipeline. See
##   https://wiki.ajuntament.bcn/wiki/bin/view/Arquitectura/Normativa+Python/Pipeline/#HImatgeDocker
##   https://wiki.ajuntament.bcn/wiki/bin/download/Arquitectura/Normativa+Python/Pipeline/WebHome/Dockerfile
##
## Adapted for local development

ARG PYTHON_IMAGE=python:3.11.1-slim-bullseye

FROM ${PYTHON_IMAGE} as builder
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && xargs apt-get install -y --no-install-recommends build-essential \
    && apt-get clean -y \
    && apt-get autoremove -y \
    && rm -rf /tmp/* /var/tmp/* \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/system-*.txt /requirements/

RUN apt-get update \
    && xargs apt-get install -y --no-install-recommends < /requirements/system-dev.txt \
    && apt-get clean -y \
    && apt-get autoremove -y \
    && rm -rf /tmp/* /var/tmp/* \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/base.txt requirements/dev.txt requirements/production.txt /requirements/
RUN pip install -U pip \
    && pip install \
            --no-cache-dir \
            -r /requirements/dev.txt

COPY ./docker/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r//' /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app
ENTRYPOINT ["/entrypoint.sh"]
