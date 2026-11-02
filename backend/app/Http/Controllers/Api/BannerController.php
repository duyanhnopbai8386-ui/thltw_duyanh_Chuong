<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $query = Banner::orderBy('sort_order', 'asc')->latest();
        if ($request->has('position')) {
            $query->where('position', $request->query('position'));
        }
        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }
        return response()->json([
            'status' => true,
            'data' => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable',
            'link' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif (empty($validated['image'])) {
            $validated['image'] = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop';
        }

        $banner = Banner::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Thêm banner thành công!',
            'data' => $banner
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'image' => 'nullable',
            'link' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($banner->image && str_starts_with($banner->image, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $banner->image));
            }
            $path = $request->file('image')->store('banners', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $banner->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật banner thành công!',
            'data' => $banner
        ]);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa banner thành công!'
        ]);
    }
}
