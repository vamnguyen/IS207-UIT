<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;

// ========================== Public routes ==========================
// 1. Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// 2. Category
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// ========================== Protected routes ==========================
Route::middleware('auth:sanctum')->group(function () {
    // Route để đăng xuất
    Route::post('/logout', [AuthController::class, 'logout']);

    // Route để lấy thông tin người dùng hiện tại
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Route để admin quản lý category
    Route::middleware('role:admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });
});
