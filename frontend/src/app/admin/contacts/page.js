'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/contacts');
            setContacts(res.data?.data || []);
        } catch (err) {
            console.error("Lỗi tải liên hệ:", err);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleToggleStatus = async (id) => {
        try {
            await api.patch(`/contacts/${id}/status`);
            fetchContacts();
        } catch (err) {
            alert('Lỗi cập nhật trạng thái liên hệ!');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa thư liên hệ này?')) return;
        try {
            await api.delete(`/contacts/${id}`);
            alert('Đã xóa liên hệ thành công!');
            fetchContacts();
        } catch (err) {
            alert('Lỗi khi xóa liên hệ!');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Quản lý Hộp thư Liên hệ & Góp ý
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Danh sách các câu hỏi, góp ý và yêu cầu hỗ trợ từ khách hàng gửi qua website
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200/80 text-gray-600 uppercase font-semibold text-[11px] tracking-wider">
                        <tr>
                            <th className="p-4 w-12">ID</th>
                            <th className="p-4 w-48">Khách hàng</th>
                            <th className="p-4 w-48">Tiêu đề / Chủ đề</th>
                            <th className="p-4">Nội dung câu hỏi / Góp ý</th>
                            <th className="p-4 w-28 text-center">Trạng thái</th>
                            <th className="p-4 w-32 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-gray-400">
                                    Đang tải dữ liệu liên hệ...
                                </td>
                            </tr>
                        ) : contacts.length > 0 ? (
                            contacts.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50/80 transition">
                                    <td className="p-4 font-mono font-medium text-gray-500">#{c.id}</td>
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900">{c.name}</div>
                                        <div className="text-[11px] text-gray-500">{c.email}</div>
                                        {c.phone && <div className="text-[11px] text-blue-600">{c.phone}</div>}
                                        <div className="text-[10px] text-gray-400 mt-1">
                                            {new Date(c.created_at).toLocaleString('vi-VN')}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">
                                        {c.title || 'Không có tiêu đề'}
                                    </td>
                                    <td className="p-4">
                                        <p className="text-gray-700 leading-relaxed font-light whitespace-pre-wrap">
                                            {c.content}
                                        </p>
                                    </td>
                                    <td className="p-4 text-center">
                                        {c.status ? (
                                            <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                                ✓ Đã xử lý
                                            </span>
                                        ) : (
                                            <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                                ⏳ Chờ xử lý
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(c.id)}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                                                c.status
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                            }`}
                                        >
                                            {c.status ? 'Chưa xong' : 'Xong'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg text-[11px] font-medium transition"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-gray-400">
                                    Hộp thư liên hệ đang trống.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
