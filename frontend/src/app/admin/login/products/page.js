'use client';
import { useEffect, useState } from 'react';
import api from '@/app/services/api';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Lỗi tải sản phẩm:", err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Tên sản phẩm</th>
                        <th className="border p-2">Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td className="border p-2 text-center">{p.id}</td>
                            <td className="border p-2">{p.name}</td>
                            <td className="border p-2">{p.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}