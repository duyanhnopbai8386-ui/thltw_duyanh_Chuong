@extends('layouts.admin')

@section('content')
<div class="container mx-auto">
    <h2 class="text-2xl font-bold text-gray-700 mb-6">Trang Tổng Quan</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 class="text-gray-500 text-sm font-semibold">Tổng số danh mục</h3>
            <p class="text-3xl font-bold text-gray-800 mt-2">5</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 class="text-gray-500 text-sm font-semibold">Tổng sản phẩm</h3>
            <p class="text-3xl font-bold text-gray-800 mt-2">24</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 class="text-gray-500 text-sm font-semibold">Đơn hàng mới</h3>
            <p class="text-3xl font-bold text-gray-800 mt-2">3</p>
        </div>
    </div>
</div>
@endsection