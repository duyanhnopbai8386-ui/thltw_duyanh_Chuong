<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // 1. Danh sách đơn hàng (Dành cho Admin)
    public function index()
    {
        $orders = Order::with(['items.product', 'user'])
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách đơn hàng thành công',
            'data' => $orders
        ], 200);
    }

    // 2. Chi tiết một đơn hàng
    public function show($id)
    {
        $order = Order::with(['items.product', 'user'])->find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Chi tiết đơn hàng',
            'data' => $order
        ], 200);
    }

    // 3. Đặt hàng mới (Khách hàng tạo đơn)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string',
            'customer_email' => 'nullable|email|max:255',
            'note' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $totalPrice = 0;
            $orderItemsData = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $itemPrice = $product->sale_price ?? $product->price;
                $lineTotal = $itemPrice * $item['quantity'];
                $totalPrice += $lineTotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $itemPrice,
                    'quantity' => $item['quantity'],
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()?->id,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'] ?? null,
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'note' => $validated['note'] ?? null,
                'total_price' => $totalPrice,
                'status' => 'pending', // Mặc định là Chờ xử lý
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            return response()->json([
                'status' => true,
                'message' => 'Đặt hàng thành công!',
                'data' => $order->load('items.product')
            ], 201);
        });
    }

    // 4. Sửa trạng thái đơn hàng (Dành cho Admin: pending -> shipping/processing -> completed -> cancelled)
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,shipping,processing,completed,cancelled',
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật trạng thái đơn hàng thành công',
            'data' => $order->load(['items.product', 'user'])
        ], 200);
    }

    // 5. Lịch sử đơn hàng của người dùng đang đăng nhập
    public function myOrders(Request $request)
    {
        $userId = $request->user()->id;
        $orders = Order::with('items.product')
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Lịch sử đơn hàng của bạn',
            'data' => $orders
        ], 200);
    }
}