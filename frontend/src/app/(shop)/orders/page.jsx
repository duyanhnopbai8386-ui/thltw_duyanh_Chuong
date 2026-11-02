'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchPhone, setSearchPhone] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);

    // 1. Tải danh sách đơn hàng
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            setIsLoggedIn(!!token);

            if (token) {
                // Người dùng đã đăng nhập -> Lấy đơn hàng theo tài khoản
                const res = await fetch('http://127.0.0.1:8000/api/my-orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();
                if (res.ok && data.data) {
                    setOrders(data.data);
                    setLoading(false);
                    return;
                }
            }

            // Khách chưa đăng nhập -> Lấy các đơn hàng vừa đặt trên trình duyệt này
            const guestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
            const savedPhone = localStorage.getItem('last_customer_phone');

            if (guestOrders.length > 0) {
                const res = await fetch(`http://127.0.0.1:8000/api/orders/lookup?ids=${guestOrders.join(',')}`);
                const data = await res.json();
                setOrders(data.data || []);
            } else if (savedPhone) {
                setSearchPhone(savedPhone);
                const res = await fetch(`http://127.0.0.1:8000/api/orders/lookup?phone=${savedPhone}`);
                const data = await res.json();
                setOrders(data.data || []);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("Lỗi tải đơn hàng:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Hủy đơn hàng khi còn đang chờ xử lý (pending)
    const handleCancelOrder = async (orderId) => {
        if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId}?`)) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: { 'Accept': 'application/json' },
            });
            const data = await res.json();
            if (res.ok) {
                alert('Đã hủy đơn hàng thành công!');
                fetchOrders();
            } else {
                alert(data.message || 'Không thể hủy đơn hàng này!');
            }
        } catch (err) {
            alert('Lỗi kết nối khi hủy đơn!');
        }
    };

    // 2. Tra cứu đơn hàng theo số điện thoại
    const handleSearchByPhone = async (e) => {
        e.preventDefault();
        if (!searchPhone.trim()) {
            fetchOrders();
            return;
        }

        setSearchLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/orders/lookup?phone=${encodeURIComponent(searchPhone.trim())}`);
            const data = await res.json();
            setOrders(data.data || []);
        } catch (err) {
            console.error("Lỗi tra cứu đơn hàng:", err);
            alert("Không thể tra cứu đơn hàng lúc này!");
        } finally {
            setSearchLoading(false);
        }
    };

    const statusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Đã giao thành công</span>;
            case 'processing':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Đang giao hàng</span>;
            case 'cancelled':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Đã hủy</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Chờ xác nhận</span>;
        }
    };

    return (
        <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lịch sử đơn hàng</h1>
                        <p className="text-sm text-gray-500 mt-1">Theo dõi trạng thái và chi tiết các đơn hàng của bạn</p>
                    </div>
                    <Link
                        href="/products"
                        className="self-start sm:self-auto bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>

                {/* Banner nhắc đăng nhập nếu là khách vãng lai */}
                {!isLoggedIn && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-blue-800">
                        <div className="flex items-center gap-2">
                            <span>💡</span>
                            <span>Bạn đang xem đơn hàng với tư cách <strong>Khách</strong>. Đăng nhập để lưu và quản lý đơn hàng vĩnh viễn.</span>
                        </div>
                        <Link 
                            href="/login" 
                            className="bg-blue-600 text-white font-medium px-4 py-1.5 rounded-xl text-xs hover:bg-blue-700 transition self-start sm:self-auto shrink-0"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                )}

                {/* Thanh tra cứu đơn hàng theo Số điện thoại */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
                    <form onSubmit={handleSearchByPhone} className="flex flex-col sm:flex-row gap-3 items-center">
                        <div className="relative flex-1 w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            <input
                                type="tel"
                                placeholder="Nhập số điện thoại người nhận để tra cứu đơn..."
                                value={searchPhone}
                                onChange={(e) => setSearchPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={searchLoading}
                            className="w-full sm:w-auto bg-[#0071e3] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0077ED] transition shrink-0 disabled:opacity-50"
                        >
                            {searchLoading ? 'Đang tìm...' : 'Tra cứu đơn'}
                        </button>
                    </form>
                </div>

                {/* Danh sách đơn hàng */}
                {loading ? (
                    <div className="text-center py-16 text-gray-400">Đang tải thông tin đơn hàng...</div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-4 gap-2">
                                    <div>
                                        <span className="font-bold text-gray-900 text-base">Đơn hàng #{order.id}</span>
                                        <span className="text-xs text-gray-400 ml-3">
                                            {new Date(order.created_at).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {order.payment_method === 'bank_transfer' ? (
                                            <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                                🏦 Chuyển khoản QR
                                            </span>
                                        ) : order.payment_method === 'momo' ? (
                                            <span className="text-[11px] font-semibold bg-pink-50 text-pink-700 border border-pink-200 px-2.5 py-0.5 rounded-full">
                                                👛 Ví MoMo
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                                                💵 Tiền mặt (COD)
                                            </span>
                                        )}
                                        {statusBadge(order.status)}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 mb-4 space-y-1">
                                    <p><span className="text-gray-400">Người nhận:</span> <span className="font-medium text-gray-800">{order.customer_name}</span> ({order.customer_phone})</p>
                                    <p><span className="text-gray-400">Địa chỉ:</span> {order.customer_address}</p>
                                    {order.note && <p><span className="text-gray-400">Ghi chú:</span> {order.note}</p>}
                                </div>

                                {/* Danh sách sản phẩm trong đơn */}
                                <div className="bg-gray-50 rounded-2xl p-4 divide-y divide-gray-200 text-sm mb-4">
                                    {order.items && order.items.map((item) => (
                                        <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-800">{item.product_name}</p>
                                                <p className="text-xs text-gray-400">Số lượng: x{item.quantity}</p>
                                            </div>
                                            <span className="font-semibold text-gray-900">
                                                {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
                                    <div>
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-xl transition shadow-sm active:scale-95"
                                            >
                                                ✕ Hủy đơn hàng này
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm text-gray-500 mr-2">Tổng thanh toán:</span>
                                        <span className="text-xl font-bold text-blue-600">
                                            {Number(order.total_price).toLocaleString('vi-VN')} đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <span className="text-4xl mb-4 block">📦</span>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa tìm thấy đơn hàng nào</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Nếu bạn đã từng đặt hàng, vui lòng thử nhập số điện thoại người nhận vào ô tra cứu ở trên.
                        </p>
                        <Link
                            href="/products"
                            className="bg-[#0071e3] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#0077ED] transition"
                        >
                            Khám phá sản phẩm
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
