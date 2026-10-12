<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $products = Product::with(['brand', 'category'])
            ->latest()
            ->get(); // e lấy tất cả sp nếu theo slice thì paginate(12);

        return ProductResource::collection($products);
    }

    public function show($id): ProductResource
    {
        $product = Product::with(['brand', 'category'])->findOrFail($id);

        return new ProductResource($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_id' => ['nullable', 'exists:brands,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'], // Đổi thành file ảnh
            'price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string'],
        ]);

        // Xử lý upload ảnh
        if ($request->hasFile('image')) { // xem có phải file guiwrleen không
            $path = $request->file('image')->store('products', 'public'); // lệnh store sẽ tự động tải vật lý đó vào máy chủ 
            // rồi gọi create
            $validated['image'] = '/storage/' . $path;
        }

        $product = Product::create($validated);
        $product->load(['brand', 'category']);

        return new ProductResource($product);
    }

    public function update(Request $request, $id): ProductResource
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'brand_id' => ['sometimes', 'nullable', 'exists:brands,id'],
            'category_id' => ['sometimes', 'nullable', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', \Illuminate\Validation\Rule::unique('products')->ignore($product->id)],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'], // Đổi thành file ảnh
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'sale_price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'status' => ['sometimes', 'nullable', 'boolean'],
            'description' => ['sometimes', 'nullable', 'string'],
        ]);

        // Xử lý upload ảnh khi sửa
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $product->update($validated);
        $product->load(['brand', 'category']);

        return new ProductResource($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã chuyển sản phẩm vào thùng rác'
        ], 200);
    }

    // Danh sách trong thùng rác
    public function trash(): AnonymousResourceCollection
    {
        $products = Product::onlyTrashed()
            ->with(['brand', 'category'])
            ->latest()
            ->get();

        return ProductResource::collection($products);
    }

    // Khôi phục từ thùng rác
    public function restore($id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();

        return response()->json([
            'status' => true,
            'message' => 'Đã khôi phục sản phẩm thành công',
            'data' => new ProductResource($product->load(['brand', 'category']))
        ], 200);
    }

    // Xóa vĩnh viễn khỏi CSDL
    public function forceDelete($id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->forceDelete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa vĩnh viễn sản phẩm khỏi hệ thống'
        ], 200);
    }
}
