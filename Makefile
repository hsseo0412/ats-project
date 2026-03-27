# Laravel Boilerplate — 자주 쓰는 명령어 모음
# 사용법: make <명령어>   예) make up, make migrate

.PHONY: help up down restart build setup shell logs \
        artisan migrate fresh seed test pint npm dev

help:
	@echo ""
	@echo "================================================"
	@echo "  Laravel Boilerplate 명령어 목록"
	@echo "================================================"
	@echo ""
	@echo "  make up           컨테이너 시작"
	@echo "  make down         컨테이너 종료"
	@echo "  make restart      컨테이너 재시작"
	@echo "  make build        Docker 이미지 빌드"
	@echo "  make setup        최초 설치 (composer + migrate + seed)"
	@echo "  make shell        PHP 컨테이너 쉘 접속"
	@echo "  make logs         PHP 컨테이너 로그 출력"
	@echo ""
	@echo "  make dev          NPM 개발 서버 (Hot Reload)"
	@echo "  make migrate      마이그레이션 실행"
	@echo "  make fresh        DB 초기화 + 재마이그레이션 + 시드"
	@echo "  make seed         시드만 실행"
	@echo "  make test         Pest 테스트 실행"
	@echo "  make pint         코드 스타일 정리 (Laravel Pint)"
	@echo "  make clear        캐시 전체 클리어"
	@echo ""
	@echo "  make artisan CMD='명령어'   Artisan 실행"
	@echo "    예) make artisan CMD='make:model Post -mcr'"
	@echo ""

# 컨테이너 제어
up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

build:
	docker compose build

# 최초 설치
setup:
	docker compose --profile setup up setup

# 개발 서버
dev:
	docker compose exec php npm run dev

# Artisan
artisan:
	docker compose exec php php artisan $(CMD)

# DB
migrate:
	docker compose exec php php artisan migrate

fresh:
	docker compose exec php php artisan migrate:fresh --seed

seed:
	docker compose exec php php artisan db:seed

# 테스트
test:
	docker compose exec php php artisan test

# 코드 스타일
pint:
	docker compose exec php ./vendor/bin/pint

# 캐시 클리어
clear:
	docker compose exec php php artisan optimize:clear

# 쉘 / 로그
shell:
	docker compose exec php bash

logs:
	docker compose logs -f php
