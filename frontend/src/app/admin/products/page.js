// src/app/admin/products/page.js
'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form state cho việc thêm sản phẩm
    const [form, setForm] = useState({
        name: '',
        price: '',
        stock: '',
        category_id: ''
    });

    // 1. Tải danh sách sản phẩm và danh mục từ Backend
    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            setProducts(prodRes.data.data || prodRes.data);
            setCategories(catRes.data.data || catRes.data);
        } catch (err) {
            console.error("Lỗi tải dữ liệu sản phẩm:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Thêm sản phẩm mới
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/products', form);
            setForm({ name: '', price: '', stock: '', category_id: '' });
            fetchData();
            alert('Thêm sản phẩm thành công!');
        } catch (err) {
            console.error("Lỗi thêm sản phẩm:", err);
            alert('Thêm sản phẩm thất bại, hãy kiểm tra lại thông tin!');
        } finally {
            setLoading(false);
        }
    };

    // 3. Xóa sản phẩm
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchData();
        } catch (err) {
            console.error("Lỗi xóa sản phẩm:", err);
            alert('Xóa sản phẩm thất bại!');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Sản phẩm</h2>

            {/* Form thêm sản phẩm */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    placeholder="Tên sản phẩm..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    placeholder="Giá tiền..."
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    placeholder="Số lượng tồn kho..."
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <div className="md:col-span-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : '+ Thêm sản phẩm'}
                    </button>
                </div>
            </form>

            {/* Bảng hiển thị sản phẩm */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <th className="p-4">ID</th>
                            <th className="p-4">Tên sản phẩm</th>
                            <th className="p-4">Giá tiền</th>
                            <th className="p-4">Tồn kho</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                        {products.length > 0 ? (
                            products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="p-4">#{p.id}</td>
                                    <td className="p-4 font-medium text-gray-900">{p.name}</td>
                                    <td className="p-4 text-blue-600 font-semibold">{p.price} đ</td>
                                    <td className="p-4">{p.stock}</td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-500">
                                    Chưa có sản phẩm nào trong cơ sở dữ liệu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}