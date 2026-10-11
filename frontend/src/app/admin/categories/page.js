'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const router = useRouter();

    // 1. Lấy danh sách danh mục khi trang được tải
    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data || res.data);
        } catch (err) {
            console.error("Lỗi tải danh mục:", err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                router.push('/admin/login');
            }
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 2. Thêm mới danh mục (Đã tự động gửi kèm Token nhờ Axios Interceptor ở Bước 1)
    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', { name });
            alert('Thêm danh mục thành công!');
            setName('');
            fetchCategories(); // Reload lại danh sách
        } catch (err) {
            console.error("Lỗi thêm danh mục:", err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi thêm danh mục.');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Quản lý Danh mục</h1>

            {/* Form thêm danh mục */}
            <form onSubmit={handleAddCategory} className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên danh mục (ví dụ: Laptop)..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                    Thêm mới
                </button>
            </form>

            {/* Hiển thị danh sách */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm">
                            <th className="p-4">ID</th>
                            <th className="p-4">Tên danh mục</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                                    <td className="p-4">{cat.id}</td>
                                    <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="p-4 text-center text-gray-500">Chưa có danh mục nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}