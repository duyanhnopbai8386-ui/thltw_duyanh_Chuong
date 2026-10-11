<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;

// Các API xác thực tài khoản (Công khai)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Các API công khai (Ai cũng xem được danh sách hoặc chi tiết)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Nhóm API yêu cầu phải đăng nhập (auth:sanctum) VÀ phải là ADMIN (admin)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Quản lý Categories (Thêm, Sửa, Xóa)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Quản lý Products (Thêm, Sửa, Xóa) nếu cần bảo mật
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});