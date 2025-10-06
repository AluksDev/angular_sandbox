.PHONY: help

.DEFAULT_GOAL := help
PROJECTNAME_DEV = sandbox
COMPOSE_DEV := env UID=${UID} GID=${GID} docker compose -p $(PROJECTNAME_DEV) -f docker-compose.yml
UID := $(shell id -u)
GID := $(shell id -g)

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: build-dev build-coverage ## Build all developer containers (dev and coverage)

build-dev: ## Build developer containers for services (backend, frontend, ...)
	docker compose build

build-coverage: symlink-devtools-utils ## Build containers for api coverage test (local test)
	docker compose -f docker-compose.coverage-test.yml build

build-production-test: ## Build developer containers for ETL
	docker compose -f docker-compose.production-test.yml build

up: ## Run developer environment (api, celery, spa)
	docker compose up

up-spa: ## Run developer environment (api, celery, spa)
	docker compose up spa

up-api: ## Run developer environment api
	docker compose up django

up-postgres: ## Run postgresql (in detached mode)
	docker compose up -d postgres

up-production-test: ## Run developer environment spa20
	docker compose -f docker-compose.production-test.yml up

down: down-dev down-coverage ## Stop and remove all containers

down-dev: ## Stop and remove all developer service containers defined in docker-compose.yml
	docker compose down

down-coverage: ## Stop and remove coverage tests containers defined in docker-compose.coverage-test.yml
	docker compose -f docker-compose.coverage-test.yml down

down-production-test: ## Stop and remove all ETK service containers defined in docker compose.migration-local.yml
	docker compose -f docker-compose.production-test.yml down

django-shell: ## Run interactive shell in 'django' container
	docker compose run --rm django python manage.py shell

django-migrate: ## Run 'migrate' command in 'django' container
	docker compose run --rm django django-migrate

django-makemigrations: ## Run 'makemigrations' command in 'django' container
	docker compose run --rm django python manage.py makemigrations

coverage: symlink-devtools-utils ## Show unit testing coverage using test container (xml output)
	docker compose -f docker-compose.coverage-test.yml run --rm django pytest --cov=src --cov-report xml:src/coverage-reports/coverage-report.xml --cov-report term-missing src

coverage-shell: symlink-devtools-utils ## Shell inside testing coverage container
	@/bin/echo -e "*************************************\nTo execute the test suite, run this:\n  pytest --cov=src src\n*************************************\n"
	docker compose -f docker-compose.coverage-test.yml run --rm django bash

backup: ## Backup postgresql and elasticsearch volumes to .tar.bz2 files
	docker run -v sandbox_local_postgres_data:/volume --rm loomchild/volume-backup backup - > sandbox_local_postgres_data.tar.bz2

restore: ## Restore postgresql volumes and elasticsearch volumes from .tar.bz2 files
	cat sandbox_local_postgres_data.tar.bz2 | docker run -i -v sandbox_local_postgres_data:/volume --rm loomchild/volume-backup restore -

symlink-devtools-utils: ## Prepare symlinks for devtools helper files
	@ ! [ -L docker-compose.coverage-test.yml ] && ln -s gocom-devtools/docker-compose.coverage-test.yml || true
	@ ! [ -L docker-compose.production-test.yml ] && ln -s ./gocom-devtools/docker-compose.production-test.yml || true

django-makemessages: ## Run 'makemessages' command in 'django' container
	docker compose run --rm django python manage.py makemessages -l ca -l es

django-compilemessages: ## Run 'compilemessages' command in 'django' container
	docker compose run --rm django python manage.py compilemessages

swagger: ## Generate OpenAPI definition
	./swagger-update.sh sfile=spa/swagger.json surl=http://localhost:8000/swagger.json

apigen: swagger ## Run NPM APIGEN (yasag)
	docker compose run --rm spa npm run apigen
	sudo chown -R $(UID):$(GID) ./spa/src/api

api-newapp: ## Create new backend app, expects name argument.
	$(COMPOSE_DEV) run --rm django python manage.py startapp $(name)
	mkdir ./api/src/$(name)/tests/
	touch ./api/src/$(name)/serializers.py
	touch ./api/src/$(name)/tests/test_$(name).py
	touch ./api/src/$(name)/factory.py
	rm -r ./api/src/$(name)/admin.py
	rm -r ./api/src/$(name)/apps.py
	sudo chown -R $(UID):$(GID) ./api/src/$(name)
	
api-createsuperuser: ## Create new superadmin user.
	$(COMPOSE_DEV) run --rm api python manage.py createsuperuser
