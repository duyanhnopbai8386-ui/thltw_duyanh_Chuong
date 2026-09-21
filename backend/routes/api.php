<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController; // <-- Thêm dòng này

// Route cho Category (Danh mục)
Route::get('/categories', [CategoryController::class, 'index']);

// Route cho Product (Sản phẩm)
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);