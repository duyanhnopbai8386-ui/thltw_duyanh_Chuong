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
    public function index(Request $request): AnonymousResourceCollection
    {
        $limit = $request->query('per_page', $request->query('limit', 10));
        $query = Product::with(['brand', 'category']);

        // 1. Tìm kiếm theo tên hoặc mô tả
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 2. Lọc theo Danh mục
        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // 3. Lọc theo Thương hiệu
        if ($brandId = $request->query('brand_id')) {
            $query->where('brand_id', $brandId);
        }

        // 4. Lọc theo Khoảng giá
        if ($request->filled('min_price')) {
            $minPrice = (float) $request->query('min_price');
            $query->where(function ($q) use ($minPrice) {
                $q->where('price', '>=', $minPrice)
                  ->orWhere('sale_price', '>=', $minPrice);
            });
        }
        if ($request->filled('max_price')) {
            $maxPrice = (float) $request->query('max_price');
            $query->where(function ($q) use ($maxPrice) {
                $q->where('price', '<=', $maxPrice)
                  ->orWhere('sale_price', '<=', $maxPrice);
            });
        }

        // 5. Lọc theo Phân loại trang chủ (type: new, sale, hot, featured)
        $type = $request->query('type');
        if ($type === 'sale') {
            $query->whereNotNull('sale_price')
                  ->where('sale_price', '>', 0)
                  ->whereColumn('sale_price', '<', 'price');
        } elseif ($type === 'hot') {
            // Hot: ưu tiên sản phẩm có trạng thái bật và số lượng kho lớn hoặc bán chạy
            $query->where('status', 1)->orderBy('stock', 'desc');
        } elseif ($type === 'featured') {
            // Nổi bật: các sản phẩm được chọn lọc
            $query->where('status', 1)->orderBy('id', 'asc');
        }

        // 6. Sắp xếp (sort)
        $sort = $request->query('sort');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'sale':
                $query->whereNotNull('sale_price')->where('sale_price', '>', 0)->orderBy('sale_price', 'asc');
                break;
            case 'newest':
            default:
                if ($type !== 'hot' && $type !== 'featured') {
                    $query->latest();
                }
                break;
        }

        $products = $query->paginate($limit);

        return ProductResource::collection($products);
    }

    public function show($id): ProductResource
    {
        $product = Product::with(['brand', 'category'])->findOrFail($id);

        return new ProductResource($product);
    }

    public function related($id): AnonymousResourceCollection
    {
        $product = Product::findOrFail($id);
        $related = Product::with(['brand', 'category'])
            ->where('id', '!=', $id)
            ->where(function ($q) use ($product) {
                if ($product->category_id) {
                    $q->where('category_id', $product->category_id);
                }
                if ($product->brand_id) {
                    $q->orWhere('brand_id', $product->brand_id);
                }
            })
            ->latest()
            ->take(4)
            ->get();

        // Nếu không có cùng danh mục/thương hiệu, lấy 4 sản phẩm bất kỳ khác
        if ($related->isEmpty()) {
            $related = Product::with(['brand', 'category'])
                ->where('id', '!=', $id)
                ->latest()
                ->take(4)
                ->get();
        }

        return ProductResource::collection($related);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_id' => ['nullable', 'exists:brands,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255', 'unique:products,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string'],
        ], [
            'name.unique' => 'Tên sản phẩm này đã tồn tại, vui lòng chọn tên khác!',
            'slug.unique' => 'Đường dẫn (slug) sản phẩm đã tồn tại, vui lòng chọn slug khác!',
            'sale_price.lt' => 'Giá khuyến mãi phải nhỏ hơn giá bán gốc của sản phẩm!',
        ]);

        // Xử lý upload ảnh
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $product = Product::create($validated);
        $product->load(['brand', 'category']);

        return new ProductResource($product);
    }

    public function update(Request $request, $id): ProductResource
    {
        $product = Product::findOrFail($id);
        $targetPrice = $request->has('price') ? $request->price : $product->price;

        $validated = $request->validate([
            'brand_id' => ['sometimes', 'nullable', 'exists:brands,id'],
            'category_id' => ['sometimes', 'nullable', 'exists:categories,id'],
            'name' => [
                'sometimes', 
                'required', 
                'string', 
                'max:255', 
                \Illuminate\Validation\Rule::unique('products', 'name')->ignore($product->id)
            ],
            'slug' => [
                'sometimes', 
                'nullable', 
                'string', 
                'max:255', 
                \Illuminate\Validation\Rule::unique('products', 'slug')->ignore($product->id)
            ],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'sale_price' => ['sometimes', 'nullable', 'numeric', 'min:0', 'lt:' . $targetPrice],
            'stock' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'status' => ['sometimes', 'nullable', 'boolean'],
            'description' => ['sometimes', 'nullable', 'string'],
        ], [
            'name.unique' => 'Tên sản phẩm này đã tồn tại, vui lòng chọn tên khác!',
            'slug.unique' => 'Đường dẫn (slug) sản phẩm đã tồn tại, vui lòng chọn slug khác!',
            'sale_price.lt' => 'Giá khuyến mãi phải nhỏ hơn giá bán gốc của sản phẩm!',
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
        $products = Product::onlyTrashed() // xem thùng rác
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
