<?php

use Illuminate\Support\Facades\Route;

Route::get('/admin/dashboard', function () {
    return view('admin.dashboard');
});

Route::get('/admin/categories', function () {
    return view('admin.categories.index');
});

Route::get('/admin/products', function () {
    return view('admin.dashboard'); // Thay thế bằng view sản phẩm khi bạn tạo xong
});

Route::get('/admin/orders', function () {
    return view('admin.dashboard'); // Thay thế bằng view đơn hàng khi bạn tạo xong
});