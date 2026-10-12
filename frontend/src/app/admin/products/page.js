// src/app/admin/products/page.js
'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [trashProducts, setTrashProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [activeTab, setActiveTab] = useState('list'); // 'list' hoặc 'trash'
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const router = useRouter();

    // Form state
    const [form, setForm] = useState({
        name: '',
        price: '',
        sale_price: '',
        stock: '',
        category_id: '',
        brand_id: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);

    // 1. Tải danh sách sản phẩm (có phân trang), danh mục, thương hiệu và thùng rác
    const fetchData = async (page = 1) => {
        try {
            const [prodRes, catRes, brandRes, trashRes] = await Promise.all([
                api.get(`/products?page=${page}&per_page=10`),
                api.get('/categories?limit=100'),
                api.get('/brands'),
                api.get('/products/trash').catch(() => ({ data: { data: [] } }))
            ]);
            setProducts(prodRes.data.data || prodRes.data || []);
            if (prodRes.data.meta) {
                setPagination({
                    current_page: prodRes.data.meta.current_page,
                    last_page: prodRes.data.meta.last_page,
                    total: prodRes.data.meta.total,
                });
            } else if (prodRes.data.current_page) {
                setPagination({
                    current_page: prodRes.data.current_page,
                    last_page: prodRes.data.last_page,
                    total: prodRes.data.total,
                });
            }
            setCategories(catRes.data.data || catRes.data || []);
            setBrands(brandRes.data.data || brandRes.data || []);
            setTrashProducts(trashRes.data.data || trashRes.data || []);
        } catch (err) {
            console.error("Lỗi tải dữ liệu sản phẩm:", err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                router.push('/admin/login');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Thêm hoặc Sửa sản phẩm (sử dụng FormData để gửi kèm file ảnh)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ràng buộc nghiệp vụ: Giá khuyến mãi phải nhỏ hơn giá gốc
        if (form.sale_price && Number(form.sale_price) >= Number(form.price)) {
            alert('Giá khuyến mãi phải nhỏ hơn giá bán gốc của sản phẩm!');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('price', form.price);
            if (form.sale_price) formData.append('sale_price', form.sale_price);
            if (form.stock) formData.append('stock', form.stock);
            if (form.category_id) formData.append('category_id', form.category_id);
            if (form.brand_id) formData.append('brand_id', form.brand_id);
            if (form.description) formData.append('description', form.description);
            if (imageFile) formData.append('image', imageFile);

            if (editId) {
                formData.append('_method', 'PUT');
                await api.post(`/products/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Cập nhật sản phẩm thành công!');
                setEditId(null);
            } else {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Thêm sản phẩm thành công!');
            }

            setForm({
                name: '',
                price: '',
                sale_price: '',
                stock: '',
                category_id: '',
                brand_id: '',
                description: ''
            });
            setImageFile(null);
            fetchData();
        } catch (err) {
            console.error("Lỗi lưu sản phẩm:", err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm!');
        } finally {
            setLoading(false);
        }
    };

    // Đổ dữ liệu lên form để Sửa
    const handleEditClick = (p) => {
        setEditId(p.id);
        setForm({
            name: p.name || '',
            price: p.price || '',
            sale_price: p.sale_price || '',
            stock: p.stock || '',
            category_id: p.category_id || (p.category?.id || ''),
            brand_id: p.brand_id || (p.brand?.id || ''),
            description: p.description || ''
        });
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setForm({
            name: '',
            price: '',
            sale_price: '',
            stock: '',
            category_id: '',
            brand_id: '',
            description: ''
        });
        setImageFile(null);
    };

    // 3. Xóa tạm thời (Chuyển vào thùng rác - Soft Delete)
    const handleDelete = async (id) => {
        if (!confirm('Chuyển sản phẩm này vào thùng rác?')) return;
        try {
            await api.delete(`/products/${id}`);
            alert('Đã chuyển sản phẩm vào thùng rác!');
            fetchData();
        } catch (err) {
            console.error("Lỗi xóa sản phẩm:", err);
            alert('Xóa sản phẩm thất bại!');
        }
    };

    // 4. Khôi phục sản phẩm từ thùng rác (Restore)
    const handleRestore = async (id) => {
        try {
            await api.post(`/products/${id}/restore`);
            alert('Đã khôi phục sản phẩm thành công!');
            fetchData();
        } catch (err) {
            console.error("Lỗi khôi phục sản phẩm:", err);
            alert('Khôi phục sản phẩm thất bại!');
        }
    };

    // 5. Xóa vĩnh viễn sản phẩm (Force Delete)
    const handleForceDelete = async (id) => {
        if (!confirm('CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn sản phẩm và không thể khôi phục lại! Bạn chắc chắn chứ?')) return;
        try {
            await api.delete(`/products/${id}/force-delete`);
            alert('Đã xóa vĩnh viễn sản phẩm!');
            fetchData();
        } catch (err) {
            console.error("Lỗi xóa vĩnh viễn:", err);
            alert('Xóa vĩnh viễn thất bại!');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header và Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h2>
                <div className="flex items-center gap-2 bg-gray-200 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === 'list'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        📦 Tất cả ({products.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('trash')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === 'trash'
                                ? 'bg-red-500 text-white shadow-sm'
                                : 'text-gray-600 hover:text-red-600'
                        }`}
                    >
                        🗑️ Thùng rác ({trashProducts.length})
                    </button>
                </div>
            </div>

            {/* TAB 1: DANH SÁCH & FORM THÊM/SỬA */}
            {activeTab === 'list' && (
                <>
                    {/* Form thêm / sửa sản phẩm */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-semibold text-gray-700">
                                {editId ? `✏️ Cập nhật sản phẩm #${editId}` : '➕ Thêm sản phẩm mới'}
                            </h3>
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
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Tên sản phẩm *</label>
                                <input
                                    type="text"
                                    placeholder="Tên sản phẩm..."
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Giá bán (VNĐ) *</label>
                                <input
                                    type="number"
                                    placeholder="Giá tiền..."
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Giá khuyến mãi (nếu có)</label>
                                <input
                                    type="number"
                                    placeholder="Giá sale..."
                                    value={form.sale_price}
                                    onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Danh mục *</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Thương hiệu</label>
                                <select
                                    value={form.brand_id}
                                    onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">-- Chọn thương hiệu --</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Số lượng tồn kho</label>
                                <input
                                    type="number"
                                    placeholder="Tồn kho..."
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Hình ảnh sản phẩm {editId && <span className="font-normal text-gray-400">(Bỏ qua nếu không đổi ảnh)</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
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
                                {loading ? 'Đang lưu...' : editId ? 'Lưu thay đổi' : '+ Thêm sản phẩm'}
                            </button>
                        </div>
                    </form>

                    {/* Bảng sản phẩm đang hoạt động */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Hình ảnh</th>
                                    <th className="p-4">Tên sản phẩm</th>
                                    <th className="p-4">Danh mục</th>
                                    <th className="p-4">Thương hiệu</th>
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
                                            <td className="p-4">
                                                {p.image ? (
                                                    <img
                                                        src={`http://127.0.0.1:8000${p.image}`}
                                                        alt={p.name}
                                                        className="w-12 h-12 object-cover rounded-lg border"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Chưa có ảnh</span>
                                                )}
                                            </td>
                                            <td className="p-4 font-semibold text-gray-900">{p.name}</td>
                                            <td className="p-4 text-gray-600">{p.category?.name || '---'}</td>
                                            <td className="p-4 text-gray-600">{p.brand?.name || '---'}</td>
                                            <td className="p-4">
                                                {p.sale_price ? (
                                                    <div>
                                                        <span className="text-red-600 font-bold block">{Number(p.sale_price).toLocaleString('vi-VN')} đ</span>
                                                        <span className="text-xs text-gray-400 line-through">{Number(p.price).toLocaleString('vi-VN')} đ</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-blue-600 font-semibold">{Number(p.price).toLocaleString('vi-VN')} đ</span>
                                                )}
                                            </td>
                                            <td className="p-4">{p.stock ?? 0}</td>
                                            <td className="p-4 text-center space-x-3">
                                                <button
                                                    onClick={() => handleEditClick(p)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
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
                                        <td colSpan="8" className="p-6 text-center text-gray-500">
                                            Chưa có sản phẩm nào trong cơ sở dữ liệu.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Thanh phân trang Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 border-t border-gray-200 gap-3">
                                <span className="text-sm text-gray-600">
                                    Trang <span className="font-semibold">{pagination.current_page}</span> / <span className="font-semibold">{pagination.last_page}</span> (Tổng {pagination.total} sản phẩm)
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

            {/* TAB 2: THÙNG RÁC SẢN PHẨM (TRASH) */}
            {activeTab === 'trash' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-red-800">
                            🗑️ Danh sách sản phẩm đã xóa tạm thời (Có thể khôi phục lại hoặc xóa vĩnh viễn)
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
                                <th className="p-4">Hình ảnh</th>
                                <th className="p-4">Tên sản phẩm</th>
                                <th className="p-4">Giá tiền</th>
                                <th className="p-4">Ngày xóa</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                            {trashProducts.length > 0 ? (
                                trashProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-red-50/30">
                                        <td className="p-4 text-gray-500">#{p.id}</td>
                                        <td className="p-4">
                                            {p.image ? (
                                                <img
                                                    src={`http://127.0.0.1:8000${p.image}`}
                                                    alt={p.name}
                                                    className="w-12 h-12 object-cover rounded-lg border opacity-60"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Chưa có ảnh</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium text-gray-700 line-through">{p.name}</td>
                                        <td className="p-4 text-gray-500">{Number(p.price).toLocaleString('vi-VN')} đ</td>
                                        <td className="p-4 text-xs text-gray-400">
                                            {p.deleted_at ? new Date(p.deleted_at).toLocaleString('vi-VN') : 'Mới xóa'}
                                        </td>
                                        <td className="p-4 text-center space-x-3">
                                            <button
                                                onClick={() => handleRestore(p.id)}
                                                className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-xs font-semibold transition"
                                            >
                                                🔄 Khôi phục
                                            </button>
                                            <button
                                                onClick={() => handleForceDelete(p.id)}
                                                className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-semibold transition"
                                            >
                                                ❌ Xóa vĩnh viễn
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-gray-400">
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