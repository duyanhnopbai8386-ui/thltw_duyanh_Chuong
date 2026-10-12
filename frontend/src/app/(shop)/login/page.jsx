'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/orders';

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
              <a href="#" className="text-xs text-[#0071e3] hover:underline font-medium">Quên mật khẩu?</a>
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
    </div>
  );
}
