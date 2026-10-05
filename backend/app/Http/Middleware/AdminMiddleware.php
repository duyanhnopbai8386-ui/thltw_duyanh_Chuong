<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra xem người dùng đã đăng nhập và role có phải là 'admin' không
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        return response()->json([
            'status' => false,
            'message' => 'Bạn không có quyền thực hiện hành động này (Yêu cầu quyền Admin).'
        ], 403);
    }
}