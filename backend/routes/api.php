<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AuthController;

// Các API công khai (Ai cũng xem được danh sách hoặc chi tiết)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Các API xác thực tài khoản
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Nhóm API yêu cầu phải đăng nhập (auth:sanctum) VÀ phải là ADMIN (admin)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});