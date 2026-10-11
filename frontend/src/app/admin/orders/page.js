// src/app/admin/orders/page.js
'use client';
import { useState } from 'react';

export default function AdminOrdersPage() {
    const [orders] = useState([
        { id: 101, customer: 'Nguyễn Văn A', total: '1.200.000 đ', status: 'Đang xử lý', date: '2026-10-05' },
        { id: 102, customer: 'Trần Thị B', total: '450.000 đ', status: 'Đã giao', date: '2026-10-04' },
        { id: 103, customer: 'Lê Văn C', total: '2.300.000 đ', status: 'Đã hủy', date: '2026-10-03' },
    ]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đơn hàng</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <th className="p-4">Mã đơn</th>
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Tổng tiền</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Ngày đặt</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">#{o.id}</td>
                                <td className="p-4">{o.customer}</td>
                                <td className="p-4 font-semibold text-blue-600">{o.total}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        o.status === 'Đã giao' ? 'bg-green-100 text-green-700' :
                                        o.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">{o.date}</td>
                                <td className="p-4 text-center">
                                    <button className="text-blue-600 hover:underline">Chi tiết</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}