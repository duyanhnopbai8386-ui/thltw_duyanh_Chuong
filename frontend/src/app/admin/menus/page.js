'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function AdminMenusPage() {
    const [menus, setMenus] = useState([]);
    const [trashMenus, setTrashMenus] = useState([]);
    const [activeTab, setActiveTab] = useState('list'); // 'list' hoặc 'trash'
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [perPage, setPerPage] = useState(5);
    const [filterPosition, setFilterPosition] = useState('');
    const [search, setSearch] = useState('');

    const router = useRouter();

    // Form state
    const [form, setForm] = useState({
        name: '',
        link: '',
        position: 'header',
        sort_order: 1,
        status: 1,
    });

    // 1. Tải danh sách menu & thùng rác
    const fetchData = async (page = 1, currentPerPage = perPage) => {
        try {
            const params = new URLSearchParams({ page, per_page: currentPerPage });
            if (filterPosition) params.append('position', filterPosition);
            if (search) params.append('search', search);

            const [menuRes, trashRes] = await Promise.all([
                api.get(`/menus?${params.toString()}`),
                api.get('/menus/trash').catch(() => ({ data: { data: [] } }))
            ]);

            setMenus(menuRes.data.data || []);
            if (menuRes.data.meta) {
                setPagination({
                    current_page: menuRes.data.meta.current_page,
                    last_page: menuRes.data.meta.last_page,
                    total: menuRes.data.meta.total,
                });
            }
            setTrashMenus(trashRes.data.data || []);
        } catch (err) {
            console.error('Lỗi tải danh sách menu:', err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                router.push('/admin/login');
            }
        }
    };

    useEffect(() => {
        fetchData(1);
    }, [filterPosition]);

    // 2. Thêm mới hoặc Cập nhật Menu
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: form.name,
                link: form.link,
                position: form.position,
                sort_order: Number(form.sort_order) || 0,
                status: Number(form.status) === 1,
            };

            if (editId) {
                await api.put(`/menus/${editId}`, payload);
                alert('Cập nhật Menu thành công!');
                setEditId(null);
            } else {
                await api.post('/menus', payload);
                alert('Thêm Menu mới thành công!');
            }

            // Reset form
            setForm({
                name: '',
                link: '',
                position: 'header',
                sort_order: 1,
                status: 1,
            });
            fetchData(1);
        } catch (err) {
            console.error('Lỗi lưu menu:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu menu!');
        } finally {
            setLoading(false);
        }
    };

    // Nạp dữ liệu lên form để sửa
    const handleEditClick = (m) => {
        setEditId(m.id);
        setForm({
            name: m.name,
            link: m.link || '',
            position: m.position || 'header',
            sort_order: m.sort_order ?? 0,
            status: m.status ? 1 : 0,
        });
        setActiveTab('list');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setForm({
            name: '',
            link: '',
            position: 'header',
            sort_order: 1,
            status: 1,
        });
    };

    // 3. Xóa mềm (chuyển vào thùng rác)
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn chuyển Menu này vào thùng rác?')) return;
        try {
            const res = await api.delete(`/menus/${id}`);
            alert(res.data.message || 'Đã chuyển vào thùng rác!');
            fetchData(pagination.current_page);
        } catch (err) {
            console.error('Lỗi xóa menu:', err);
            alert('Không thể xóa menu!');
        }
    };

    // 4. Khôi phục
    const handleRestore = async (id) => {
        try {
            await api.post(`/menus/${id}/restore`);
            alert('Khôi phục Menu thành công!');
            fetchData(1);
        } catch (err) {
            console.error('Lỗi khôi phục menu:', err);
            alert('Không thể khôi phục menu!');
        }
    };

    // 5. Xóa vĩnh viễn
    const handleForceDelete = async (id) => {
        if (!confirm('CẢNH BÁO: Menu này sẽ bị xóa vĩnh viễn. Tiếp tục?')) return;
        try {
            await api.delete(`/menus/${id}/force-delete`);
            alert('Đã xóa vĩnh viễn Menu!');
            fetchData(1);
        } catch (err) {
            console.error('Lỗi xóa vĩnh viễn:', err);
            alert('Không thể xóa vĩnh viễn menu!');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header trang */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">📑 Quản lý Menu Điều Hướng</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Cấu hình các liên kết điều hướng trên thanh Header và chân trang Footer của website.
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
                        📋 Danh sách Menu ({menus.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('trash')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === 'trash'
                                ? 'bg-white text-red-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        🗑️ Thùng rác ({trashMenus.length})
                    </button>
                </div>
            </div>

            {/* TAB 1: DANH SÁCH & FORM THÊM/SỬA */}
            {activeTab === 'list' && (
                <>
                    {/* Form thêm mới / cập nhật menu */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {editId ? '✏️ Chỉnh sửa Menu' : '➕ Thêm Menu mới'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tên Menu hiển thị *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="VD: Trang chủ, Sản phẩm, Tin tức, Về chúng tôi..."
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Đường dẫn liên kết (Link / URL) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="VD: /, /products, /posts, /about..."
                                        value={form.link}
                                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Vị trí hiển thị *
                                    </label>
                                    <select
                                        value={form.position}
                                        onChange={(e) => setForm({ ...form, position: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="header">Header (Thanh menu trên cùng)</option>
                                        <option value="footer">Footer (Chân trang web)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Thứ tự sắp xếp (Số nhỏ đứng trước)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        placeholder="1, 2, 3..."
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        <option value={1}>Hiển thị</option>
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
                                    {loading ? 'Đang lưu...' : editId ? 'Lưu thay đổi' : '+ Thêm Menu'}
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

                    {/* Bộ lọc vị trí nhanh */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600">Lọc vị trí:</span>
                            <button
                                onClick={() => setFilterPosition('')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    filterPosition === ''
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Tất cả vị trí
                            </button>
                            <button
                                onClick={() => setFilterPosition('header')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    filterPosition === 'header'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                🔝 Header Menu
                            </button>
                            <button
                                onClick={() => setFilterPosition('footer')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    filterPosition === 'footer'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                🔻 Footer Menu
                            </button>
                        </div>

                        <div className="text-xs text-gray-500">
                            Tổng số: <strong>{pagination.total}</strong> mục
                        </div>
                    </div>

                    {/* Bảng danh sách menu */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Tên Menu</th>
                                    <th className="p-4">Đường dẫn liên kết</th>
                                    <th className="p-4">Vị trí</th>
                                    <th className="p-4">Thứ tự</th>
                                    <th className="p-4">Trạng thái</th>
                                    <th className="p-4 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {menus.length > 0 ? (
                                    menus.map((m) => (
                                        <tr key={m.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-gray-800">#{m.id}</td>
                                            <td className="p-4 font-semibold text-gray-900">{m.name}</td>
                                            <td className="p-4 font-mono text-xs text-blue-600">{m.link}</td>
                                            <td className="p-4">
                                                {m.position === 'header' ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                                                        🔝 Header
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                                                        🔻 Footer
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 font-semibold text-gray-700">
                                                #{m.sort_order}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                {m.status ? (
                                                    <span className="whitespace-nowrap inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                                                        🟢 Hiển thị
                                                    </span>
                                                ) : (
                                                    <span className="whitespace-nowrap inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                                        Ẩn
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(m)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(m.id)}
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
                                            Chưa có Menu nào. Hãy thêm Menu đầu tiên ở form trên!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Thanh phân trang Pagination - Luôn hiển thị ở chân bảng */}
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 border-t border-gray-200 gap-3">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>Hiển thị</span>
                                <select
                                    value={perPage}
                                    onChange={(e) => {
                                        const newPerPage = Number(e.target.value);
                                        setPerPage(newPerPage);
                                        fetchData(1, newPerPage);
                                    }}
                                    className="px-2 py-1 border border-gray-300 rounded-lg bg-white text-xs font-semibold focus:outline-none"
                                >
                                    <option value={2}>2 / trang (Demo)</option>
                                    <option value={5}>5 / trang</option>
                                    <option value={10}>10 / trang</option>
                                    <option value={20}>20 / trang</option>
                                </select>
                                <span>(Tổng <strong>{pagination.total}</strong> menu)</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    disabled={pagination.current_page <= 1}
                                    onClick={() => fetchData(pagination.current_page - 1, perPage)}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
                                >
                                    ← Trước
                                </button>
                                {Array.from({ length: Math.max(pagination.last_page || 1, 1) }, (_, i) => i + 1).map((pg) => (
                                    <button
                                        key={pg}
                                        onClick={() => fetchData(pg, perPage)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                                            pagination.current_page === pg
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {pg}
                                    </button>
                                ))}
                                <button
                                    disabled={pagination.current_page >= pagination.last_page}
                                    onClick={() => fetchData(pagination.current_page + 1, perPage)}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
                                >
                                    Sau →
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* TAB 2: THÙNG RÁC MENU */}
            {activeTab === 'trash' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-red-800">
                            🗑️ Danh sách Menu trong thùng rác
                        </span>
                        <span className="text-xs text-red-600">
                            Các Menu đã xóa tạm thời, bạn có thể Khôi phục hoặc Xóa vĩnh viễn
                        </span>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4">ID</th>
                                <th className="p-4">Tên Menu</th>
                                <th className="p-4">Đường dẫn</th>
                                <th className="p-4">Vị trí</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {trashMenus.length > 0 ? (
                                trashMenus.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-800">#{m.id}</td>
                                        <td className="p-4 font-medium text-gray-800">{m.name}</td>
                                        <td className="p-4 font-mono text-xs text-gray-500">{m.link}</td>
                                        <td className="p-4 text-xs font-medium capitalize text-gray-600">{m.position}</td>
                                        <td className="p-4 text-center space-x-3">
                                            <button
                                                onClick={() => handleRestore(m.id)}
                                                className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition"
                                            >
                                                ♻️ Khôi phục
                                            </button>
                                            <button
                                                onClick={() => handleForceDelete(m.id)}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                                            >
                                                ❌ Xóa vĩnh viễn
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        Thùng rác Menu đang trống.
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
