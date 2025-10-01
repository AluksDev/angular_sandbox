FROM arquitectura-public-registry.ajuntament.bcn/imi/node:22.12.0-bookworm-slim-1 as builder

RUN apt-get update\
	&& apt-get install -y --no-install-recommends\
	git patch \
	&& apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm config set registry https://nexus.ajuntament.bcn/nexus/repository/npm-public/

### TEMPORARY WORKAROUND
RUN npm config set strict-ssl false

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json package-lock.json /usr/src/app/
RUN npm ci --unsafe-perm

# add app
COPY . /usr/src/app

# generate build
RUN node --max_old_space_size=4098 ./node_modules/@angular/cli/bin/ng build --configuration production

##################
### production ###
##################


# base image
FROM arquitectura-public-registry.ajuntament.bcn/imi/nginx:1.24.0-alpine-1

# copy artifact build from the 'build environment'
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]