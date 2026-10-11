// src/app/admin/orders/page.js
'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 1. Tải danh sách đơn hàng từ API
    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data || res.data || []);
        } catch (err) {
            console.error("Lỗi tải đơn hàng:", err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                router.push('/admin/login');
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // 2. Cập nhật trạng thái đơn hàng
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            alert('Cập nhật trạng thái đơn hàng thành công!');
            fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
            alert('Cập nhật trạng thái thất bại!');
        }
    };

    // 3. Xem chi tiết đơn hàng
    const handleViewDetail = async (id) => {
        setLoading(true);
        try {
            const res = await api.get(`/orders/${id}`);
            setSelectedOrder(res.data.data || res.data);
        } catch (err) {
            console.error("Lỗi lấy chi tiết đơn hàng:", err);
            alert('Không thể tải chi tiết đơn hàng!');
        } finally {
            setLoading(false);
        }
    };

    const statusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Đã giao</span>;
            case 'processing':
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Đang giao</span>;
            case 'cancelled':
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Đã hủy</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Chờ xử lý</span>;
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đơn hàng</h2>

            {/* Bảng danh sách đơn hàng */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <th className="p-4">Mã đơn</th>
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Số điện thoại</th>
                            <th className="p-4">Tổng tiền</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Ngày đặt</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                        {orders.length > 0 ? (
                            orders.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-semibold text-gray-900">#{o.id}</td>
                                    <td className="p-4 font-medium">{o.customer_name}</td>
                                    <td className="p-4 text-gray-500">{o.customer_phone}</td>
                                    <td className="p-4 font-semibold text-blue-600">
                                        {Number(o.total_price).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={o.status}
                                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                            className="border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="pending">Chờ xử lý</option>
                                            <option value="processing">Đang giao</option>
                                            <option value="completed">Đã giao</option>
                                            <option value="cancelled">Đã hủy</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs">
                                        {new Date(o.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleViewDetail(o.id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                                        >
                                            👁️ Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-gray-400">
                                    Chưa có đơn hàng nào trong hệ thống.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Chi tiết Đơn hàng #{selectedOrder.id}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    Đặt lúc: {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Thông tin người nhận */}
                        <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <span className="text-gray-500 font-medium">Người nhận: </span>
                                <span className="font-semibold text-gray-800">{selectedOrder.customer_name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 font-medium">Số điện thoại: </span>
                                <span className="font-semibold text-gray-800">{selectedOrder.customer_phone}</span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-gray-500 font-medium">Địa chỉ giao: </span>
                                <span className="text-gray-800">{selectedOrder.customer_address}</span>
                            </div>
                            {selectedOrder.note && (
                                <div className="md:col-span-2">
                                    <span className="text-gray-500 font-medium">Ghi chú: </span>
                                    <span className="text-gray-600 italic">"{selectedOrder.note}"</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 font-medium">Trạng thái hiện tại: </span>
                                {statusBadge(selectedOrder.status)}
                            </div>
                        </div>

                        {/* Danh sách sản phẩm mua */}
                        <h4 className="font-semibold text-gray-700 text-sm mb-3">Sản phẩm trong đơn:</h4>
                        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                    <tr>
                                        <th className="p-3">Sản phẩm</th>
                                        <th className="p-3 text-center">Số lượng</th>
                                        <th className="p-3 text-right">Đơn giá</th>
                                        <th className="p-3 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="p-3 font-medium text-gray-800">{item.product_name}</td>
                                                <td className="p-3 text-center text-gray-600">x{item.quantity}</td>
                                                <td className="p-3 text-right text-gray-600">
                                                    {Number(item.price).toLocaleString('vi-VN')} đ
                                                </td>
                                                <td className="p-3 text-right font-semibold text-gray-900">
                                                    {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} đ
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-center text-gray-400">
                                                Không có dữ liệu chi tiết
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Tổng tiền & Đóng */}
                        <div className="flex items-center justify-between border-t pt-4">
                            <span className="text-base font-bold text-gray-800">
                                Tổng cộng: <span className="text-blue-600 text-xl">{Number(selectedOrder.total_price).toLocaleString('vi-VN')} đ</span>
                            </span>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-900 transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}