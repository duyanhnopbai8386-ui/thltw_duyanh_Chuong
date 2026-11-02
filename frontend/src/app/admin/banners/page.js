'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';

export default function AdminBannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [link, setLink] = useState('/products');
    const [position, setPosition] = useState('slideshow');
    const [sortOrder, setSortOrder] = useState(1);
    const [saving, setSaving] = useState(false);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/banners');
            setBanners(res.data?.data || []);
        } catch (err) {
            console.error("Lỗi tải banners:", err);
            setBanners([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/banners', {
                name,
                image,
                link,
                position,
                sort_order: Number(sortOrder) || 1,
                status: 1
            });
            alert('Thêm banner thành công!');
            setName('');
            setImage('');
            setLink('/products');
            fetchBanners();
        } catch (err) {
            alert('Lỗi khi thêm banner!');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa banner này?')) return;
        try {
            await api.delete(`/banners/${id}`);
            alert('Đã xóa banner!');
            fetchBanners();
        } catch (err) {
            alert('Lỗi khi xóa banner!');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Quản lý Banner & Slider Trang Chủ
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Thêm và quản lý hình ảnh trình chiếu quảng cáo tại các vị trí nổi bật
                </p>
            </div>

            {/* FORM THÊM BANNER MỚI */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-800">Thêm Banner quảng cáo mới</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Tên Banner *</label>
                        <input
                            type="text"
                            required
                            placeholder="Ví dụ: Khuyến mãi iPhone 16"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Đường dẫn hình ảnh (URL) *</label>
                        <input
                            type="url"
                            required
                            placeholder="https://images.unsplash.com/..."
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Liên kết khi click (Link)</label>
                        <input
                            type="text"
                            placeholder="/products"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Thứ tự hiển thị</label>
                        <input
                            type="number"
                            min="1"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                    >
                        {saving ? 'Đang thêm...' : '+ Thêm Banner'}
                    </button>
                </div>
            </form>

            {/* BẢNG DANH SÁCH BANNERS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-semibold text-[11px]">
                        <tr>
                            <th className="p-4 w-12">ID</th>
                            <th className="p-4 w-40">Hình ảnh</th>
                            <th className="p-4">Tên Banner</th>
                            <th className="p-4 w-40">Liên kết</th>
                            <th className="p-4 w-28 text-center">Thứ tự</th>
                            <th className="p-4 w-28 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-gray-400">Đang tải banners...</td>
                            </tr>
                        ) : banners.length > 0 ? (
                            banners.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-mono text-gray-500">#{b.id}</td>
                                    <td className="p-4">
                                        <div className="w-32 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                            <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">{b.name}</td>
                                    <td className="p-4 text-gray-500 font-mono text-[11px]">{b.link || '/'}</td>
                                    <td className="p-4 text-center font-bold text-gray-700">{b.sort_order}</td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-gray-400">Chưa có banner nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
