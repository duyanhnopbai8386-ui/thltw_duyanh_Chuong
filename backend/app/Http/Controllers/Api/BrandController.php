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
            ->latest()
            ->get();

        return BrandResource::collection($brands);
    }

    public function store(Request $request): BrandResource
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['required', 'string', 'max:150', 'unique:brands,slug'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'], // Nhận file ảnh
            'status' => ['sometimes', 'boolean'],
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
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:150',
                Rule::unique('brands', 'slug')->ignore($brandModel),
            ],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'], // Nhận file ảnh
            'status' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('brands', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $brandModel->update($validated);

        return new BrandResource($brandModel->refresh());
    }

    public function destroy($brand)
    {
        $brandModel = $brand instanceof Brand ? $brand : Brand::findOrFail($brand);
        $brandModel->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa thương hiệu thành công'
        ], 200);
    }
}
