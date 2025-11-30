#!/bin/sh
set -e

PORT="${PORT:-8000}"

php artisan config:cache >/dev/null 2>&1 || true
php artisan route:cache >/dev/null 2>&1 || true
php artisan view:cache >/dev/null 2>&1 || true

php artisan migrate --force

echo "Starting PHP-FPM..."
exec php-fpm
