'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        alert('🎉 Đăng ký tài khoản thành công!');
        router.push('/orders');
      } else {
        const errorMsg = data.errors 
          ? Object.values(data.errors).flat().join('\n') 
          : (data.message || 'Đăng ký thất bại!');
        alert(errorMsg);
      }
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      alert('Không thể kết nối đến máy chủ đăng ký!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen flex items-center justify-center py-20 px-6">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] p-10 border border-gray-100">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Tạo tài khoản.</h1>
          <p className="text-gray-500 font-light">
            Tham gia để theo dõi đơn hàng và nhận nhiều ưu đãi đặc biệt.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-gray-400 font-medium text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (tối thiểu 6 ký tự)"
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-gray-400 font-medium text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-gray-400 font-medium text-gray-900"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-medium text-lg py-3.5 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-md mt-6 disabled:opacity-50"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-[#0071e3] font-medium hover:underline">
              Đăng nhập ngay &gt;
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
