<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\AdminDashboardController;

// ========================== Public routes ==========================
// 1. Auth & User
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// 2. Category
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/categories/{category}/products', [ProductController::class, 'getByCategoryId']);
// 3. Product
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
// 4. Comment
Route::get('/comments', [CommentController::class, 'index']);
// 5. Payment
Route::post('/stripe/webhook', [PaymentController::class, 'webhook']);


// ========================== Protected routes ==========================
Route::middleware('auth:sanctum')->group(function () {
    // 1. Auth & User
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // 3. Category
    Route::middleware('role:admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });

    // 4. Product
    Route::middleware('role:shop,admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::get('/shops/{shop}/products', [ProductController::class, 'getByShopId']);
    });

    // 5. Comment
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // 6. Upload files
    Route::post('/uploads', [UploadController::class, 'upload']);

    // 7. Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{itemId}', [CartController::class, 'update']);
    Route::delete('/cart/{itemId}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // 8. Payment
    Route::post('/checkout/card', [PaymentController::class, 'checkoutCard']);
    Route::post('/checkout/cash', [PaymentController::class, 'checkoutCash']);

    // 9. Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // 10. Admin dashboard
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);

        Route::get('/admin/users', [\App\Http\Controllers\Api\AdminUserController::class, 'index']);
        Route::put('/admin/users/{id}/role', [\App\Http\Controllers\Api\AdminUserController::class, 'updateRole']);
        Route::delete('/admin/users/{id}', [\App\Http\Controllers\Api\AdminUserController::class, 'destroy']);
    });
});
