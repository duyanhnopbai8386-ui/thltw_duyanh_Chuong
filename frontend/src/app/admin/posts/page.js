'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function AdminPostsPage() {
    const [posts, setPosts] = useState([]);
    const [trashPosts, setTrashPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('list'); // 'list' hoặc 'trash'
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [search, setSearch] = useState('');

    const router = useRouter();

    // Form state
    const [form, setForm] = useState({
        title: '',
        slug: '',
        summary: '',
        content: '',
        status: 1,
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);

    // 1. Tải danh sách bài viết & thùng rác
    const fetchData = async (page = 1) => {
        try {
            const params = new URLSearchParams({ page, per_page: 10 });
            if (search) params.append('search', search);

            const [postRes, trashRes] = await Promise.all([
                api.get(`/posts?${params.toString()}`),
                api.get('/posts/trash').catch(() => ({ data: { data: [] } }))
            ]);

            setPosts(postRes.data.data || []);
            if (postRes.data.meta) {
                setPagination({
                    current_page: postRes.data.meta.current_page,
                    last_page: postRes.data.meta.last_page,
                    total: postRes.data.meta.total,
                });
            }
            setTrashPosts(trashRes.data.data || []);
        } catch (err) {
            console.error('Lỗi tải danh sách bài viết:', err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                router.push('/admin/login');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Tự sinh slug khi nhập tiêu đề
    const handleTitleChange = (e) => {
        const val = e.target.value;
        const generatedSlug = val
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        setForm((prev) => ({
            ...prev,
            title: val,
            slug: generatedSlug,
        }));
    };

    // 2. Thêm mới hoặc Sửa bài viết
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('slug', form.slug);
            if (form.summary) formData.append('summary', form.summary);
            if (form.content) formData.append('content', form.content);
            formData.append('status', form.status ? 1 : 0);
            if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

            if (editId) {
                formData.append('_method', 'PUT');
                await api.post(`/posts/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert('Cập nhật bài viết thành công!');
                setEditId(null);
            } else {
                await api.post('/posts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert('Thêm bài viết mới thành công!');
            }

            // Reset form
            setForm({
                title: '',
                slug: '',
                summary: '',
                content: '',
                status: 1,
            });
            setThumbnailFile(null);
            const fileInput = document.getElementById('thumbnailInput');
            if (fileInput) fileInput.value = '';

            fetchData(1);
        } catch (err) {
            console.error('Lỗi lưu bài viết:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết!');
        } finally {
            setLoading(false);
        }
    };

    // Nạp dữ liệu lên form để sửa
    const handleEditClick = (p) => {
        setEditId(p.id);
        setForm({
            title: p.title,
            slug: p.slug || '',
            summary: p.summary || '',
            content: p.content || '',
            status: p.status ? 1 : 0,
        });
        setActiveTab('list');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setForm({
            title: '',
            slug: '',
            summary: '',
            content: '',
            status: 1,
        });
        setThumbnailFile(null);
    };

    // 3. Xóa mềm (vào thùng rác)
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn chuyển bài viết này vào thùng rác?')) return;
        try {
            const res = await api.delete(`/posts/${id}`);
            alert(res.data.message || 'Đã chuyển vào thùng rác!');
            fetchData(pagination.current_page);
        } catch (err) {
            console.error('Lỗi xóa bài viết:', err);
            alert('Không thể xóa bài viết!');
        }
    };

    // 4. Khôi phục bài viết
    const handleRestore = async (id) => {
        try {
            await api.post(`/posts/${id}/restore`);
            alert('Khôi phục bài viết thành công!');
            fetchData(1);
        } catch (err) {
            console.error('Lỗi khôi phục:', err);
            alert('Lỗi khôi phục bài viết!');
        }
    };

    // 5. Xóa vĩnh viễn
    const handleForceDelete = async (id) => {
        if (!confirm('CẢNH BÁO: Bài viết và ảnh đại diện sẽ bị xóa vĩnh viễn không thể phục hồi. Tiếp tục?')) return;
        try {
            await api.delete(`/posts/${id}/force-delete`);
            alert('Đã xóa vĩnh viễn bài viết!');
            fetchData(1);
        } catch (err) {
            console.error('Lỗi xóa vĩnh viễn:', err);
            alert('Không thể xóa vĩnh viễn bài viết!');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header trang */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">📝 Quản lý Bài viết & Tin tức</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Đăng bài đánh giá công nghệ, tin khuyến mãi và tin tức cửa hàng.
                    </p>
                </div>

                {/* Tabs chuyển đổi Danh sách và Thùng rác */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === 'list'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        📋 Danh sách bài viết ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('trash')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === 'trash'
                                ? 'bg-white text-red-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        🗑️ Thùng rác ({trashPosts.length})
                    </button>
                </div>
            </div>

            {/* TAB 1: DANH SÁCH & FORM THÊM/SỬA */}
            {activeTab === 'list' && (
                <>
                    {/* Form thêm mới / cập nhật bài viết */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {editId ? '✏️ Chỉnh sửa bài viết' : '➕ Thêm bài viết mới'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tiêu đề bài viết *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="VD: Đánh giá iPhone 16 Pro Max sau 1 tháng sử dụng..."
                                        value={form.title}
                                        onChange={handleTitleChange}
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
                                        placeholder="danh-gia-iphone-16-pro-max..."
                                        value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Ảnh bìa (Thumbnail)
                                    </label>
                                    <input
                                        id="thumbnailInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setThumbnailFile(e.target.files[0])}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Trạng thái hiển thị
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value={1}>Xuất bản (Hiển thị ngay)</option>
                                        <option value={0}>Bản nháp (Ẩn)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tóm tắt bài viết (Mô tả ngắn)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Tóm tắt nội dung chính của bài viết trong 1-2 câu..."
                                    value={form.summary}
                                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Nội dung chi tiết bài viết
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="Nội dung bài viết đầy đủ..."
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
                                    {loading ? 'Đang lưu...' : editId ? 'Lưu thay đổi' : '+ Đăng bài viết'}
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

                    {/* Bảng danh sách bài viết */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Ảnh bìa</th>
                                    <th className="p-4">Tiêu đề bài viết</th>
                                    <th className="p-4">Lượt xem</th>
                                    <th className="p-4">Trạng thái</th>
                                    <th className="p-4">Ngày đăng</th>
                                    <th className="p-4 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {posts.length > 0 ? (
                                    posts.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-gray-800">#{p.id}</td>
                                            <td className="p-4">
                                                {p.thumbnail ? (
                                                    <img
                                                        src={`http://127.0.0.1:8000${p.thumbnail}`}
                                                        alt={p.title}
                                                        className="w-14 h-10 object-cover rounded-lg border"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="w-14 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                                        Không ảnh
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 max-w-xs">
                                                <div className="font-semibold text-gray-900 truncate" title={p.title}>
                                                    {p.title}
                                                </div>
                                                <div className="text-xs text-gray-400 font-mono truncate">
                                                    /{p.slug}
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-gray-600">
                                                👁️ {p.views ?? 0}
                                            </td>
                                            <td className="p-4">
                                                {p.status ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                        Xuất bản
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                                        Bản nháp
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-xs text-gray-500">
                                                {p.created_at || '---'}
                                            </td>
                                            <td className="p-4 text-center space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(p)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            Chưa có bài viết nào. Hãy thêm bài viết đầu tiên ở form trên!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Phân trang */}
                        {pagination.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 border-t border-gray-200 gap-3">
                                <span className="text-sm text-gray-600">
                                    Trang <span className="font-semibold">{pagination.current_page}</span> / <span className="font-semibold">{pagination.last_page}</span> (Tổng {pagination.total} bài)
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        disabled={pagination.current_page <= 1}
                                        onClick={() => fetchData(pagination.current_page - 1)}
                                        className="px-3 py-1.5 text-xs font-medium rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        ← Trước
                                    </button>
                                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pg) => (
                                        <button
                                            key={pg}
                                            onClick={() => fetchData(pg)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${
                                                pagination.current_page === pg
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {pg}
                                        </button>
                                    ))}
                                    <button
                                        disabled={pagination.current_page >= pagination.last_page}
                                        onClick={() => fetchData(pagination.current_page + 1)}
                                        className="px-3 py-1.5 text-xs font-medium rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        Sau →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* TAB 2: THÙNG RÁC BÀI VIẾT */}
            {activeTab === 'trash' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-red-800">
                            🗑️ Danh sách bài viết trong thùng rác
                        </span>
                        <span className="text-xs text-red-600">
                            Các bài viết đã bị xóa tạm thời, bạn có thể Khôi phục hoặc Xóa vĩnh viễn
                        </span>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4">ID</th>
                                <th className="p-4">Tiêu đề bài viết</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {trashPosts.length > 0 ? (
                                trashPosts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-800">#{p.id}</td>
                                        <td className="p-4 font-medium text-gray-800">{p.title}</td>
                                        <td className="p-4 text-center space-x-3">
                                            <button
                                                onClick={() => handleRestore(p.id)}
                                                className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition"
                                            >
                                                ♻️ Khôi phục
                                            </button>
                                            <button
                                                onClick={() => handleForceDelete(p.id)}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                                            >
                                                ❌ Xóa vĩnh viễn
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500">
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
