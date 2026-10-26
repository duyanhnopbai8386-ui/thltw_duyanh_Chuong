    'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';

export default function AdminPagesPage() {
    const [pages, setPages] = useState([]);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [editId, setEditId] = useState(null);

    const fetchPages = async () => {
        try {
            const res = await api.get('/pages');
            setPages(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi tải trang đơn:", err);
        }
    };

    useEffect(() => { fetchPages(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { title, slug, content };
            if (editId) {
                await api.put(`/pages/${editId}`, payload);
                alert('Cập nhật trang thành công!');
                setEditId(null);
            } else {
                await api.post('/pages', payload);
                alert('Thêm trang thành công!');
            }
            setTitle(''); setSlug(''); setContent('');
            fetchPages();
        } catch (err) {
            alert('Có lỗi xảy ra khi lưu trang!');
        }
    };

    const handleEdit = (p) => {
        setEditId(p.id);
        setTitle(p.title);
        setSlug(p.slug);
        setContent(p.content || '');
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa trang này?')) return;
        await api.delete(`/pages/${id}`);
        fetchPages();
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Quản lý Trang đơn (Giới thiệu, Chính sách, Liên hệ)</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="text" placeholder="Tiêu đề trang (VD: Giới thiệu)" 
                        value={title} onChange={(e) => setTitle(e.target.value)} required 
                        className="border p-2 rounded-lg text-sm"
                    />
                    <input 
                        type="text" placeholder="Đường dẫn (VD: gioi-thieu)" 
                        value={slug} onChange={(e) => setSlug(e.target.value)} required 
                        className="border p-2 rounded-lg text-sm"
                    />
                </div>
                <textarea 
                    placeholder="Nội dung chi tiết..." rows="5"
                    value={content} onChange={(e) => setContent(e.target.value)}
                    className="border p-2 rounded-lg text-sm w-full"
                ></textarea>
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium">
                    {editId ? 'Lưu thay đổi' : 'Thêm trang mới'}
                </button>
            </form>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Tiêu đề</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {pages.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4">#{p.id}</td>
                                <td className="p-4 font-semibold">{p.title}</td>
                                <td className="p-4 text-gray-500">/{p.slug}</td>
                                <td className="p-4 text-center space-x-2">
                                    <button onClick={() => handleEdit(p)} className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs">Sửa</button>
                                    <button onClick={() => handleDelete(p.id)} className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}