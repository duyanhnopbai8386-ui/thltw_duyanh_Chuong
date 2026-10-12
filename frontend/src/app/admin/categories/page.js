'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [trashCategories, setTrashCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('list'); // 'list' hoặc 'trash'
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const router = useRouter();

    // 1. Tải danh sách danh mục & thùng rác
    const fetchCategories = async () => {
        try {
            const [catRes, trashRes] = await Promise.all([
                api.get('/categories?limit=100'),
                api.get('/categories/trash').catch(() => ({ data: { data: [] } }))
            ]);
            setCategories(catRes.data.data || catRes.data || []);
            setTrashCategories(trashRes.data.data || trashRes.data || []);
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

    // Tự sinh slug khi gõ tên
    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        const generatedSlug = val
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setSlug(generatedSlug);
    };

    // 2. Thêm mới hoặc Cập nhật danh mục
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name,
                slug,
                description,
                status: Number(status)
            };

            if (editId) {
                await api.put(`/categories/${editId}`, payload);
                alert('Cập nhật danh mục thành công!');
                setEditId(null);
            } else {
                await api.post('/categories', payload);
                alert('Thêm danh mục mới thành công!');
            }

            setName('');
            setSlug('');
            setDescription('');
            setStatus(1);
            fetchCategories();
        } catch (err) {
            console.error("Lỗi lưu danh mục:", err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục!');
        } finally {
            setLoading(false);
        }
    };

    // Nạp dữ liệu lên form để sửa
    const handleEdit = (cat) => {
        setEditId(cat.id);
        setName(cat.name);
        setSlug(cat.slug || '');
        setDescription(cat.description || '');
        setStatus(cat.status !== undefined ? cat.status : 1);
        setActiveTab('list');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setName('');
        setSlug('');
        setDescription('');
        setStatus(1);
    };

    // 3. Xóa mềm (Chuyển vào thùng rác)
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn chuyển danh mục này vào thùng rác?')) return;
        try {
            await api.delete(`/categories/${id}`);
            alert('Đã chuyển danh mục vào thùng rác!');
            fetchCategories();
        } catch (err) {
            console.error("Lỗi xóa danh mục:", err);
            alert(err.response?.data?.message || 'Xóa danh mục thất bại!');
        }
    };

    // 4. Khôi phục từ thùng rác
    const handleRestore = async (id) => {
        try {
            await api.post(`/categories/${id}/restore`);
            alert('Khôi phục danh mục thành công!');
            fetchCategories();
        } catch (err) {
            console.error("Lỗi khôi phục danh mục:", err);
            alert('Khôi phục thất bại!');
        }
    };

    // 5. Xóa vĩnh viễn
    const handleForceDelete = async (id) => {
        if (!confirm('Hành động này KHÔNG THỂ hoàn tác! Xóa vĩnh viễn danh mục này?')) return;
        try {
            await api.delete(`/categories/${id}/force-delete`);
            alert('Đã xóa vĩnh viễn danh mục khỏi hệ thống!');
            fetchCategories();
        } catch (err) {
            console.error("Lỗi xóa vĩnh viễn:", err);
            alert('Xóa vĩnh viễn thất bại!');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý thông tin, phân loại và thùng rác danh mục</p>
                </div>

                {/* Tabs chuyển đổi Danh sách / Thùng rác */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === 'list'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        📋 Danh sách ({categories.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('trash')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === 'trash'
                                ? 'bg-white text-red-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        🗑️ Thùng rác ({trashCategories.length})
                    </button>
                </div>
            </div>

            {/* TAB 1: DANH SÁCH DANH MỤC */}
            {activeTab === 'list' && (
                <>
                    {/* Form Thêm / Sửa */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>{editId ? '✏️ Chỉnh sửa Danh mục' : '➕ Thêm Danh mục mới'}</span>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tên danh mục *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ví dụ: Điện thoại, Laptop..."
                                        value={name}
                                        onChange={handleNameChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Đường dẫn (Slug) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="dien-thoai, laptop..."
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Mô tả danh mục
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Mô tả ngắn gọn về danh mục..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Trạng thái hiển thị
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value={1}>Hoạt động (Hiển thị)</option>
                                        <option value={0}>Ẩn</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-2.5 rounded-xl font-medium text-white transition ${
                                        editId
                                            ? 'bg-orange-500 hover:bg-orange-600'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } disabled:opacity-50`}
                                >
                                    {loading ? 'Đang xử lý...' : editId ? 'Lưu thay đổi' : 'Thêm mới'}
                                </button>
                                {editId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
                                    >
                                        Hủy chỉnh sửa
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Bảng dữ liệu danh mục */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Tên danh mục</th>
                                    <th className="p-4">Đường dẫn (Slug)</th>
                                    <th className="p-4">Trạng thái</th>
                                    <th className="p-4 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-gray-800">#{cat.id}</td>
                                            <td className="p-4 font-semibold text-gray-900">{cat.name}</td>
                                            <td className="p-4 text-gray-500">{cat.slug}</td>
                                            <td className="p-4">
                                                {cat.status == 1 ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                        Hoạt động
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                                        Ẩn
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(cat)}
                                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            Chưa có danh mục nào. Hãy thêm danh mục đầu tiên ở trên!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* TAB 2: THÙNG RÁC */}
            {activeTab === 'trash' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4">ID</th>
                                <th className="p-4">Tên danh mục</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4">Thời gian xóa</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {trashCategories.length > 0 ? (
                                trashCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-800">#{cat.id}</td>
                                        <td className="p-4 font-semibold text-gray-900">{cat.name}</td>
                                        <td className="p-4 text-gray-500">{cat.slug}</td>
                                        <td className="p-4 text-xs text-gray-400">
                                            {cat.deleted_at ? new Date(cat.deleted_at).toLocaleString('vi-VN') : 'Đã xóa'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleRestore(cat.id)}
                                                    className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-medium transition"
                                                >
                                                    Khôi phục
                                                </button>
                                                <button
                                                    onClick={() => handleForceDelete(cat.id)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                                                >
                                                    Xóa vĩnh viễn
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-400">
                                        Thùng rác danh mục đang trống.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}