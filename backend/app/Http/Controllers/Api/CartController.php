<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Lấy giỏ hàng của user đang đăng nhập
        $carts = Cart::with('product')->where('user_id', $request->user()->id)->get();
        return response()->json($carts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $userId = $request->user()->id;

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        $cart = Cart::where('user_id', $userId)
                    ->where('product_id', $request->product_id)
                    ->first();

        if ($cart) {
            // Nếu có rồi thì cộng dồn số lượng
            $cart->quantity += $request->quantity;
            $cart->save();
        } else {
            // Nếu chưa thì tạo mới
            $cart = Cart::create([
                'user_id' => $userId,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json([
            'message' => 'Thêm vào giỏ hàng thành công',
            'data' => $cart->load('product')
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $cart->update([
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'message' => 'Cập nhật số lượng thành công',
            'data' => $cart
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $cart = Cart::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $cart->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm khỏi giỏ hàng thành công'
        ]);
    }
}
