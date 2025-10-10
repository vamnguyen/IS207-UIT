# syntax=docker/dockerfile:1.4
FROM php:8.4-cli

# 1️⃣ Set working directory
WORKDIR /var/www/html

# 2️⃣ Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip bcmath

# 3️⃣ Cài Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 4️⃣ Copy toàn bộ source code trước để artisan có sẵn
COPY . .

# 5️⃣ Cho phép Composer chạy với quyền root (Render chạy root)
ENV COMPOSER_ALLOW_SUPERUSER=1

# 6️⃣ Cache Composer dependencies
RUN --mount=type=cache,target=/root/.composer \
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# 7️⃣ Set quyền cho storage & cache
RUN chmod -R 775 storage bootstrap/cache

# 8️⃣ Expose port
EXPOSE 8000

# 9️⃣ Start Laravel server
CMD php artisan serve --host=0.0.0.0 --port=8000
