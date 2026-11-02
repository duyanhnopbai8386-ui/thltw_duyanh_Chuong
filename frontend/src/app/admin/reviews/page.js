'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/app/services/api';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // 1. Tải danh sách sản phẩm để cho vào dropdown lọc
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products?per_page=100');
                setProducts(res.data?.data || []);
            } catch (err) {
                console.error("Lỗi tải sản phẩm:", err);
            }
        };
        fetchProducts();
    }, []);

    // 2. Tải danh sách review theo sản phẩm (idsp review)
    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedProduct) params.append('product_id', selectedProduct);
            if (selectedRating) params.append('rating', selectedRating);
            params.append('per_page', '50');

            const res = await api.get(`/admin/reviews?${params.toString()}`);
            setReviews(res.data?.data || []);
        } catch (err) {
            console.error("Lỗi tải đánh giá:", err);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProduct, selectedRating]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // 3. Ẩn / Hiện review
    const handleToggleStatus = async (id) => {
        setActionLoading(true);
        try {
            await api.patch(`/reviews/${id}/status`);
            fetchReviews();
        } catch (err) {
            alert('Không thể cập nhật trạng thái đánh giá!');
        } finally {
            setActionLoading(false);
        }
    };

    // 4. Xóa review
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
        setActionLoading(true);
        try {
            await api.delete(`/reviews/${id}`);
            alert('Đã xóa đánh giá thành công!');
            fetchReviews();
        } catch (err) {
            alert('Không thể xóa đánh giá!');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Quản lý Đánh giá & Chấm điểm (Reviews)
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Kiểm duyệt nhận xét và lọc đánh giá theo từng sản phẩm cụ thể (idsp review)
                    </p>
                </div>
            </div>

            {/* BỘ LỌC THEO SẢN PHẨM & SỐ SAO */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[240px]">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Lọc theo Sản phẩm (idsp):
                    </label>
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Tất cả sản phẩm ({products.length}) --</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                #{p.id} - {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-48">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Số sao:
                    </label>
                    <select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả mức sao</option>
                        <option value="5">5 Sao (Tuyệt vời)</option>
                        <option value="4">4 Sao (Tốt)</option>
                        <option value="3">3 Sao (Bình thường)</option>
                        <option value="2">2 Sao (Chưa tốt)</option>
                        <option value="1">1 Sao (Tệ)</option>
                    </select>
                </div>

                {(selectedProduct || selectedRating) && (
                    <button
                        onClick={() => { setSelectedProduct(''); setSelectedRating(''); }}
                        className="self-end text-xs text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl font-medium transition"
                    >
                        Xóa lọc
                    </button>
                )}
            </div>

            {/* BẢNG DANH SÁCH REVIEWS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200/80 text-gray-600 uppercase font-semibold text-[11px] tracking-wider">
                        <tr>
                            <th className="p-4 w-12">ID</th>
                            <th className="p-4 w-44">Người đánh giá</th>
                            <th className="p-4 w-56">Sản phẩm</th>
                            <th className="p-4 w-28">Đánh giá</th>
                            <th className="p-4">Nội dung nhận xét</th>
                            <th className="p-4 w-28 text-center">Trạng thái</th>
                            <th className="p-4 w-32 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-12 text-center text-gray-400">
                                    Đang tải danh sách nhận xét...
                                </td>
                            </tr>
                        ) : reviews.length > 0 ? (
                            reviews.map((rev) => (
                                <tr key={rev.id} className="hover:bg-gray-50/80 transition">
                                    <td className="p-4 font-mono font-medium text-gray-500">#{rev.id}</td>
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900">{rev.user_name}</div>
                                        {rev.user_email && (
                                            <div className="text-[11px] text-gray-400">{rev.user_email}</div>
                                        )}
                                        <div className="text-[10px] text-gray-400 mt-0.5">
                                            {new Date(rev.created_at).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 line-clamp-2">
                                            {rev.product?.name || `Sản phẩm #${rev.product_id}`}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center text-amber-400 text-sm">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <span key={s}>{rev.rating >= s ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-600 mt-0.5 block">
                                            {rev.rating} / 5 sao
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-gray-700 leading-relaxed font-light">
                                            "{rev.comment}"
                                        </p>
                                    </td>
                                    <td className="p-4 text-center">
                                        {rev.status ? (
                                            <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                                ✓ Đang hiện
                                            </span>
                                        ) : (
                                            <span className="inline-block bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                                ✕ Đang ẩn
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => handleToggleStatus(rev.id)}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                                                rev.status
                                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                            }`}
                                        >
                                            {rev.status ? 'Ẩn' : 'Hiện'}
                                        </button>
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => handleDelete(rev.id)}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg text-[11px] font-medium transition"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-12 text-center text-gray-400">
                                    Không có đánh giá nào phù hợp với bộ lọc.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
