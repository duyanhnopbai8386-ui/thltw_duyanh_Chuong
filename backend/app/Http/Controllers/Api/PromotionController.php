<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::latest()->get();
        return response()->json([
            'status' => true,
            'data' => $promotions
        ]);
    }

    /**
     * Khách hàng áp dụng mã giảm giá ở giỏ hàng (Check voucher)
     */
    public function check(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'order_total' => 'required|numeric|min:0',
        ]);

        $code = strtoupper(trim($request->input('code')));
        $orderTotal = (float) $request->input('order_total');

        $promo = Promotion::where('code', $code)->where('status', 1)->first();

        if (!$promo) {
            return response()->json([
                'status' => false,
                'message' => 'Mã khuyến mãi không tồn tại hoặc đã hết hạn sử dụng!'
            ], 404);
        }

        // Kiểm tra hạn sử dụng
        $today = now()->startOfDay();
        if ($promo->start_date && $today->lt($promo->start_date)) {
            return response()->json([
                'status' => false,
                'message' => 'Chương trình khuyến mãi này chưa bắt đầu!'
            ], 400);
        }
        if ($promo->end_date && $today->gt($promo->end_date)) {
            return response()->json([
                'status' => false,
                'message' => 'Mã khuyến mãi này đã hết hạn áp dụng!'
            ], 400);
        }

        // Kiểm tra đơn hàng tối thiểu
        if ($promo->min_order_value > 0 && $orderTotal < $promo->min_order_value) {
            return response()->json([
                'status' => false,
                'message' => 'Đơn hàng tối thiểu ' . number_format($promo->min_order_value, 0, ',', '.') . ' đ mới đủ điều kiện áp dụng mã này!'
            ], 400);
        }

        // Tính số tiền giảm giá
        $discount = 0;
        if ($promo->discount_amount > 0) {
            $discount = (float) $promo->discount_amount;
        } elseif ($promo->discount_percent > 0) {
            $discount = round(($orderTotal * $promo->discount_percent) / 100);
        }

        if ($discount > $orderTotal) {
            $discount = $orderTotal;
        }

        return response()->json([
            'status' => true,
            'message' => 'Áp dụng mã giảm giá thành công!',
            'data' => [
                'code' => $promo->code,
                'name' => $promo->name,
                'discount' => $discount,
                'final_total' => max(0, $orderTotal - $discount),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:promotions,code',
            'name' => 'required|string|max:255',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|between:0,100',
            'min_order_value' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'usage_limit' => 'nullable|integer|min:1',
            'status' => 'nullable|boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        $promo = Promotion::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Tạo mã khuyến mãi thành công!',
            'data' => $promo
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $promo = Promotion::findOrFail($id);
        $validated = $request->validate([
            'code' => 'sometimes|required|string|max:50|unique:promotions,code,' . $id,
            'name' => 'sometimes|required|string|max:255',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|between:0,100',
            'min_order_value' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'usage_limit' => 'nullable|integer|min:1',
            'status' => 'nullable|boolean',
        ]);

        if (isset($validated['code'])) {
            $validated['code'] = strtoupper($validated['code']);
        }
        $promo->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật khuyến mãi thành công!',
            'data' => $promo
        ]);
    }

    public function destroy($id)
    {
        $promo = Promotion::findOrFail($id);
        $promo->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đã xóa mã khuyến mãi!'
        ]);
    }
}
