.PHONY: build-dev start stop reset cek

build-dev:
	@if [ -e docker/nodejs18/Dockerfile ]; then rm -f docker/nodejs18/Dockerfile; fi
	@if [ -e .env ]; then rm -f .env; fi
	@if [ -e docker-compose.yml ]; then rm -f docker-compose.yml; fi
	cp docker/nodejs18/Dockerfile.dev docker/nodejs18/Dockerfile
	cp .env.dev .env
	cp docker-compose.dev.yml docker-compose.yml
	docker compose build --no-cache
	docker compose up -d

start:
	find . -type f -name '._*' -delete
	docker start $$(docker ps -a -q)

stop:
	find . -type f -name '._*' -delete
	docker stop $$(docker ps -a -q)

reset:
	find . -type f -name '._*' -delete
	docker stop $$(docker ps -q)
	docker rm $$(docker ps -a -q)
	docker volume rm $$(docker volume ls -q) || true
	docker rmi afirhan/threatmap || true
	docker rmi postgres:15 || true
	docker rmi redis:alpine || true
	docker network rm threatmap-network || true