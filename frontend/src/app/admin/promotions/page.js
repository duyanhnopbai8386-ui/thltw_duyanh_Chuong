'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';

export default function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [minOrderValue, setMinOrderValue] = useState(0);
    const [saving, setSaving] = useState(false);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/promotions');
            setPromotions(res.data?.data || []);
        } catch (err) {
            console.error("Lỗi tải khuyến mãi:", err);
            setPromotions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/promotions', {
                code: code.trim().toUpperCase(),
                name,
                discount_amount: Number(discountAmount) || 0,
                discount_percent: Number(discountPercent) || 0,
                min_order_value: Number(minOrderValue) || 0,
                status: 1
            });
            alert('Tạo mã khuyến mãi thành công!');
            setCode('');
            setName('');
            setDiscountAmount('');
            setDiscountPercent('');
            setMinOrderValue(0);
            fetchPromotions();
        } catch (err) {
            alert('Lỗi tạo khuyến mãi (Mã code có thể đã tồn tại)!');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa mã khuyến mãi này?')) return;
        try {
            await api.delete(`/promotions/${id}`);
            alert('Đã xóa mã khuyến mãi!');
            fetchPromotions();
        } catch (err) {
            alert('Lỗi khi xóa!');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Quản lý Mã Khuyến Mãi & Giảm Giá (Vouchers)
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Thiết lập mã coupon giảm giá trực tiếp hoặc theo phần trăm khi khách thanh toán
                </p>
            </div>

            {/* FORM TẠO MÃ KHUYẾN MÃI */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-800">Tạo mã Voucher mới</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Mã Code (In hoa) *</label>
                        <input
                            type="text"
                            required
                            placeholder="VD: GIAM100K"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold uppercase"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Tên chương trình *</label>
                        <input
                            type="text"
                            required
                            placeholder="Giảm 100k cho đơn từ 1 triệu"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Số tiền giảm (VNĐ)</label>
                        <input
                            type="number"
                            placeholder="100000"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Hoặc % giảm (0-100)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="10"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Đơn tối thiểu (VNĐ)</label>
                        <input
                            type="number"
                            placeholder="500000"
                            value={minOrderValue}
                            onChange={(e) => setMinOrderValue(e.target.value)}
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
                        {saving ? 'Đang tạo...' : '+ Tạo Voucher'}
                    </button>
                </div>
            </form>

            {/* BẢNG DANH SÁCH KHUYẾN MÃI */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-semibold text-[11px]">
                        <tr>
                            <th className="p-4 w-12">ID</th>
                            <th className="p-4 w-36">Mã Code</th>
                            <th className="p-4">Tên chương trình</th>
                            <th className="p-4 w-36">Mức giảm</th>
                            <th className="p-4 w-36">Đơn tối thiểu</th>
                            <th className="p-4 w-28 text-center">Trạng thái</th>
                            <th className="p-4 w-28 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-12 text-center text-gray-400">Đang tải mã khuyến mãi...</td>
                            </tr>
                        ) : promotions.length > 0 ? (
                            promotions.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-mono text-gray-500">#{p.id}</td>
                                    <td className="p-4">
                                        <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg">
                                            {p.code}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-900">{p.name}</td>
                                    <td className="p-4 font-bold text-red-600">
                                        {p.discount_amount > 0
                                            ? `-${Number(p.discount_amount).toLocaleString('vi-VN')} đ`
                                            : `-${p.discount_percent}%`}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {Number(p.min_order_value) > 0
                                            ? `${Number(p.min_order_value).toLocaleString('vi-VN')} đ`
                                            : 'Không yêu cầu'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                            Đang áp dụng
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-12 text-center text-gray-400">Chưa có mã khuyến mãi nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
