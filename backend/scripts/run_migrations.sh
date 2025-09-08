#!/bin/bash

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
for i in {1..30}; do
    if mysql -h"${DB_HOST:-localhost}" -P"${DB_PORT:-3306}" -u"${DB_USER:-root}" -p"${DB_PASSWORD:-rootpassword}" -e "SELECT 1" >/dev/null 2>&1; then
        echo "MySQL is ready!"
        break
    fi
    echo "Waiting for MySQL... (attempt $i/30)"
    sleep 2
done

# Run migrations
echo "Running database migrations..."
cd /app
go run cmd/migrate/main.go -command=up

if [ $? -eq 0 ]; then
    echo "Migrations completed successfully!"
else
    echo "Migration failed!"
    exit 1
fi