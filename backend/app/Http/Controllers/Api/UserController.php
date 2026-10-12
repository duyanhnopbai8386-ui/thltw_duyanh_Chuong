<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Danh sách người dùng (Tìm kiếm, Phân trang, Thống kê đơn hàng)
     */
    public function index(Request $request)
    {
        $limit = $request->query('per_page', $request->query('limit', 10));
        $search = $request->query('search');
        $role = $request->query('role');
        $status = $request->query('status');

        $query = User::query()
            ->withCount('orders')
            ->withSum('orders', 'total_price')
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($role) {
            $query->where('role', $role);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $users = $query->paginate($limit);

        return response()->json([
            'status' => true,
            'data' => $users->items(),
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ]
        ], 200);
    }

    /**
     * Chi tiết người dùng kèm toàn bộ lịch sử đơn hàng của họ (Hiển thị 1 trang)
     */
    public function show($id)
    {
        $user = User::withCount('orders')
            ->withSum('orders', 'total_price')
            ->with(['orders' => function ($query) {
                $query->with(['items.product'])->latest();
            }])
            ->findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $user
        ], 200);
    }

    /**
     * Khóa / Mở khóa tài khoản (Block / Unblock)
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Không cho phép tự khóa tài khoản của chính mình
        if ($request->user() && $request->user()->id === $user->id) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn không thể tự khóa tài khoản quản trị của chính mình!'
            ], 422);
        }

        $newStatus = $user->status === 'blocked' ? 'active' : 'blocked';
        $user->update(['status' => $newStatus]);

        $statusText = $newStatus === 'blocked' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản';

        return response()->json([
            'status' => true,
            'message' => "{$statusText} {$user->email} thành công!",
            'data' => $user
        ], 200);
    }

    /**
     * Cập nhật phân quyền tài khoản (admin / user)
     */
    public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'role' => 'required|in:admin,user',
        ]);

        if ($request->user() && $request->user()->id === $user->id && $request->role !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Bạn không thể tự hạ quyền quản trị viên của chính mình!'
            ], 422);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật quyền hạn thành công!',
            'data' => $user
        ], 200);
    }
}
