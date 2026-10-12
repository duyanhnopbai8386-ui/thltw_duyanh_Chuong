<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class BrandController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $brands = Brand::query()
            ->withCount('products') // Đếm số lượng sản phẩm của thương hiệu
            ->latest()
            ->get();

        return BrandResource::collection($brands);
    }

    public function show($brand): BrandResource
    {
        $brandModel = $brand instanceof Brand ? $brand : Brand::findOrFail($brand);

        return new BrandResource($brandModel->loadCount('products'));
    }

    public function store(Request $request): BrandResource
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150', 'unique:brands,name'],
            'slug' => ['required', 'string', 'max:150', 'unique:brands,slug'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'status' => ['sometimes', 'boolean'],
        ], [
            'name.unique' => 'Tên thương hiệu đã tồn tại, vui lòng chọn tên khác!',
            'slug.unique' => 'Đường dẫn (slug) thương hiệu đã tồn tại, vui lòng chọn slug khác!',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('brands', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $brand = Brand::create($validated);

        return new BrandResource($brand);
    }

    public function update(Request $request, $brand): BrandResource
    {
        $brandModel = $brand instanceof Brand ? $brand : Brand::findOrFail($brand);

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:150',
                Rule::unique('brands', 'name')->ignore($brandModel->id),
            ],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:150',
                Rule::unique('brands', 'slug')->ignore($brandModel->id),
            ],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'status' => ['sometimes', 'boolean'],
        ], [
            'name.unique' => 'Tên thương hiệu đã tồn tại, vui lòng chọn tên khác!',
            'slug.unique' => 'Đường dẫn (slug) thương hiệu đã tồn tại, vui lòng chọn slug khác!',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('brands', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $brandModel->update($validated);

        return new BrandResource($brandModel->refresh()->loadCount('products'));
    }

    public function destroy($brand)
    {
        $brandModel = $brand instanceof Brand ? $brand : Brand::findOrFail($brand);

        // RÀNG BUỘC TOÀN VẸN: Kiểm tra xem thương hiệu có sản phẩm trực thuộc hay không
        $productCount = $brandModel->products()->count();
        if ($productCount > 0) {
            return response()->json([
                'status' => false,
                'message' => "Không thể xóa thương hiệu này vì đang có {$productCount} sản phẩm trực thuộc. Vui lòng xóa hoặc chuyển sản phẩm sang thương hiệu khác trước!"
            ], 422);
        }

        $brandModel->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã chuyển thương hiệu vào thùng rác'
        ], 200);
    }

    // Danh sách thùng rác
    public function trash(): AnonymousResourceCollection
    {
        $brands = Brand::onlyTrashed()
            ->withCount('products')
            ->latest()
            ->get();

        return BrandResource::collection($brands);
    }

    // Khôi phục từ thùng rác
    public function restore($id)
    {
        $brand = Brand::onlyTrashed()->findOrFail($id);
        $brand->restore();

        return response()->json([
            'status' => true,
            'message' => 'Đã khôi phục thương hiệu thành công',
            'data' => new BrandResource($brand->loadCount('products'))
        ], 200);
    }

    // Xóa vĩnh viễn khỏi CSDL
    public function forceDelete($id)
    {
        $brand = Brand::onlyTrashed()->findOrFail($id);

        // RÀNG BUỘC: Không cho xóa vĩnh viễn nếu còn sản phẩm trong CSDL
        $productCount = $brand->products()->withTrashed()->count();
        if ($productCount > 0) {
            return response()->json([
                'status' => false,
                'message' => "Không thể xóa vĩnh viễn! Thương hiệu này đang gắn với {$productCount} sản phẩm trong hệ thống."
            ], 422);
        }

        $brand->forceDelete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa vĩnh viễn thương hiệu khỏi hệ thống'
        ], 200);
    }
}
