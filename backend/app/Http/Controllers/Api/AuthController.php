<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Mail\OtpMail;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác.'
            ], 401);
        }

        $user = Auth::user();

        if ($user->status === 'blocked') {
            return response()->json([
                'message' => 'Tài khoản của bạn đã bị khóa bởi Quản trị viên!'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 200);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'name.required' => 'Vui lòng nhập họ và tên.',
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email này đã được sử dụng.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng ký tài khoản thành công',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công'
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6|confirmed',
        ], [
            'name.required' => 'Vui lòng nhập họ và tên.',
            'password.min' => 'Mật khẩu mới phải có ít nhất 6 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
        ]);

        $user->name = $validated['name'];
        if (array_key_exists('phone', $validated)) {
            $user->phone = $validated['phone'];
        }
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }
        $user->save();

        return response()->json([
            'message' => 'Cập nhật thông tin thành công',
            'user' => $user
        ], 200);
    }

    /**
     * Gửi mã OTP xác nhận về Gmail để đặt lại mật khẩu
     */
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ], [
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Email không đúng định dạng.',
        ]);

        $email = trim($validated['email']);
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy tài khoản nào khớp với email này!'
            ], 404);
        }

        // Tạo mã OTP ngẫu nhiên 6 số
        $otp = (string) rand(100000, 999999);

        // Lưu hoặc cập nhật vào bảng password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => $otp,
                'created_at' => now(),
            ]
        );

        // Ghi log để dự phòng demo không có mạng
        Log::info("OTP đặt lại mật khẩu cho {$email}: {$otp}");

        // Gửi email về Gmail người dùng
        $mailSent = false;
        try {
            Mail::to($email)->send(new OtpMail($otp, $user->name));
            $mailSent = true;
        } catch (\Exception $e) {
            Log::error("Lỗi gửi mail OTP: " . $e->getMessage());
        }

        return response()->json([
            'status' => true,
            'message' => 'Mã xác nhận OTP (6 số) đã được gửi đến email ' . $email . '!',
            'email' => $email,
            'mail_sent' => $mailSent,
            'debug_otp' => $otp, // Trợ thủ đắc lực khi demo trên lớp
        ], 200);
    }

    /**
     * Đặt lại mật khẩu mới với mã OTP đã nhận
     */
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'email.required' => 'Vui lòng cung cấp email.',
            'otp.required' => 'Vui lòng nhập mã OTP 6 số.',
            'otp.size' => 'Mã OTP phải có đúng 6 chữ số.',
            'password.required' => 'Vui lòng nhập mật khẩu mới.',
            'password.min' => 'Mật khẩu mới phải có ít nhất 6 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu mới không khớp.',
        ]);

        $email = trim($validated['email']);
        $otp = trim($validated['otp']);

        $record = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->where('token', $otp)
            ->first();

        if (!$record) {
            return response()->json([
                'status' => false,
                'message' => 'Mã xác nhận OTP không chính xác!'
            ], 422);
        }

        // Kiểm tra thời hạn 15 phút
        $createdAt = \Carbon\Carbon::parse($record->created_at);
        if ($createdAt->addMinutes(15)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return response()->json([
                'status' => false,
                'message' => 'Mã OTP đã hết hiệu lực (quá 15 phút). Vui lòng yêu cầu mã mới!'
            ], 422);
        }

        // Cập nhật mật khẩu mới cho user
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Tài khoản không tồn tại!'
            ], 404);
        }

        $user->password = bcrypt($validated['password']);
        $user->save();

        // Xóa token sau khi sử dụng thành công
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return response()->json([
            'status' => true,
            'message' => '🎉 Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.'
        ], 200);
    }
}