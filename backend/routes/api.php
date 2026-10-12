<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\MenuController;

// --- API XÁC THỰC TÀI KHOẢN (Public) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- API XEM DỮ LIỆU CÔNG KHAI (Public - Dành cho khách hàng & shop) ---
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show'])->where('slug', '^(?!trash$).*$');

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show'])->whereNumber('id');
Route::get('/products/{id}/related', [ProductController::class, 'related'])->whereNumber('id');

Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{brand}', [BrandController::class, 'show'])->whereNumber('brand');

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

Route::get('/menus', [MenuController::class, 'index']);

// Đặt hàng & Tra cứu đơn hàng (Khách mua hàng)
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/lookup', [OrderController::class, 'lookup']);
 
// --- API DÀNH CHO USER ĐÃ ĐĂNG NHẬP (auth:sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Giỏ hàng (User)
    Route::apiResource('carts', CartController::class);

    // Lịch sử đơn hàng của User
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
});

// --- API QUẢN TRỊ ADMIN (Thêm, Sửa, Xóa Categories, Products, Brands, Quản lý Orders) ---
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

    // Quản lý Đơn hàng (Orders) - Hỗ trợ cả 2 dạng đường dẫn để tương thích tuyệt đối với Frontend
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::get('/admin/orders/{id}', [OrderController::class, 'show']);
    Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Quản lý Người dùng (Users)
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);

    // Quản lý Bài viết (Posts)
    Route::get('/posts/trash', [PostController::class, 'trash']);
    Route::post('/posts/{id}/restore', [PostController::class, 'restore']);
    Route::delete('/posts/{id}/force-delete', [PostController::class, 'forceDelete']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);

    // Quản lý Menu điều hướng
    Route::get('/menus/trash', [MenuController::class, 'trash']);
    Route::post('/menus/{id}/restore', [MenuController::class, 'restore']);
    Route::delete('/menus/{id}/force-delete', [MenuController::class, 'forceDelete']);
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{id}', [MenuController::class, 'update']);
    Route::delete('/menus/{id}', [MenuController::class, 'destroy']);
});