<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Mail\OrderConfirmationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

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
            'payment_method' => 'nullable|string|in:cod,bank_transfer,momo',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ], [
            'customer_name.required' => 'Vui lòng nhập tên người nhận.',
            'customer_phone.required' => 'Vui lòng nhập số điện thoại.',
            'customer_address.required' => 'Vui lòng nhập địa chỉ nhận hàng.',
            'items.required' => 'Giỏ hàng của bạn đang trống.',
            'items.*.product_id.exists' => 'Sản phẩm trong giỏ hàng không tồn tại hoặc đã bị xóa.',
        ]);

        $order = DB::transaction(function () use ($request, $validated) {
            $totalPrice = 0;
            $orderItemsData = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Kiểm tra tồn kho
                if ($product->stock !== null && $product->stock < $item['quantity']) {
                    throw new \Exception("Sản phẩm \"{$product->name}\" chỉ còn {$product->stock} sản phẩm trong kho, không đủ số lượng bạn yêu cầu!");
                }

                $itemPrice = $product->sale_price ?? $product->price;
                $lineTotal = $itemPrice * $item['quantity'];
                $totalPrice += $lineTotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $itemPrice,
                    'quantity' => $item['quantity'],
                ];

                // Trừ số lượng tồn kho tự động
                if ($product->stock !== null) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            $userId = auth('sanctum')->id() ?? $request->user()?->id;
            $paymentMethod = $validated['payment_method'] ?? 'cod';

            $order = Order::create([
                'user_id' => $userId,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'] ?? null,
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'note' => $validated['note'] ?? null,
                'total_price' => $totalPrice,
                'status' => 'pending', // Mặc định là Chờ xử lý
                'payment_method' => $paymentMethod,
                'payment_status' => 'unpaid',
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            return $order;
        });

        // Gửi email xác nhận đơn hàng nếu khách có cung cấp email
        if (!empty($order->customer_email)) {
            try {
                Mail::to($order->customer_email)->send(new OrderConfirmationMail($order));
                Log::info("Đã gửi email xác nhận đơn hàng #{$order->id} tới email: {$order->customer_email}");
            } catch (\Throwable $e) {
                Log::error("Lỗi khi gửi email đơn hàng #{$order->id}: " . $e->getMessage());
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Đặt hàng thành công!',
            'data' => $order->load('items.product')
        ], 201);
    }

    // 4. Sửa trạng thái đơn hàng (Dành cho Admin: pending -> shipping/processing -> completed -> cancelled)
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,shipping,processing,completed,cancelled',
        ]);

        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        // Nếu chuyển sang hủy và trước đó chưa hủy -> hoàn lại tồn kho
        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            foreach ($order->items as $item) {
                Product::where('id', $item->product_id)->increment('stock', $item->quantity);
            }
        }

        $order->update(['status' => $newStatus]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật trạng thái đơn hàng thành công',
            'data' => $order->load(['items.product', 'user'])
        ], 200);
    }

    // 4.1. Hủy đơn hàng dành cho Khách hàng / Thành viên (Khi đơn đang ở trạng thái "pending")
    public function cancelOrder(Request $request, $id)
    {
        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng!'
            ], 404);
        }

        if ($order->status !== 'pending') {
            return response()->json([
                'status' => false,
                'message' => 'Chỉ có thể hủy đơn hàng khi đơn đang ở trạng thái "Chờ xác nhận"!'
            ], 400);
        }

        // Hoàn lại tồn kho cho từng sản phẩm
        foreach ($order->items as $item) {
            Product::where('id', $item->product_id)->increment('stock', $item->quantity);
        }

        $order->update([
            'status' => 'cancelled',
            'note' => ($order->note ? $order->note . ' | ' : '') . 'Khách tự hủy đơn'
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Đã hủy đơn hàng thành công!',
            'data' => $order
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
    // 6. Tra cứu đơn hàng công khai (theo Số điện thoại hoặc danh sách IDs)
    public function lookup(Request $request)
    {
        $phone = $request->query('phone');
        $ids = $request->query('ids');

        $query = Order::with('items.product');

        if ($phone) {
            $query->where('customer_phone', $phone);
        } elseif ($ids) {
            $idArray = array_filter(explode(',', $ids));
            $query->whereIn('id', $idArray);
        } else {
            return response()->json([
                'status' => true,
                'data' => []
            ], 200);
        }

        $orders = $query->latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'Kết quả tra cứu đơn hàng',
            'data' => $orders
        ], 200);
    }
}
