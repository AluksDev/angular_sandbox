.PHONY: help

VERSION=$(shell ./version.sh)

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

build-dev: ## Build docker developer container.
	docker build -f Dockerfile-dev -t nasia-spa-dev-20 .

run-dev: ## Run developer container.
	docker run -it -v ${PWD}:/usr/src/app -v /usr/src/app/node_modules -p 4201:4200 --rm nasia-spa-dev-20

build: ## Build docker production container.
	docker build -t nasia-spa-20 .

run: ## Run production container.
	docker run -it -p 8081:80 --rm nasia-spa-20

stop: ## Stop and remove a running container
	docker stop nasia-spa-20; docker rm nasia-spa-20

version: ## Output the current version
	@echo $(VERSION)