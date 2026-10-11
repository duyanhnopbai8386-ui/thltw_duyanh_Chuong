'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function AdminBrandsPage() {
    const [brands, setBrands] = useState([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 1. Tải danh sách thương hiệu từ API
    const fetchBrands = async () => {
        try {
            const res = await api.get('/brands');
            setBrands(res.data.data || res.data);
        } catch (err) {
            console.error("Lỗi tải thương hiệu:", err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                router.push('/admin/login');
            }
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // Tự sinh slug khi gõ tên
    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        // Tự tạo slug đơn giản
        const generatedSlug = val
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setSlug(generatedSlug);
    };

    // 2. Thêm mới thương hiệu (hỗ trợ upload ảnh bằng FormData)
    const handleAddBrand = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('slug', slug);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await api.post('/brands', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Thêm thương hiệu thành công!');
            setName('');
            setSlug('');
            setImageFile(null);
            fetchBrands();
        } catch (err) {
            console.error("Lỗi thêm thương hiệu:", err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi thêm thương hiệu.');
        } finally {
            setLoading(false);
        }
    };

    // 3. Xóa thương hiệu
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return;
        try {
            await api.delete(`/brands/${id}`);
            alert('Xóa thương hiệu thành công!');
            fetchBrands();
        } catch (err) {
            console.error("Lỗi xóa thương hiệu:", err);
            alert('Xóa thương hiệu thất bại!');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Thương hiệu</h1>

            {/* Form thêm thương hiệu */}
            <form onSubmit={handleAddBrand} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">+ Thêm thương hiệu mới</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tên thương hiệu *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Ví dụ: Apple, Nike..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Slug (Đường dẫn) *</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="apple, nike..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Logo Thương hiệu (Ảnh)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : '+ Thêm thương hiệu'}
                    </button>
                </div>
            </form>

            {/* Bảng danh sách thương hiệu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm">
                            <th className="p-4">ID</th>
                            <th className="p-4">Logo</th>
                            <th className="p-4">Tên thương hiệu</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                        {brands.length > 0 ? (
                            brands.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50">
                                    <td className="p-4">#{b.id}</td>
                                    <td className="p-4">
                                        {b.image ? (
                                            <img
                                                src={`http://127.0.0.1:8000${b.image}`}
                                                alt={b.name}
                                                className="w-10 h-10 object-cover rounded-md border"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Không có ảnh</span>
                                        )}
                                    </td>
                                    <td className="p-4 font-semibold text-gray-900">{b.name}</td>
                                    <td className="p-4 text-gray-500 font-mono text-xs">{b.slug}</td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-500">
                                    Chưa có thương hiệu nào trong hệ thống.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
