'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Tải danh sách đơn hàng đã đặt từ API
        fetch('http://127.0.0.1:8000/api/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải đơn hàng:", err);
                setLoading(false);
            });
    }, []);

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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lịch sử đơn hàng</h1>
                        <p className="text-sm text-gray-500 mt-1">Theo dõi trạng thái các đơn hàng bạn đã đặt</p>
                    </div>
                    <Link
                        href="/products"
                        className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-gray-400">Đang tải đơn hàng...</div>
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
                                    <div>{statusBadge(order.status)}</div>
                                </div>

                                <div className="text-sm text-gray-600 mb-4 space-y-1">
                                    <p><span className="text-gray-400">Người nhận:</span> <span className="font-medium text-gray-800">{order.customer_name}</span> ({order.customer_phone})</p>
                                    <p><span className="text-gray-400">Địa chỉ:</span> {order.customer_address}</p>
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

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm text-gray-500">Tổng thanh toán:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {Number(order.total_price).toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <span className="text-4xl mb-4 block">📦</span>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Bạn chưa có đơn hàng nào</h3>
                        <p className="text-sm text-gray-500 mb-6">Hãy dạo quanh cửa hàng và chọn những sản phẩm bạn ưng ý nhất nhé!</p>
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
