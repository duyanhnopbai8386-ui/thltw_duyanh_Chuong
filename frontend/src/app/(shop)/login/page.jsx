'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/orders';

  // --- STATE DÀNH CHO QUÊN MẬT KHẨU (GỬI MÃ VỀ GMAIL) ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & Mật khẩu mới
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState({ type: '', text: '', debugOtp: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('cartUpdated'));
        alert('🎉 Đăng nhập thành công!');
        router.push(redirectPath);
      } else {
        alert(data.message || 'Email hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      alert('Không thể kết nối đến máy chủ đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  // Mở modal Quên mật khẩu
  const handleOpenForgot = () => {
    setForgotEmail(email || '');
    setForgotStep(1);
    setOtpCode('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setForgotMsg({ type: '', text: '', debugOtp: '' });
    setShowForgotModal(true);
  };

  // Bước 1: Gửi mã OTP về Gmail
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotMsg({ type: 'error', text: 'Vui lòng nhập địa chỉ email của bạn!', debugOtp: '' });
      return;
    }

    setForgotLoading(true);
    setForgotMsg({ type: '', text: '', debugOtp: '' });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setForgotStep(2);
        setForgotMsg({
          type: 'success',
          text: data.message || 'Mã xác thực OTP đã được gửi về Gmail của bạn!',
          debugOtp: data.debug_otp || '',
        });
      } else {
        setForgotMsg({
          type: 'error',
          text: data.message || 'Không tìm thấy tài khoản với email này!',
          debugOtp: '',
        });
      }
    } catch (err) {
      setForgotMsg({ type: 'error', text: 'Không thể kết nối máy chủ gửi mail!', debugOtp: '' });
    } finally {
      setForgotLoading(false);
    }
  };

  // Bước 2: Xác nhận OTP và đặt lại mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setForgotMsg({ type: 'error', text: 'Mã xác thực OTP phải gồm 6 chữ số!', debugOtp: forgotMsg.debugOtp });
      return;
    }

    if (newPassword.length < 6) {
      setForgotMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 6 ký tự!', debugOtp: forgotMsg.debugOtp });
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setForgotMsg({ type: 'error', text: 'Xác nhận mật khẩu mới không khớp!', debugOtp: forgotMsg.debugOtp });
      return;
    }

    setForgotLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          otp: otpCode.trim(),
          password: newPassword,
          password_confirmation: newPasswordConfirm,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setForgotMsg({
          type: 'success',
          text: '🎉 Đổi mật khẩu thành công! Đang chuyển về đăng nhập...',
          debugOtp: '',
        });
        setEmail(forgotEmail);
        setPassword(newPassword);

        setTimeout(() => {
          setShowForgotModal(false);
        }, 1500);
      } else {
        setForgotMsg({
          type: 'error',
          text: data.message || 'Mã OTP không hợp lệ hoặc đã hết hạn!',
          debugOtp: forgotMsg.debugOtp,
        });
      }
    } catch (err) {
      setForgotMsg({ type: 'error', text: 'Lỗi kết nối đặt lại mật khẩu!', debugOtp: forgotMsg.debugOtp });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen flex items-center justify-center py-20 px-6">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] p-10 border border-gray-100">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Đăng nhập.</h1>
          <p className="text-gray-500 font-light">
            Đăng nhập để theo dõi đơn hàng và mua sắm dễ dàng hơn.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email của bạn</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-gray-400 font-medium text-gray-900"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <button 
                type="button"
                onClick={handleOpenForgot}
                className="text-xs text-[#0071e3] hover:underline font-medium"
              >
                Quên mật khẩu?
              </button>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-gray-400 font-medium text-gray-900"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-medium text-lg py-3.5 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-[#0071e3] font-medium hover:underline">
              Tạo tài khoản ngay &gt;
            </Link>
          </p>
        </div>
        
      </div>

      {/* MODAL QUÊN MẬT KHẨU - GỬI MÃ OTP VỀ GMAIL */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowForgotModal(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center text-sm font-bold transition"
            >
              ✕
            </button>

            {/* Header Modal */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-3 shadow-inner">
                {forgotStep === 1 ? '📧' : '🔐'}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {forgotStep === 1 ? 'Quên mật khẩu' : 'Xác thực OTP & Đổi mật khẩu'}
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                {forgotStep === 1 
                  ? 'Nhập email tài khoản của bạn để nhận mã xác thực OTP gửi về Gmail.'
                  : `Hệ thống đã gửi mã OTP 6 số đến email: ${forgotEmail}`}
              </p>
            </div>

            {/* Thông báo Message */}
            {forgotMsg.text && (
              <div className={`p-3.5 rounded-2xl text-xs font-medium mb-5 ${
                forgotMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {forgotMsg.type === 'success' ? '✓ ' : '✕ '} {forgotMsg.text}
              </div>
            )}

            {/* Hint mã Demo nếu có (tiện khi demo trên lớp) */}
            {forgotMsg.debugOtp && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-800 mb-5 flex items-center justify-between">
                <span>🎯 Mã OTP demo: <strong className="font-mono text-sm text-amber-900">{forgotMsg.debugOtp}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtpCode(forgotMsg.debugOtp)}
                  className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg text-[11px] font-semibold transition"
                >
                  Tự điền mã
                </button>
              </div>
            )}

            {/* BƯỚC 1: NHẬP EMAIL */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Địa chỉ Email của bạn
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="vidu@gmail.com"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs py-3.5 rounded-2xl shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {forgotLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi mã về Gmail...</span>
                    </>
                  ) : (
                    <span>Gửi mã OTP về Gmail →</span>
                  )}
                </button>
              </form>
            )}

            {/* BƯỚC 2: NHẬP OTP VÀ MẬT KHẨU MỚI */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Mã xác nhận OTP (6 số)
                    </label>
                    <button
                      type="button"
                      disabled={forgotLoading}
                      onClick={handleSendOtp}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      Gửi lại mã
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-gray-50 border border-gray-200 text-center tracking-[8px] font-mono font-bold text-lg text-gray-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs py-3 rounded-2xl transition"
                  >
                    ← Quay lại
                  </button>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-2/3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs py-3 rounded-2xl shadow-md shadow-emerald-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <span>Xác nhận đổi mật khẩu</span>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center text-sm text-gray-500">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}
