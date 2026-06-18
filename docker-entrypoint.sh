#!/bin/sh
set -e

echo "Waiting for database to be ready..."
while ! pg_isready -h db -p 5432 -U postgres; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is up - executing schema"
psql -h db -U postgres -d gestion_medecin -f /app/server/schema.sql || true

echo "Starting Node.js application..."
exec "$@"
