'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // State xem chi tiết User & Đơn hàng của User trên cùng 1 trang
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const router = useRouter();

    // 1. Tải danh sách người dùng
    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                per_page: 10,
            });
            if (search) params.append('search', search);
            if (roleFilter) params.append('role', roleFilter);
            if (statusFilter) params.append('status', statusFilter);

            const res = await api.get(`/users?${params.toString()}`);
            setUsers(res.data.data || []);
            if (res.data.pagination) {
                setPagination(res.data.pagination);
            }
        } catch (err) {
            console.error('Lỗi tải danh sách người dùng:', err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                router.push('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, [roleFilter, statusFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchUsers(1);
    };

    // 2. Xem chi tiết người dùng và danh sách đơn hàng của người đó (cùng trang)
    const handleViewUserDetail = async (userId) => {
        setLoadingDetail(true);
        try {
            const res = await api.get(`/users/${userId}`);
            setSelectedUser(res.data.data);
            // Cuộn mượt xuống phần chi tiết
            setTimeout(() => {
                const el = document.getElementById('user-detail-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            console.error('Lỗi tải chi tiết người dùng:', err);
            alert('Không thể tải chi tiết người dùng!');
        } finally {
            setLoadingDetail(false);
        }
    };

    // 3. Khóa / Mở khóa tài khoản (Block / Unblock)
    const handleToggleStatus = async (user) => {
        const actionText = user.status === 'blocked' ? 'MỞ KHÓA' : 'KHÓA';
        if (!confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của "${user.name}" (${user.email})?`)) {
            return;
        }

        try {
            const res = await api.put(`/users/${user.id}/toggle-status`);
            alert(res.data.message);
            
            // Cập nhật state danh sách
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, status: res.data.data.status } : u))
            );

            // Cập nhật luôn nếu đang mở chi tiết user đó
            if (selectedUser?.id === user.id) {
                setSelectedUser((prev) => ({ ...prev, status: res.data.data.status }));
            }
        } catch (err) {
            console.error('Lỗi khóa/mở khóa:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi thực hiện thao tác!');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header trang */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">👥 Quản lý Người dùng</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Theo dõi tài khoản khách hàng, kiểm soát quyền truy cập và lịch sử mua sắm.
                    </p>
                </div>

                {/* Ghi chú chuẩn thực tế doanh nghiệp */}
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                    <span>💡</span>
                    <span>Tài khoản người dùng được tạo tự động khi khách hàng đăng ký trên website.</span>
                </div>
            </div>

            {/* Thanh tìm kiếm & Bộ lọc */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-3 items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo Tên, Email hoặc Số điện thoại..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
                    >
                        Tìm kiếm
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={() => { setSearch(''); fetchUsers(1); }}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-xl transition"
                        >
                            Xóa lọc
                        </button>
                    )}
                </form>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="user">Khách hàng</option>
                        <option value="admin">Quản trị viên</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="blocked">Đã bị khóa</option>
                    </select>
                </div>
            </div>

            {/* BẢNG DANH SÁCH NGƯỜI DÙNG */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                            <th className="p-4">ID</th>
                            <th className="p-4">Thông tin người dùng</th>
                            <th className="p-4">Vai trò</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Số đơn hàng</th>
                            <th className="p-4">Tổng chi tiêu</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-gray-500">
                                    Đang tải danh sách người dùng...
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((u) => {
                                const isBlocked = u.status === 'blocked';
                                const isSelected = selectedUser?.id === u.id;
                                return (
                                    <tr
                                        key={u.id}
                                        className={`hover:bg-gray-50 transition ${
                                            isSelected ? 'bg-blue-50/60' : ''
                                        }`}
                                    >
                                        <td className="p-4 font-bold text-gray-800">#{u.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                                    {u.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                    {u.phone && (
                                                        <div className="text-xs text-gray-400">📞 {u.phone}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {u.role === 'admin' ? (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                                                    👑 Quản trị viên
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                    Khách hàng
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {isBlocked ? (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                                    🔒 Đã bị khóa
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                                    🟢 Hoạt động
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 font-semibold text-gray-800">
                                            {u.orders_count ?? 0} đơn
                                        </td>
                                        <td className="p-4 font-bold text-blue-600">
                                            {Number(u.orders_sum_total_price || 0).toLocaleString('vi-VN')} đ
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Nút Xem chi tiết & Lịch sử đơn hàng */}
                                                <button
                                                    onClick={() => handleViewUserDetail(u.id)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                                        isSelected
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                    }`}
                                                >
                                                    {isSelected ? 'Đang xem' : '👁️ Xem đơn hàng'}
                                                </button>

                                                {/* Nút Khóa / Mở khóa tài khoản */}
                                                <button
                                                    onClick={() => handleToggleStatus(u)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                                        isBlocked
                                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    }`}
                                                    title={isBlocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                                                >
                                                    {isBlocked ? '🔓 Mở khóa' : '🔒 Khóa (Block)'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-gray-500">
                                    Không tìm thấy người dùng nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Thanh phân trang Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 border-t border-gray-200 gap-3">
                        <span className="text-sm text-gray-600">
                            Trang <span className="font-semibold">{pagination.current_page}</span> / <span className="font-semibold">{pagination.last_page}</span> (Tổng {pagination.total} người dùng)
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                disabled={pagination.current_page <= 1}
                                onClick={() => fetchUsers(pagination.current_page - 1)}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                            >
                                ← Trước
                            </button>
                            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pg) => (
                                <button
                                    key={pg}
                                    onClick={() => fetchUsers(pg)}
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
                                onClick={() => fetchUsers(pagination.current_page + 1)}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                            >
                                Sau →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* KHUNG CHI TIẾT NGƯỜI DÙNG & DANH SÁCH ĐƠN HÀNG CỦA HỌ (TRÊN CÙNG 1 TRANG) */}
            {selectedUser && (
                <div id="user-detail-section" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                                Chi tiết khách hàng & Lịch sử đơn hàng
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mt-2">
                                {selectedUser.name} <span className="text-sm font-normal text-gray-500">({selectedUser.email})</span>
                            </h3>
                        </div>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                            ✕ Đóng xem chi tiết
                        </button>
                    </div>

                    {/* Thẻ thống kê nhanh của User */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-xs text-gray-500">Mã khách hàng</div>
                            <div className="text-lg font-bold text-gray-800 mt-1">#{selectedUser.id}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-xs text-gray-500">Trạng thái tài khoản</div>
                            <div className="text-lg font-bold mt-1">
                                {selectedUser.status === 'blocked' ? (
                                    <span className="text-red-600">🔒 Đã bị khóa</span>
                                ) : (
                                    <span className="text-green-600">🟢 Hoạt động</span>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-xs text-gray-500">Tổng số đơn đã đặt</div>
                            <div className="text-lg font-bold text-indigo-600 mt-1">
                                {selectedUser.orders_count || selectedUser.orders?.length || 0} đơn
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-xs text-gray-500">Tổng tiền đã thanh toán</div>
                            <div className="text-lg font-bold text-blue-600 mt-1">
                                {Number(selectedUser.orders_sum_total_price || 0).toLocaleString('vi-VN')} đ
                            </div>
                        </div>
                    </div>

                    {/* BẢNG LỊCH SỬ ĐƠN HÀNG CỦA USER */}
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-3">
                            📦 Danh sách các đơn hàng đã đặt:
                        </h4>

                        {selectedUser.orders && selectedUser.orders.length > 0 ? (
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase font-semibold">
                                            <th className="p-3">Mã đơn</th>
                                            <th className="p-3">Ngày đặt</th>
                                            <th className="p-3">Địa chỉ giao</th>
                                            <th className="p-3">Sản phẩm mua</th>
                                            <th className="p-3">Tổng tiền</th>
                                            <th className="p-3">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-gray-700">
                                        {selectedUser.orders.map((order) => {
                                            const statusMap = {
                                                pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
                                                processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
                                                completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
                                                cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
                                            };
                                            const st = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };

                                            return (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="p-3 font-bold text-gray-900">#{order.id}</td>
                                                    <td className="p-3 text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td className="p-3 text-gray-600 max-w-xs truncate" title={order.customer_address}>
                                                        {order.customer_address || '---'}
                                                    </td>
                                                    <td className="p-3">
                                                        {order.items && order.items.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {order.items.map((it, idx) => (
                                                                    <div key={idx} className="text-gray-800">
                                                                        • {it.product?.name || 'Sản phẩm'} <span className="text-gray-500">x{it.quantity}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">---</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 font-bold text-blue-600">
                                                        {Number(order.total_price).toLocaleString('vi-VN')} đ
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${st.color}`}>
                                                            {st.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-500 text-sm">
                                Khách hàng này chưa phát sinh đơn hàng nào.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
