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
            'image' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'boolean'],
        ]);

        $brand = Brand::create($validated);

        return new BrandResource($brand);
    }

    public function update(Request $request, Brand $brand): BrandResource
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:150',
                Rule::unique('brands', 'slug')->ignore($brand),
            ],
            'image' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'boolean'],
        ]);

        $brand->update($validated);

        return new BrandResource($brand->refresh());
    }

    public function destroy(Brand $brand): Response
    {
        $brand->delete();

        return response()->noContent();
    }
}
