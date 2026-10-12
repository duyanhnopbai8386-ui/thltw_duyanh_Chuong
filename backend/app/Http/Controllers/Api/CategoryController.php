<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    // Dành cho Admin lấy toàn bộ danh sách (không bị lọc ẩn hay phân cấp)
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->has('limit')) {
            $categories = $query->orderBy('id', 'desc')->paginate($request->input('limit', 100));
            return CategoryResource::collection($categories);
        }

        $categories = $query->orderBy('id', 'desc')->get();
        return CategoryResource::collection($categories);
    }

    // Dành cho trang Client (hiển thị menu đa cấp)
    public function getActiveCategories()
    {
        $categories = Category::active()
            ->whereNull('parent_id')
            ->with(['children' => function($query) {
                $query->active();
            }])
            ->orderBy('sort_order', 'asc')
            ->get();

        return CategoryResource::collection($categories);
    }

    // Thêm mới danh mục
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
            'description' => 'nullable|string',
            'status' => 'required|integer',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Thêm danh mục mới thành công!',
            'data' => new CategoryResource($category)
        ], 201);
    }

    // Cập nhật danh mục
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'status' => 'required|integer',
        ]);

        $category->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật danh mục thành công!',
            'data' => new CategoryResource($category)
        ]);
    }

    // Xóa mềm (Chuyển vào thùng rác)
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã chuyển danh mục vào thùng rác!'
        ]);
    }

    // Lấy danh sách trong thùng rác
    public function trash()
    {
        $categories = Category::onlyTrashed()->orderBy('deleted_at', 'desc')->get();
        return CategoryResource::collection($categories);
    }

    // Khôi phục từ thùng rác
    public function restore($id)
    {
        $category = Category::onlyTrashed()->findOrFail($id);
        $category->restore();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục danh mục thành công!'
        ]);
    }

    // Xóa vĩnh viễn
    public function forceDelete($id)
    {
        $category = Category::onlyTrashed()->findOrFail($id);
        $category->forceDelete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa vĩnh viễn danh mục khỏi hệ thống!'
        ]);
    }
}