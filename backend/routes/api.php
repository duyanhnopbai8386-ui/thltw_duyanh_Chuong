<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;

// --- API XÁC THỰC TÀI KHOẢN (Public) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- API XEM DỮ LIỆU CÔNG KHAI (Public - Dành cho khách hàng & shop) ---
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{brand}', [BrandController::class, 'show']);

// Đặt hàng (Khách mua hàng)
Route::post('/orders', [OrderController::class, 'store']);

// --- API DÀNH CHO USER ĐÃ ĐĂNG NHẬP (auth:sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Giỏ hàng (User)
    Route::apiResource('carts', CartController::class);

    // Lịch sử đơn hàng của User
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
});

// --- API QUẢN TRỊ ADMIN (Thêm, Sửa, Xóa Categories, Products, Brands, Quản lý Orders) ---
// Dùng auth:sanctum và admin middleware khi triển khai đầy đủ
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Quản lý Categories
    Route::get('/categories/trash', [CategoryController::class, 'trash']);
    Route::post('/categories/{id}/restore', [CategoryController::class, 'restore']);
    Route::delete('/categories/{id}/force-delete', [CategoryController::class, 'forceDelete']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Quản lý Products
    Route::get('/products/trash', [ProductController::class, 'trash']);
    Route::post('/products/{id}/restore', [ProductController::class, 'restore']);
    Route::delete('/products/{id}/force-delete', [ProductController::class, 'forceDelete']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Quản lý Brands
    Route::get('/brands/trash', [BrandController::class, 'trash']);
    Route::post('/brands/{id}/restore', [BrandController::class, 'restore']);
    Route::delete('/brands/{id}/force-delete', [BrandController::class, 'forceDelete']);
    Route::post('/brands', [BrandController::class, 'store']);
    Route::put('/brands/{brand}', [BrandController::class, 'update']);
    Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);

    // Quản lý Đơn hàng (Orders)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});
