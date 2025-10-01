## Dockerfile for nasia-spa-20 developers
# base image
#FROM node:18.19
FROM node:22.12.0-bookworm-slim as builder

RUN apt-get update\
	&& apt-get install -y --no-install-recommends\
	git patch \
	&& apt-get clean \
    && rm -rf /var/lib/apt/lists/*

#RUN npm config set strict-ssl false

# install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app


# Copiar package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install --force
COPY ./compose/local/start.sh /entrypoint
RUN sed -i 's/\r//' /entrypoint
RUN chmod +x /entrypoint

# start app
ENTRYPOINT ["/entrypoint"]
CMD ["ng", "serve", "--proxy-config", "proxy.conf.json", "--host", "0.0.0.0", "--configuration", "hmr", "--poll=10000"]
