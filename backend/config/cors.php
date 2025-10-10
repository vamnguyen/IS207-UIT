<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:3000', 'https://rerent-three.vercel.app'], // Next.js URL

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => false,

    'max_age' => 0,

    'supports_credentials' => true, // Quan trọng để gửi cookie
];
