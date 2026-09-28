<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * 1. LẤY DANH SÁCH CÓ PHÂN TRANG (READ ALL WITH PAGINATION)
     * Request mẫu: GET /api/categories?per_page=10&page=1
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10); // Mặc định 10 item/trang

        $categories = Category::latest('id')->paginate($perPage);

        return response()->json([
            'status' => true,
            'data'   => $categories
        ], 200);
    }

    /**
     * 2. LẤY CHI TIẾT 1 DANH MỤC THEO SLUG HOẶC ID (READ ONE)
     */
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data'   => $category
        ], 200);
    }

    /**
     * 3. THÊM DANH MỤC MỚI (CREATE)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'slug'       => 'required|string|max:255|unique:categories,slug',
            'parent_id'  => 'nullable|integer',
            'sort_order' => 'nullable|integer',
            'status'     => 'nullable|integer',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'status'  => true,
            'message' => 'Thêm danh mục thành công',
            'data'    => $category
        ], 201);
    }

    /**
     * 4. CẬP NHẬT DANH MỤC (UPDATE)
     */
    public function update(Request $request, string $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $validated = $request->validate([
            'name'       => 'sometimes|required|string|max:255',
            'slug'       => 'sometimes|required|string|max:255|unique:categories,slug,' . $id,
            'parent_id'  => 'nullable|integer',
            'sort_order' => 'nullable|integer',
            'status'     => 'nullable|integer',
        ]);

        $category->update($validated);

        return response()->json([
            'status'  => true,
            'message' => 'Cập nhật danh mục thành công',
            'data'    => $category
        ], 200);
    }

    /**
     * 5. XÓA DANH MỤC (DELETE)
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Xóa danh mục thành công'
        ], 200);
    }
}