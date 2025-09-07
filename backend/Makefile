.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make migrate-up       - Run all up migrations"
	@echo "  make migrate-down     - Run all down migrations"
	@echo "  make migrate-create   - Create a new migration file (use name=<migration_name>)"
	@echo "  make migrate-force    - Force set migration version (use version=<version>)"
	@echo "  make migrate-version  - Show current migration version"
	@echo "  make migrate-install  - Install golang-migrate tool"

# Database configuration
DB_USER ?= root
DB_PASSWORD ?= rootpassword
DB_HOST ?= localhost
DB_PORT ?= 3306
DB_NAME ?= hatamo

# Migration database URL
DATABASE_URL = mysql://$(DB_USER):$(DB_PASSWORD)@tcp($(DB_HOST):$(DB_PORT))/$(DB_NAME)

.PHONY: migrate-install
migrate-install:
	@echo "Installing golang-migrate..."
	@go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

.PHONY: migrate-create
migrate-create:
	@if [ -z "$(name)" ]; then \
		echo "Error: Please specify migration name with name=<name>"; \
		exit 1; \
	fi
	@echo "Creating migration: $(name)"
	@migrate create -ext sql -dir migrations -seq $(name)

.PHONY: migrate-up
migrate-up:
	@echo "Running migrations up..."
	@migrate -path migrations -database "$(DATABASE_URL)" up

.PHONY: migrate-down
migrate-down:
	@echo "Running migrations down..."
	@migrate -path migrations -database "$(DATABASE_URL)" down

.PHONY: migrate-force
migrate-force:
	@if [ -z "$(version)" ]; then \
		echo "Error: Please specify version with version=<version>"; \
		exit 1; \
	fi
	@echo "Forcing migration version to: $(version)"
	@migrate -path migrations -database "$(DATABASE_URL)" force $(version)

.PHONY: migrate-version
migrate-version:
	@echo "Current migration version:"
	@migrate -path migrations -database "$(DATABASE_URL)" version

.PHONY: run
run:
	@go run main.go

.PHONY: build
build:
	@go build -o bin/hatamo main.go

.PHONY: test
test:
	@go test -v ./...

.PHONY: mod
mod:
	@go mod download
	@go mod tidy