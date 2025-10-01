#########################
### build environment ###
#########################

# base image
FROM arquitectura-public-registry.ajuntament.bcn/imi/node:v18.20.1-slim-1 AS builder

RUN apt-get update\
	&& apt-get install -y --no-install-recommends\
	git\
	&& apt-get clean\
  && rm -rf /var/lib/apt/lists/*

#RUN npm config set registry https://nexus.ajuntament.bcn/nexus/repository/npm-public/

### TEMPORARY WORKAROUND
RUN npm config set strict-ssl false

# install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json package-lock.json /usr/src/app/
RUN npm ci --unsafe-perm

# add app
COPY . /usr/src/app

# run tests
#RUN ng test --watch=false

# generate build
RUN node --max_old_space_size=4098 ./node_modules/@angular/cli/bin/ng build --prod

##################
### production ###
##################

# base image
FROM arquitectura-public-registry.ajuntament.bcn/imi/nginx:1.16.1-alpine-1

# copy artifact build from the 'build environment'
COPY ./compose/production-docker-02/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
