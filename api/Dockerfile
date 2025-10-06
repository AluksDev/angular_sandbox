## Dockerfile used to mimic the IMI Python pipeline. See
##   https://wiki.ajuntament.bcn/wiki/bin/view/Arquitectura/Normativa+Python/Pipeline/#HImatgeDocker
##   https://wiki.ajuntament.bcn/wiki/bin/download/Arquitectura/Normativa+Python/Pipeline/WebHome/Dockerfile
##
## Some small modifications are made to reduce developer build time and future warnings on "pip install / pip wheel"

ARG PYTHON_IMAGE=python:3.11.1-slim-bullseye

FROM ${PYTHON_IMAGE} as builder
ENV PYTHONUNBUFFERED 1
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
    && xargs apt-get install -y --no-install-recommends build-essential \
    && apt-get clean -y \
    && apt-get autoremove -y \
    && rm -rf /tmp/* /var/tmp/* \
    && rm -rf /var/lib/apt/lists/*

COPY requirements /requirements/

RUN apt-get update \
    && xargs apt-get install -y --no-install-recommends < /requirements/system-dev.txt \
    && apt-get clean -y \
    && apt-get autoremove -y \
    && rm -rf /tmp/* /var/tmp/* \
    && rm -rf /var/lib/apt/lists/*

COPY wheels /wheels/
RUN pip install -U pip \
    && pip wheel -r /requirements/dev.txt -w /wheels


## Test step
FROM builder as tester
RUN pip install pytest pytest-cov

RUN pip install --no-cache-dir \
                -r /requirements/dev.txt \
                -f /wheels

COPY src/ /src/
RUN pytest --cov-report xml --cov=src src

## Release image
FROM ${PYTHON_IMAGE}
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND noninteractive

# Install system dependencies
COPY --from=builder /requirements /requirements
RUN apt-get update \
    && xargs apt-get install -y --no-install-recommends < /requirements/system-production.txt \
    && apt-get clean -y \
    && apt-get autoremove -y \
    && rm -rf /tmp/* /var/tmp/* \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY --from=builder /wheels /wheels
RUN pip install -U pip \
    && pip install --no-cache-dir \
                -r /requirements/production.txt \
                -f /wheels \
    && rm -rf /requirements /wheels

# Create user and group
RUN groupadd --system django \
    && useradd --system -g django django

# Add configuration
COPY /docker/entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh
COPY /docker/uwsgi.ini /etc/uwsgi/uwsgi.ini

# Add application sources
WORKDIR /app
COPY src/ .
RUN chown -R django /app

USER django

ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 8000
