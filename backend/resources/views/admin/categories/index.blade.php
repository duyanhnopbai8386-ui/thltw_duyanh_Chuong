@extends('layouts.admin')

@section('content')
<div class="container mx-auto">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-700">Quản lý Danh mục</h2>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">+ Thêm danh mục</button>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên danh mục</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                    <td class="px-6 py-4 text-sm text-gray-500">1</td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">Điện thoại thông minh</td>
                    <td class="px-6 py-4 text-sm text-gray-500">dien-thoai-thong-minh</td>
                    <td class="px-6 py-4"><span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Hiển thị</span></td>
                    <td class="px-6 py-4 text-right text-sm font-medium">
                        <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-3">Sửa</a>
                        <a href="#" class="text-red-600 hover:text-red-900">Xóa</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
@endsection