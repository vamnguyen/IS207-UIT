#!/bin/sh
set -e

PORT="${PORT:-8000}"

php artisan config:cache >/dev/null 2>&1 || true
php artisan route:cache >/dev/null 2>&1 || true
php artisan view:cache >/dev/null 2>&1 || true

php artisan migrate --force

echo "Starting Laravel on port ${PORT}"
exec php artisan serve --host=0.0.0.0 --port="${PORT}"
