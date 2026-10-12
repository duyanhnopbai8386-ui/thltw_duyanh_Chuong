<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // 1. Xem danh sách đơn hàng
    public function index()
    {
        $orders = Order::with('user', 'orderItems.product')->latest()->get();
        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách đơn hàng thành công',
            'data' => $orders
        ], 200);
    }

    // 2. Xem chi tiết đơn hàng (sản phẩm, số lượng, tiền)
    public function show($id)
    {
        $order = Order::with('user', 'orderItems.product')->find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    // 3. Cập nhật trạng thái đơn hàng (Chờ xử lý -> Đang Giao -> Hoàn Thành -> Hủy)
    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,shipping,completed,cancelled' 
            // Hoặc nếu bạn dùng tiếng Việt trong DB: 'required|in:Chờ xử lý,Đang Giao,Hoàn Thành,Hủy'
        ]);

        $order->status = $validated['status'];
        $order->save();

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật trạng thái đơn hàng thành công',
            'data' => $order
        ], 200);
    }
}