<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * 1. ĐĂNG KÝ (REGISTER)
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'       => true,
            'message'      => 'Đăng ký tài khoản thành công',
            'user'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ], 201);
    }

    /**
     * 2. ĐĂNG NHẬP (LOGIN)
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json([
                'status'  => false,
                'message' => 'Email hoặc mật khẩu không chính xác',
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'       => true,
            'message'      => 'Đăng nhập thành công',
            'user'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ], 200);
    }

    /**
     * 3. ĐĂNG XUẤT (LOGOUT)
     */
    public function logout(Request $request)
    {
        // Xóa token hiện tại đang được sử dụng
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Đăng xuất thành công',
        ], 200);
    }

    /**
     * 4. LẤY THÔNG TIN USER ĐANG ĐĂNG NHẬP (ME)
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => true,
            'user'   => $request->user(),
        ], 200);
    }
}