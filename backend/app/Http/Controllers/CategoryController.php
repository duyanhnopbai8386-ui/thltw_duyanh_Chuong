<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // 1. LẤY DANH SÁCH DANH MỤC CÓ PHÂN TRANG (GET /api/categories)
    public function index(Request $request)
    {
        // lấy số lượng sản phẩm dùng limit cắt lấy đúng 5 sản phẩm
        $limit = $request->query('limit', 5);

        // try vấn thông qua model category , lấy danh mục có cột status = 1, săp xếp mới nhất
        // trước, lấy dữ liệu của trang được yêu cầu với mỗi trang là limit
        $categories = Category::where('status', 1)->latest()->paginate($limit);

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách danh mục thành công',
            'data' => CategoryResource::collection($categories),
            'pagination' => [
                'total' => $categories->total(),
                'per_page' => $categories->perPage(),
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
            ]
        ], 200);
    }

    // 2. THÊM MỚI DANH MỤC (POST /api/categories)
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
            'parent_id' => 'nullable|integer',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|string',
            'status' => 'nullable|integer'
        ]);

        $category = Category::create($fields);

        return response()->json([
            'status' => true,
            'message' => 'Thêm danh mục thành công',
            'data' => new CategoryResource($category)
        ], 201);
    }

    // 3. XEM CHI TIẾT 1 DANH MỤC (GET /api/categories/{id})
    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => new CategoryResource($category)
        ], 200);
    }

    // 4. CẬP NHẬT/SỬA DANH MỤC (PUT /api/categories/{id})
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $fields = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:categories,slug,' . $id,
            'parent_id' => 'nullable|integer',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|string',
            'status' => 'nullable|integer'
        ]);

        $category->update($fields);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật danh mục thành công',
            'data' => new CategoryResource($category)
        ], 200);
    }

    // 5. XÓA DANH MỤC (DELETE /api/categories/{id})
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa danh mục thành công'
        ], 200);
    }
}
