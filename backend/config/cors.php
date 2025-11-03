<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://rerent-customer.vercel.app', 'https://rerent-shop.vercel.app', 'https://rerent-admin.vercel.app'], // Next.js URL

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => false,

    'max_age' => 0,

    'supports_credentials' => true, // Quan trọng để gửi cookie
];
