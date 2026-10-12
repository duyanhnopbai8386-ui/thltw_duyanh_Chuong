'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function AdminBrandsPage() {
    const [brands, setBrands] = useState([]);
    const [trashBrands, setTrashBrands] = useState([]);
    const [activeTab, setActiveTab] = useState('list'); // 'list' hoặc 'trash'
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const router = useRouter();

    // 1. Tải danh sách thương hiệu & thùng rác
    const fetchBrands = async () => {
        try {
            const [brandRes, trashRes] = await Promise.all([
                api.get('/brands'),
                api.get('/brands/trash').catch(() => ({ data: { data: [] } }))
            ]);
            setBrands(brandRes.data.data || brandRes.data);
            setTrashBrands(trashRes.data.data || trashRes.data || []);
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
        const generatedSlug = val
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setSlug(generatedSlug);
    };

    // 2. Thêm mới hoặc Cập nhật thương hiệu (hỗ trợ upload ảnh bằng FormData)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('slug', slug);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editId) {
                formData.append('_method', 'PUT');
                await api.post(`/brands/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert('Cập nhật thương hiệu thành công!');
                setEditId(null);
            } else {
                await api.post('/brands', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert('Thêm thương hiệu thành công!');
            }

            setName('');
            setSlug('');
            setImageFile(null);
            fetchBrands();
        } catch (err) {
            console.error("Lỗi lưu thương hiệu:", err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thương hiệu.');
        } finally {
            setLoading(false);
        }
    };

    // Nạp dữ liệu lên form để Sửa
    const handleEditClick = (b) => {
        setEditId(b.id);
        setName(b.name || '');
        setSlug(b.slug || '');
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setName('');
        setSlug('');
        setImageFile(null);
    };

    // 3. Xóa tạm thời (Chuyển vào thùng rác - Soft Delete)
    const handleDelete = async (id) => {
        if (!confirm('Chuyển thương hiệu này vào thùng rác?')) return;
        try {
            await api.delete(`/brands/${id}`);
            alert('Đã chuyển thương hiệu vào thùng rác!');
            fetchBrands();
        } catch (err) {
            console.error("Lỗi xóa thương hiệu:", err);
            alert('Xóa thương hiệu thất bại!');
        }
    };

    // 4. Khôi phục thương hiệu từ thùng rác (Restore)
    const handleRestore = async (id) => {
        try {
            await api.post(`/brands/${id}/restore`);
            alert('Đã khôi phục thương hiệu thành công!');
            fetchBrands();
        } catch (err) {
            console.error("Lỗi khôi phục thương hiệu:", err);
            alert('Khôi phục thất bại!');
        }
    };

    // 5. Xóa vĩnh viễn thương hiệu (Force Delete)
    const handleForceDelete = async (id) => {
        if (!confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa VĨNH VIỄN thương hiệu này không?')) return;
        try {
            await api.delete(`/brands/${id}/force-delete`);
            alert('Đã xóa vĩnh viễn thương hiệu!');
            fetchBrands();
        } catch (err) {
            console.error("Lỗi xóa vĩnh viễn:", err);
            alert('Xóa vĩnh viễn thất bại!');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header và Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Thương hiệu</h1>
                <div className="flex items-center gap-2 bg-gray-200 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === 'list'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        🏷️ Tất cả ({brands.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('trash')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === 'trash'
                                ? 'bg-red-500 text-white shadow-sm'
                                : 'text-gray-600 hover:text-red-600'
                        }`}
                    >
                        🗑️ Thùng rác ({trashBrands.length})
                    </button>
                </div>
            </div>

            {/* TAB 1: DANH SÁCH & FORM THÊM/SỬA */}
            {activeTab === 'list' && (
                <>
                    {/* Form thêm / sửa thương hiệu */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-lg font-semibold text-gray-700">
                                {editId ? `✏️ Cập nhật thương hiệu #${editId}` : '➕ Thêm thương hiệu mới'}
                            </h2>
                            {editId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="text-sm text-gray-500 hover:text-gray-800"
                                >
                                    Hủy bỏ chỉnh sửa
                                </button>
                            )}
                        </div>

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
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Logo Thương hiệu (Ảnh) {editId && <span className="font-normal text-gray-400">(Bỏ qua nếu không đổi)</span>}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            {editId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 ${
                                    editId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? 'Đang lưu...' : editId ? 'Lưu thay đổi' : '+ Thêm thương hiệu'}
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
                                    <th className="p-4">Số lượng SP</th>
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
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                                    {b.products_count !== undefined ? b.products_count : 0} sản phẩm
                                                </span>
                                            </td>
                                            <td className="p-4 text-center space-x-3">
                                                <button
                                                    onClick={() => handleEditClick(b)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(b.id)}
                                                    className="text-red-500 hover:text-red-700 font-medium"
                                                    title="Chuyển vào thùng rác"
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
                </>
            )}

            {/* TAB 2: THÙNG RÁC THƯƠNG HIỆU (TRASH) */}
            {activeTab === 'trash' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-red-800">
                            🗑️ Danh sách thương hiệu đã xóa tạm thời (Có thể khôi phục lại hoặc xóa vĩnh viễn)
                        </span>
                        <button
                            onClick={() => setActiveTab('list')}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Quay lại danh sách chính
                        </button>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                                <th className="p-4">ID</th>
                                <th className="p-4">Logo</th>
                                <th className="p-4">Tên thương hiệu</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                            {trashBrands.length > 0 ? (
                                trashBrands.map((b) => (
                                    <tr key={b.id} className="hover:bg-red-50/30">
                                        <td className="p-4 text-gray-500">#{b.id}</td>
                                        <td className="p-4">
                                            {b.image ? (
                                                <img
                                                    src={`http://127.0.0.1:8000${b.image}`}
                                                    alt={b.name}
                                                    className="w-10 h-10 object-cover rounded-md border opacity-60"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Không có ảnh</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-semibold text-gray-700 line-through">{b.name}</td>
                                        <td className="p-4 text-gray-500 font-mono text-xs">{b.slug}</td>
                                        <td className="p-4 text-center space-x-3">
                                            <button
                                                onClick={() => handleRestore(b.id)}
                                                className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-xs font-semibold transition"
                                            >
                                                🔄 Khôi phục
                                            </button>
                                            <button
                                                onClick={() => handleForceDelete(b.id)}
                                                className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-semibold transition"
                                            >
                                                ❌ Xóa vĩnh viễn
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-400">
                                        Thùng rác đang trống.
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
