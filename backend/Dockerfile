# 1️⃣ Base image PHP 8.4 + Composer 2.8
FROM php:8.4-cli

# 2️⃣ Set working directory
WORKDIR /var/www/html

# 3️⃣ Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip

# 4️⃣ Copy composer files trước (để tận dụng cache)
COPY composer.json composer.lock ./

# 5️⃣ Cài đặt Composer (bản mới nhất)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 6️⃣ ⚙️ Tối ưu: Cache Composer dependencies
RUN --mount=type=cache,target=/root/.composer \
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# 7️⃣ Copy toàn bộ source code vào container
COPY . .

# 8️⃣ Set quyền cho Laravel storage & cache
RUN chmod -R 775 storage bootstrap/cache

# 9️⃣ Expose port cho Render
EXPOSE 8000

# 🔟 Start Laravel server
CMD php artisan serve --host=0.0.0.0 --port=8000
