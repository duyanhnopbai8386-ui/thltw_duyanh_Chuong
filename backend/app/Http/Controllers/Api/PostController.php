<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class PostController extends Controller
{
    /**
     * Danh sách bài viết (Public / Admin có phân trang & tìm kiếm)
     */
    public function index(Request $request)
    {
        $limit = $request->query('per_page', $request->query('limit', 10));
        $search = $request->query('search');

        $query = Post::query()->latest();

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        $posts = $query->paginate($limit);

        return PostResource::collection($posts);
    }

    /**
     * Chi tiết bài viết
     */
    public function show($id)
    {
        $post = is_numeric($id) ? Post::findOrFail($id) : Post::where('slug', $id)->firstOrFail();
        $post->increment('views');

        return new PostResource($post);
    }

    /**
     * Thêm bài viết mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:posts,slug'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'summary' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'status' => ['sometimes', 'boolean'],
        ], [
            'title.required' => 'Tiêu đề bài viết không được để trống!',
            'slug.required' => 'Đường dẫn (slug) không được để trống!',
            'slug.unique' => 'Đường dẫn (slug) này đã tồn tại, vui lòng chọn slug khác!',
        ]);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('posts', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        }

        $post = Post::create($validated);

        return new PostResource($post);
    }

    /**
     * Cập nhật bài viết (có ignore ID khi check unique slug)
     */
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('posts', 'slug')->ignore($post->id),
            ],
            'thumbnail' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'summary' => ['sometimes', 'nullable', 'string'],
            'content' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'boolean'],
        ], [
            'title.required' => 'Tiêu đề bài viết không được để trống!',
            'slug.unique' => 'Đường dẫn (slug) này đã tồn tại, vui lòng chọn slug khác!',
        ]);

        if ($request->hasFile('thumbnail')) {
            // Xóa ảnh cũ nếu có
            if ($post->thumbnail && str_starts_with($post->thumbnail, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $post->thumbnail);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('thumbnail')->store('posts', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        }

        $post->update($validated);

        return new PostResource($post);
    }

    /**
     * Chuyển vào thùng rác
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã chuyển bài viết vào thùng rác!'
        ], 200);
    }

    /**
     * Danh sách bài viết trong thùng rác
     */
    public function trash()
    {
        $trashed = Post::onlyTrashed()->latest()->get();

        return PostResource::collection($trashed);
    }

    /**
     * Khôi phục bài viết
     */
    public function restore($id)
    {
        $post = Post::onlyTrashed()->findOrFail($id);
        $post->restore();

        return response()->json([
            'status' => true,
            'message' => 'Đã khôi phục bài viết thành công!',
            'data' => new PostResource($post)
        ], 200);
    }

    /**
     * Xóa vĩnh viễn bài viết
     */
    public function forceDelete($id)
    {
        $post = Post::onlyTrashed()->findOrFail($id);

        if ($post->thumbnail && str_starts_with($post->thumbnail, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $post->thumbnail);
            Storage::disk('public')->delete($oldPath);
        }

        $post->forceDelete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa vĩnh viễn bài viết!'
        ], 200);
    }
}
