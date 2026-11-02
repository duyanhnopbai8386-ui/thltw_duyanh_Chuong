<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Lấy danh sách đánh giá của 1 sản phẩm kèm thống kê
     */
    public function index($productId)
    {
        $product = Product::findOrFail($productId);

        $reviews = Review::where('product_id', $productId)
            ->where('status', 1)
            ->latest()
            ->get();

        $total = $reviews->count();
        $avg = $total > 0 ? round($reviews->avg('rating'), 1) : 0;

        $starCounts = [
            5 => $reviews->where('rating', 5)->count(),
            4 => $reviews->where('rating', 4)->count(),
            3 => $reviews->where('rating', 3)->count(),
            2 => $reviews->where('rating', 2)->count(),
            1 => $reviews->where('rating', 1)->count(),
        ];

        return response()->json([
            'status' => true,
            'data' => $reviews,
            'stats' => [
                'total_reviews' => $total,
                'average_rating' => $avg,
                'star_counts' => $starCounts,
            ]
        ], 200);
    }

    /**
     * Gửi đánh giá mới cho sản phẩm
     */
    public function store(Request $request, $productId)
    {
        $product = Product::findOrFail($productId);

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['required', 'string', 'min:3', 'max:1000'],
            'user_name' => ['required', 'string', 'max:100'],
            'user_email' => ['nullable', 'email', 'max:100'],
        ], [
            'rating.required' => 'Vui lòng chọn số sao đánh giá!',
            'rating.between' => 'Số sao phải từ 1 đến 5 sao!',
            'comment.required' => 'Vui lòng nhập nội dung đánh giá!',
            'comment.min' => 'Nội dung đánh giá phải có ít nhất 3 ký tự!',
            'user_name.required' => 'Vui lòng nhập họ và tên của bạn!',
        ]);

        $userId = $request->user()?->id;

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => $userId,
            'user_name' => $validated['user_name'],
            'user_email' => $validated['user_email'] ?? null,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'status' => 1, // Mặc định hiển thị
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Cảm ơn bạn đã gửi đánh giá sản phẩm!',
            'data' => $review
        ], 201);
    }

    /**
     * Dành cho Admin: Quản lý danh sách review
     */
    public function adminIndex(Request $request)
    {
        $query = Review::with('product')->latest();

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->query('product_id'));
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->query('rating'));
        }

        if ($request->has('status') && $request->query('status') !== '') {
            $query->where('status', $request->query('status'));
        }

        $limit = $request->query('per_page', 15);
        $reviews = $query->paginate($limit);

        return response()->json([
            'status' => true,
            'data' => $reviews->items(),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ]
        ], 200);
    }

    /**
     * Dành cho Admin: Ẩn / Hiện review
     */
    public function toggleStatus($id)
    {
        $review = Review::findOrFail($id);
        $review->status = !$review->status;
        $review->save();

        return response()->json([
            'status' => true,
            'message' => $review->status ? 'Đã hiển thị đánh giá!' : 'Đã ẩn đánh giá!',
            'data' => $review
        ], 200);
    }

    /**
     * Dành cho Admin: Xóa review
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa đánh giá thành công!'
        ], 200);
    }
}
