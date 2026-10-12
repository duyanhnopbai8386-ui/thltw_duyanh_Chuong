<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Danh sách Menu (Hỗ trợ phân trang, lọc vị trí header/footer)
     */
    public function index(Request $request)
    {
        $limit = $request->query('per_page', $request->query('limit', 10));
        $position = $request->query('position');
        $search = $request->query('search');

        $query = Menu::query()->orderBy('position')->orderBy('sort_order', 'asc')->orderBy('id', 'asc');

        if ($position) {
            $query->where('position', $position);
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('link', 'like', "%{$search}%");
            });
        }

        // Nếu gọi từ Frontend navigation (không cần phân trang)
        if ($request->query('all') === 'true' || $request->query('all') === '1') {
            return MenuResource::collection($query->get());
        }

        $menus = $query->paginate($limit);

        return MenuResource::collection($menus);
    }

    /**
     * Chi tiết 1 Menu
     */
    public function show($id)
    {
        $menu = Menu::with(['parent', 'children'])->findOrFail($id);

        return new MenuResource($menu);
    }

    /**
     * Thêm mới Menu
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'link' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'in:header,footer'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'parent_id' => ['nullable', 'exists:menus,id'],
            'status' => ['sometimes', 'boolean'],
        ], [
            'name.required' => 'Tên menu không được để trống!',
            'link.required' => 'Đường dẫn liên kết không được để trống!',
            'position.required' => 'Vui lòng chọn vị trí hiển thị (Header hoặc Footer)!',
        ]);

        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = 0;
        }

        $menu = Menu::create($validated);

        return new MenuResource($menu);
    }

    /**
     * Cập nhật Menu
     */
    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'link' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'required', 'string', 'in:header,footer'],
            'sort_order' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'parent_id' => ['sometimes', 'nullable', 'exists:menus,id'],
            'status' => ['sometimes', 'boolean'],
        ], [
            'name.required' => 'Tên menu không được để trống!',
            'link.required' => 'Đường dẫn liên kết không được để trống!',
        ]);

        $menu->update($validated);

        return new MenuResource($menu);
    }

    /**
     * Chuyển Menu vào thùng rác
     */
    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã chuyển Menu vào thùng rác!'
        ], 200);
    }

    /**
     * Thùng rác Menu
     */
    public function trash()
    {
        $trashed = Menu::onlyTrashed()->latest()->get();

        return MenuResource::collection($trashed);
    }

    /**
     * Khôi phục Menu
     */
    public function restore($id)
    {
        $menu = Menu::onlyTrashed()->findOrFail($id);
        $menu->restore();

        return response()->json([
            'status' => true,
            'message' => 'Đã khôi phục Menu thành công!',
            'data' => new MenuResource($menu)
        ], 200);
    }

    /**
     * Xóa vĩnh viễn Menu
     */
    public function forceDelete($id)
    {
        $menu = Menu::onlyTrashed()->findOrFail($id);
        $menu->forceDelete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa vĩnh viễn Menu!'
        ], 200);
    }
}
