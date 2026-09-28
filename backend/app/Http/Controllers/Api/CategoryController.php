<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    // Lấy danh sách danh mục
    public function index()
    {
        $categories = Category::active()
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }

    // Lấy chi tiết danh mục theo slug
    public function show(string $slug)
    {
        $category = Category::active()
            ->where('slug', $slug)
            ->with(['children' => function($query) {
                $query->active();
            }])
            ->firstOrFail(); // Tự động trả về lỗi 404 nếu không tìm thấy

        return new CategoryResource($category);
    }
}