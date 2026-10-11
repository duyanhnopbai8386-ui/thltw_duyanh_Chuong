// src/app/admin/login/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/services/api';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Gửi request đăng nhập lên Laravel API
            const res = await api.post('/login', { email, password });
            
            // Lấy access_token do Laravel trả về
            const token = res.data.access_token || res.data.token;
            
            if (token) {
                // Lưu token vào localStorage để các request sau tự động đính kèm
                localStorage.setItem('token', token);
                
                if (res.data.user) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }

                alert('Đăng nhập thành công!');
                router.push('/admin/categories'); // Chuyển hướng về trang quản lý danh mục
            } else {
                alert('Không nhận được Token từ server!');
            }
        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại! Vui lòng kiểm tra lại Email hoặc Mật khẩu.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng nhập Quản trị</h2>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}