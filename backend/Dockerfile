# syntax=docker/dockerfile:1.4
FROM php:8.4-fpm

# 1️⃣ Set working directory
WORKDIR /var/www/html

# 2️⃣ Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    nginx \
    && docker-php-ext-install pdo pdo_mysql zip bcmath \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /etc/nginx/sites-enabled/default

# 3️⃣ Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 4️⃣ Copy toàn bộ source code trước để artisan có sẵn
COPY . .

# 5️⃣ Cho phép Composer chạy với quyền root (Render chạy bằng root)
ENV COMPOSER_ALLOW_SUPERUSER=1

# 6️⃣ Cache Composer dependencies
RUN --mount=type=cache,target=/root/.composer \
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# 7️⃣ Set quyền cho storage & cache
RUN chmod -R 775 storage bootstrap/cache

# 8️⃣ Thiết lập biến môi trường PORT (Render sẽ override)
ENV PORT=80

# 9️⃣ Expose port (chỉ để tham khảo, Render tự map cổng thật)
EXPOSE 80

# Copy Nginx config
COPY nginx/conf.d/app.conf /etc/nginx/conf.d/default.conf

# 🔟 Set entrypoint to run migrations rồi khởi động server
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
