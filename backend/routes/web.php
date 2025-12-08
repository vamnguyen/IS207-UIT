<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SocialAuthController; // <--- Quan trọng: Import Controller

Route::get('/', function () {
    return view('welcome');
});

Route::get('auth/{provider}', [SocialAuthController::class, 'redirectToProvider']);
Route::get('auth/{provider}/callback', [SocialAuthController::class, 'handleAuthCallback']);