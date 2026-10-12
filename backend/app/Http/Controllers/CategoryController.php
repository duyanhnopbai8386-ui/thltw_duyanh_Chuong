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
        if (!$request->filled('slug') && $request->filled('name')) {
            $request->merge(['slug' => \Illuminate\Support\Str::slug($request->name)]);
        }

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

        if (!$request->filled('slug') && $request->filled('name')) {
            $request->merge(['slug' => \Illuminate\Support\Str::slug($request->name)]);
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

        // RÀNG BUỘC TOÀN VẸN: Không cho xóa nếu danh mục đang chứa sản phẩm
        $productCount = $category->products()->count();
        if ($productCount > 0) {
            return response()->json([
                'status' => false,
                'message' => "Không thể xóa danh mục này vì đang có {$productCount} sản phẩm trực thuộc. Vui lòng xóa hoặc chuyển sản phẩm trước!"
            ], 422);
        }

        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã chuyển danh mục vào thùng rác'
        ], 200);
    }

    // Danh sách thùng rác
    public function trash()
    {
        $categories = Category::onlyTrashed()->latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thùng rác thành công',
            'data' => CategoryResource::collection($categories)
        ], 200);
    }

    // Khôi phục từ thùng rác
    public function restore($id)
    {
        $category = Category::onlyTrashed()->find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục trong thùng rác'
            ], 404);
        }

        $category->restore();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục danh mục thành công',
            'data' => new CategoryResource($category)
        ], 200);
    }

    // Xóa vĩnh viễn
    public function forceDelete($id)
    {
        $category = Category::onlyTrashed()->find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy danh mục trong thùng rác'
            ], 404);
        }

        // RÀNG BUỘC: Không cho xóa vĩnh viễn nếu còn sản phẩm trong CSDL
        $productCount = $category->products()->withTrashed()->count();
        if ($productCount > 0) {
            return response()->json([
                'status' => false,
                'message' => "Không thể xóa vĩnh viễn! Danh mục này đang gắn với {$productCount} sản phẩm trong hệ thống."
            ], 422);
        }

        $category->forceDelete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa vĩnh viễn danh mục khỏi hệ thống'
        ], 200);
    }
}
