<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index() {
        return response()->json(Page::all());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:pages,slug',
            'content' => 'nullable|string',
            'status' => 'nullable|string'
        ]);
        $page = Page::create($data);
        return response()->json(['message' => 'Thêm trang thành công!', 'data' => $page], 201);
    }

    public function show($slug) {
        $page = Page::where('slug', $slug)->firstOrFail();
        return response()->json($page);
    }

    public function update(Request $request, $id) {
        $page = Page::findOrFail($id);
        $page->update($request->all());
        return response()->json(['message' => 'Cập nhật trang thành công!', 'data' => $page]);
    }

    public function destroy($id) {
        Page::findOrFail($id)->delete();
        return response()->json(['message' => 'Đã xóa trang!']);
    }
}