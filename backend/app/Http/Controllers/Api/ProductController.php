<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index()
    {
        // Phân trang 10 sản phẩm / trang
        $products = Product::active()->latest()->paginate(10);

        return ProductResource::collection($products);
    }
}