<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (yêu cầu xác thực)
Route::middleware('auth:sanctum')->group(function () {
    // Route để đăng xuất
    Route::post('/logout', [AuthController::class, 'logout']);

    // Route để lấy thông tin người dùng hiện tại
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Route để quản lý category
    Route::apiResource('categories', CategoryController::class);
});
