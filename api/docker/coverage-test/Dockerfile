## Dockerfile used to mimic the IMI Python pipeline. See
##   https://wiki.ajuntament.bcn/wiki/bin/view/Arquitectura/Normativa+Python/Pipeline/#HImatgeDocker
##   https://wiki.ajuntament.bcn/wiki/bin/download/Arquitectura/Normativa+Python/Pipeline/WebHome/Dockerfile
##
## Some small modifications are made to reduce developer build time and future warnings on "pip install / pip wheel"

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
    && pip --use-feature=fast-deps wheel -r /requirements/dev.txt


## Test step
FROM builder as tester
RUN pip install --use-feature=fast-deps pytest pytest-cov==2.10.1

RUN pip install --use-feature=fast-deps --no-cache-dir -r /requirements/dev.txt

#COPY src/ /src/

#RUN pytest --cov-report xml --cov=src src

