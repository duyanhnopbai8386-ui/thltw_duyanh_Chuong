<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Http\Resources\BrandResource;

class BrandController extends Controller
{
    public function index()
    {
        // Lấy danh sách thương hiệu có status = 1
        $brands = Brand::active()->get();

        return BrandResource::collection($brands);
    }
}