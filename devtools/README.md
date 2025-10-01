Helper tools for Sandbox developers
=================================

update-all.sh
-------------
Get a copy of all needed repositories for Sandbox development. To use it, link this file from the top level directorty,
i.e:

```
sandbox (base dir)
  |-- devtools (this repo dir)
  |     \-- update-all.sh (regular file)
  \-- update-all.sh (symlink)
```

To get this structure, execute this in a shell console:

```bash
mkdir sandbox
cd sandbox
git clone ssh://git@gitlab.ajuntament.bcn:2201/dti/sandbox/devtools.git
ln -s devtools/update-all.sh
```

After that, you can execute:

```
$ ./update-all.sh
```

This will create all needed repositories and will link development docker-compose files in the `sandbox` root folder.

`update-all.sh` can be executed any time later to pull latest changes from all the repositories (included this one).

docker-compose files
--------------------
There are three docker-compose files:

- **docker-compose.yml**: This file is for local development. It runs Django and Angular test servers. Frontend is run  
  on port 4200 and API backend is run on port 8000.
- **docker-compose.production-test.yml**: This file is for testing a production configuration. Frontend is compiled in 
production mode and backend is run with uWSGI. Frontend is run on port 80 and backend in port 8000.


docker-compose.yml
------------------
Use this file to build and launch a fully functional development environment. Use it from the root `sandbox` folder
containing all the repositories. In that directory, `docker-compose.yml` must be a symlink to the actual file in this
repo. The script `update-all.sh` will create this symlink.  

```bash
# Build containers
docker-compose build

# Launch all services
docker-compose up
```

After that, point your browser to:
- http://localhost:4200/  --> SPA frontend 
- http://localhost:8000/swagger/  --> API definition and test

swagger-update.sh
-----------------
This script regenerates the OpenAPI swagger definitions stored in sandbox-api repo. It overwrites these files:

- apiconnect/sandbox-api/apis/gocom-api.json

After the regeneration is made, these files must be commited to sandbox-api.

Before executing this script, the `jq` tool must be installed.

```bash
sudo apt update
sudo apt install jq 
```

To run it, go to the parent `sandbox` directory then start the sandbox docker-compose `django`service (or the whole service
stack) and just invoke the script with no arguments:

```bash
docker-compose up django

# In another console, inside 'sandbox' directory
./swagger-update.sh
``` 

Makefile
--------
The linked `Makefile` has a lot of helper targets for developers:

```
help                           This help.
build                          Build all developer containers (dev and coverage)
build-dev                      Build developer containers for services (backend, frontend, ...)
build-coverage                 Build containers for api coverage test (local test)
build-etl                      Build developer containers for ETL
up                             Run developer environment (api, celery, spa)
up-postgres                    Run postgresql (in detached mode)
down                           Stop and remove all containers
down-dev                       Stop and remove all developer service containers defined in docker-compose.yml
down-coverage                  Stop and remove coverage tests containers defined in docker-compose.coverage-test.yml
down-etl                       Stop and remove all ETK service containers defined in docker-compose.migration-local.yml
django-shell                   Run interactive shell in 'django' container
django-migrate                 Run 'migrate' command in 'django' container
run-etl                        Run local ETL process
restart-etl                    Restart local ETL process
coverage                       Show unit testing coverage using test container (xml output)
coverage-shell                 Shell inside testing coverage container
sonarqube-up                   Run sonarqube server
sonarqube-down                 Stop and destroy sonarqube server container
sonarscanner                   Run sonarqube server + python coverage test + sonarscanner code analyzer
sonarscanner-set-password      Set sonarqube server username:password to admin:gocom using API
sonarscanner-code-scan         Run sonarscanner code scan over gocom-api/src directory
symlink-devtools-utils         Prepare symlinks for devtools helper files
gocom-int-psql-portforward     Port-forward gocom-integracio postgresql service (local port 15432)
backup                         Backup postgresql and elasticsearch volumes to .tar.bz2 files
restore                        Restore postgresql volumes and elasticsearch volumes from .tar.bz2 files
```

