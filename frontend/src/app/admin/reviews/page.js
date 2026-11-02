'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/app/services/api';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Chế độ xem: 'user' (Gộp theo tài khoản), 'product' (Gộp theo sản phẩm - idsp), 'all' (Tất cả review)
    const [viewMode, setViewMode] = useState('user');

    // Bộ lọc & Tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState('');

    // Modal chi tiết
    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        type: 'user', // 'user' hoặc 'product'
        title: '',
        subtitle: '',
        avatar: '',
        reviews: [],
        avgRating: 0,
        groupKey: '',
    });

    // 1. Tải danh sách sản phẩm để hỗ trợ lọc
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products?per_page=100');
                setProducts(res.data?.data || []);
            } catch (err) {
                console.error("Lỗi tải sản phẩm:", err);
            }
        };
        fetchProducts();
    }, []);

    // 2. Tải toàn bộ đánh giá từ backend
    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedProductId) params.append('product_id', selectedProductId);
            if (selectedRating) params.append('rating', selectedRating);
            if (selectedStatus !== '') params.append('status', selectedStatus);
            params.append('per_page', '300'); // Tải tối đa để hỗ trợ gộp nhóm

            const res = await api.get(`/admin/reviews?${params.toString()}`);
            const list = res.data?.data || [];
            setReviews(list);

            // Nếu modal đang mở, đồng bộ lại dữ liệu trong modal
            if (detailModal.isOpen) {
                const currentKey = detailModal.groupKey;
                const currentType = detailModal.type;

                const updatedReviews = list.filter(r => {
                    if (currentType === 'user') {
                        const key = (r.user_email || r.user_name || 'Khách vãng lai').toLowerCase().trim();
                        return key === currentKey;
                    } else {
                        return String(r.product_id) === String(currentKey);
                    }
                });

                if (updatedReviews.length > 0) {
                    const avg = (updatedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / updatedReviews.length).toFixed(1);
                    setDetailModal(prev => ({
                        ...prev,
                        reviews: updatedReviews,
                        avgRating: avg,
                    }));
                } else {
                    setDetailModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        } catch (err) {
            console.error("Lỗi tải đánh giá:", err);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProductId, selectedRating, selectedStatus, detailModal.isOpen, detailModal.groupKey, detailModal.type]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // 3. Ẩn / Hiện review
    const handleToggleStatus = async (id, e) => {
        if (e) e.stopPropagation();
        setActionLoadingId(id);
        try {
            await api.patch(`/reviews/${id}/status`);
            await fetchReviews();
        } catch (err) {
            alert('Không thể cập nhật trạng thái đánh giá!');
        } finally {
            setActionLoadingId(null);
        }
    };

    // 4. Xóa review
    const handleDeleteReview = async (id, e) => {
        if (e) e.stopPropagation();
        if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này vĩnh viễn?')) return;
        setActionLoadingId(id);
        try {
            await api.delete(`/reviews/${id}`);
            await fetchReviews();
        } catch (err) {
            alert('Không thể xóa đánh giá!');
        } finally {
            setActionLoadingId(null);
        }
    };

    // 5. Thống kê tổng quan (Metrics)
    const metrics = useMemo(() => {
        const total = reviews.length;
        if (total === 0) return { total: 0, userCount: 0, productCount: 0, avgRating: 0, activeCount: 0, hiddenCount: 0 };

        const usersSet = new Set(reviews.map(r => (r.user_email || r.user_name || '').toLowerCase().trim()));
        const productsSet = new Set(reviews.map(r => r.product_id));
        const sumRating = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
        const activeCount = reviews.filter(r => r.status).length;

        return {
            total,
            userCount: usersSet.size,
            productCount: productsSet.size,
            avgRating: (sumRating / total).toFixed(1),
            activeCount,
            hiddenCount: total - activeCount,
        };
    }, [reviews]);

    // 6. Danh sách sau khi lọc Search & Đã mua hàng
    const filteredReviews = useMemo(() => {
        return reviews.filter(r => {
            if (selectedBuyer === '1' && !r.is_buyer) return false;
            if (selectedBuyer === '0' && r.is_buyer) return false;
            if (!searchTerm.trim()) return true;
            const term = searchTerm.toLowerCase().trim();
            return (
                (r.user_name && r.user_name.toLowerCase().includes(term)) ||
                (r.user_email && r.user_email.toLowerCase().includes(term)) ||
                (r.comment && r.comment.toLowerCase().includes(term)) ||
                (r.product?.name && r.product.name.toLowerCase().includes(term))
            );
        });
    }, [reviews, searchTerm, selectedBuyer]);

    // 7. Nhóm theo TÀI KHOẢN / NGƯỜI DÙNG (Yêu cầu chính của User)
    const userGroups = useMemo(() => {
        const groups = {};
        filteredReviews.forEach(r => {
            const key = (r.user_email || r.user_name || 'Khách vãng lai').toLowerCase().trim();
            if (!groups[key]) {
                groups[key] = {
                    groupKey: key,
                    userName: r.user_name || 'Khách hàng',
                    userEmail: r.user_email || '',
                    userId: r.user_id,
                    reviews: [],
                };
            }
            groups[key].reviews.push(r);
        });

        return Object.values(groups).map(g => {
            const total = g.reviews.length;
            const avg = (g.reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / total).toFixed(1);
            const activeCount = g.reviews.filter(r => r.status).length;
            const latestReview = [...g.reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

            return {
                ...g,
                total,
                avgRating: avg,
                activeCount,
                hiddenCount: total - activeCount,
                latestReview,
            };
        }).sort((a, b) => b.total - a.total); // Sắp xếp tài khoản có nhiều đánh giá nhất lên đầu
    }, [filteredReviews]);

    // 8. Nhóm theo SẢN PHẨM (Yêu cầu trên bảng của Cô giáo: [idsp review])
    const productGroups = useMemo(() => {
        const groups = {};
        filteredReviews.forEach(r => {
            const pId = r.product_id;
            if (!groups[pId]) {
                groups[pId] = {
                    productId: pId,
                    groupKey: String(pId),
                    productName: r.product?.name || `Sản phẩm #${pId}`,
                    productImage: r.product?.image || '',
                    reviews: [],
                };
            }
            groups[pId].reviews.push(r);
        });

        return Object.values(groups).map(g => {
            const total = g.reviews.length;
            const avg = (g.reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / total).toFixed(1);
            const activeCount = g.reviews.filter(r => r.status).length;
            const latestReview = [...g.reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

            return {
                ...g,
                total,
                avgRating: avg,
                activeCount,
                hiddenCount: total - activeCount,
                latestReview,
            };
        }).sort((a, b) => b.total - a.total);
    }, [filteredReviews]);

    // Mở Modal chi tiết tài khoản
    const openUserDetail = (group) => {
        setDetailModal({
            isOpen: true,
            type: 'user',
            title: group.userName,
            subtitle: group.userEmail ? `${group.userEmail} ${group.userId ? `(User ID: #${group.userId})` : ''}` : 'Khách vãng lai',
            avatar: group.userName.charAt(0).toUpperCase(),
            reviews: group.reviews,
            avgRating: group.avgRating,
            groupKey: group.groupKey,
        });
    };

    // Mở Modal chi tiết sản phẩm
    const openProductDetail = (group) => {
        setDetailModal({
            isOpen: true,
            type: 'product',
            title: group.productName,
            subtitle: `Mã sản phẩm: #${group.productId}`,
            avatar: '📦',
            reviews: group.reviews,
            avgRating: group.avgRating,
            groupKey: group.groupKey,
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            
            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Quản lý Đánh giá & Chấm điểm (Reviews)
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Xem chi tiết đánh giá gộp theo từng tài khoản người dùng hoặc theo sản phẩm (idsp review).
                    </p>
                </div>

                {/* Chuyển đổi TAB chế độ hiển thị */}
                <div className="flex items-center p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => setViewMode('user')}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                            viewMode === 'user'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <span>👥</span>
                        <span>Theo Tài khoản ({userGroups.length})</span>
                    </button>
                    <button
                        onClick={() => setViewMode('product')}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                            viewMode === 'product'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <span>📦</span>
                        <span>Theo Sản phẩm ({productGroups.length})</span>
                    </button>
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                            viewMode === 'all'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <span>📋</span>
                        <span>Tất cả ({filteredReviews.length})</span>
                    </button>
                </div>
            </div>

            {/* 2. STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                        👥
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">{metrics.userCount}</div>
                        <div className="text-xs text-gray-500">Khách đánh giá</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-lg">
                        ★
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">{metrics.avgRating} / 5</div>
                        <div className="text-xs text-gray-500">Điểm trung bình</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                        💬
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900">{metrics.total}</div>
                        <div className="text-xs text-gray-500">Tổng lượt nhận xét</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                        🛡️
                    </div>
                    <div>
                        <div className="text-xl font-bold text-emerald-600">
                            {metrics.activeCount} <span className="text-xs font-normal text-gray-400">/ {metrics.hiddenCount} ẩn</span>
                        </div>
                        <div className="text-xs text-gray-500">Đang hiển thị</div>
                    </div>
                </div>
            </div>

            {/* 3. BỘ LỌC VÀ TÌM KIẾM */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Tìm kiếm */}
                    <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Tìm kiếm:
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tên khách, email, từ khóa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl pl-8 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">🔍</span>
                        </div>
                    </div>

                    {/* Lọc theo sản phẩm */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Sản phẩm:
                        </label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả sản phẩm ({products.length})</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    #{p.id} - {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lọc theo số sao */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Số sao:
                        </label>
                        <select
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả mức sao</option>
                            <option value="5">5 Sao (Tuyệt vời)</option>
                            <option value="4">4 Sao (Tốt)</option>
                            <option value="3">3 Sao (Bình thường)</option>
                            <option value="2">2 Sao (Chưa tốt)</option>
                            <option value="1">1 Sao (Tệ)</option>
                        </select>
                    </div>

                    {/* Lọc theo trạng thái */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Trạng thái:
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="1">Đang hiển thị</option>
                            <option value="0">Đang ẩn</option>
                        </select>
                    </div>

                    {/* Lọc theo xác thực mua hàng */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Xác thực mua:
                        </label>
                        <select
                            value={selectedBuyer}
                            onChange={(e) => setSelectedBuyer(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả đánh giá</option>
                            <option value="1">✓ Đã mua hàng</option>
                            <option value="0">Khách trải nghiệm</option>
                        </select>
                    </div>
                </div>

                {(searchTerm || selectedProductId || selectedRating || selectedStatus !== '' || selectedBuyer !== '') && (
                    <div className="flex justify-end pt-2 border-t border-gray-50">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedProductId('');
                                setSelectedRating('');
                                setSelectedStatus('');
                                setSelectedBuyer('');
                            }}
                            className="text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-lg font-medium transition"
                        >
                            ✕ Xóa toàn bộ bộ lọc
                        </button>
                    </div>
                )}
            </div>

            {/* 4. NỘI DUNG HIỂN THỊ CHÍNH THEO TAB ĐÃ CHỌN */}

            {/* TAB 1: GỘP THEO TÀI KHOẢN / NGƯỜI DÙNG */}
            {viewMode === 'user' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="text-xs font-semibold text-gray-700">
                            Danh sách người dùng đã đánh giá ({userGroups.length} tài khoản)
                        </div>
                        <span className="text-[11px] text-gray-500">
                            Nhấn <strong className="text-blue-600 font-semibold">"Xem chi tiết"</strong> để mở toàn bộ đánh giá của mỗi người
                        </span>
                    </div>

                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200/80 text-gray-600 uppercase font-semibold text-[11px] tracking-wider">
                            <tr>
                                <th className="p-4 w-12 text-center">STT</th>
                                <th className="p-4 w-60">Khách hàng / Tài khoản</th>
                                <th className="p-4 w-36 text-center">Số lượng đánh giá</th>
                                <th className="p-4 w-40 text-center">Điểm trung bình</th>
                                <th className="p-4">Đánh giá gần nhất</th>
                                <th className="p-4 w-36 text-center">Trạng thái</th>
                                <th className="p-4 w-36 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-400">
                                        Đang tải dữ liệu đánh giá...
                                    </td>
                                </tr>
                            ) : userGroups.length > 0 ? (
                                userGroups.map((group, idx) => (
                                    <tr 
                                        key={group.groupKey}
                                        onClick={() => openUserDetail(group)}
                                        className="hover:bg-blue-50/40 cursor-pointer transition"
                                    >
                                        <td className="p-4 text-center font-mono text-gray-400">
                                            #{idx + 1}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                                                    {group.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 hover:text-blue-600 transition">
                                                        {group.userName}
                                                    </div>
                                                    {group.userEmail ? (
                                                        <div className="text-[11px] text-gray-500 font-normal">
                                                            {group.userEmail}
                                                        </div>
                                                    ) : (
                                                        <div className="text-[11px] text-gray-400 italic">Chưa có email</div>
                                                    )}
                                                    {group.userId && (
                                                        <span className="inline-block mt-0.5 text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
                                                            UID #{group.userId}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                💬 {group.total} đánh giá
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1 text-amber-500 text-sm font-bold">
                                                <span>★</span>
                                                <span>{group.avgRating}</span>
                                                <span className="text-gray-400 text-[10px] font-normal">/ 5</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {group.latestReview ? (
                                                <div className="max-w-md">
                                                    <div className="text-[11px] font-medium text-gray-800 line-clamp-1">
                                                        📦 {group.latestReview.product?.name || `Sản phẩm #${group.latestReview.product_id}`}
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 line-clamp-1 italic mt-0.5">
                                                        "{group.latestReview.comment}"
                                                    </p>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(group.latestReview.created_at).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">---</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="text-[11px] space-y-0.5">
                                                <span className="inline-block bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                                                    {group.activeCount} hiện
                                                </span>
                                                {group.hiddenCount > 0 && (
                                                    <span className="inline-block ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                                                        {group.hiddenCount} ẩn
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openUserDetail(group);
                                                }}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition shadow-sm hover:shadow inline-flex items-center gap-1.5"
                                            >
                                                <span>👁️</span>
                                                <span>Xem chi tiết ({group.total})</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-400">
                                        Không tìm thấy tài khoản nào có đánh giá phù hợp với bộ lọc.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TAB 2: GỘP THEO SẢN PHẨM (idsp review) */}
            {viewMode === 'product' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="text-xs font-semibold text-gray-700">
                            Danh sách đánh giá theo sản phẩm ({productGroups.length} sản phẩm có review)
                        </div>
                        <span className="text-[11px] text-gray-500">
                            Theo yêu cầu sơ đồ: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-blue-600">review ----&gt; [idsp review]</code>
                        </span>
                    </div>

                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200/80 text-gray-600 uppercase font-semibold text-[11px] tracking-wider">
                            <tr>
                                <th className="p-4 w-16 text-center">ID SP</th>
                                <th className="p-4 w-72">Sản phẩm</th>
                                <th className="p-4 w-36 text-center">Tổng đánh giá</th>
                                <th className="p-4 w-36 text-center">Điểm sao TB</th>
                                <th className="p-4">Nhận xét mới nhất</th>
                                <th className="p-4 w-36 text-center">Trạng thái</th>
                                <th className="p-4 w-36 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-400">
                                        Đang tải dữ liệu sản phẩm...
                                    </td>
                                </tr>
                            ) : productGroups.length > 0 ? (
                                productGroups.map((group) => (
                                    <tr 
                                        key={group.productId}
                                        onClick={() => openProductDetail(group)}
                                        className="hover:bg-blue-50/40 cursor-pointer transition"
                                    >
                                        <td className="p-4 text-center font-mono font-bold text-gray-700">
                                            #{group.productId}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2">
                                                {group.productName}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                                📦 {group.total} lượt đánh giá
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1 text-amber-500 text-sm font-bold">
                                                <span>★</span>
                                                <span>{group.avgRating}</span>
                                                <span className="text-gray-400 text-[10px] font-normal">/ 5</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {group.latestReview ? (
                                                <div className="max-w-md">
                                                    <div className="text-[11px] font-semibold text-gray-800">
                                                        {group.latestReview.user_name} ({group.latestReview.rating}★)
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 line-clamp-1 italic mt-0.5">
                                                        "{group.latestReview.comment}"
                                                    </p>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(group.latestReview.created_at).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">---</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="text-[11px]">
                                                <span className="inline-block bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                                                    {group.activeCount} hiện
                                                </span>
                                                {group.hiddenCount > 0 && (
                                                    <span className="inline-block ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                                                        {group.hiddenCount} ẩn
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openProductDetail(group);
                                                }}
                                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition shadow-sm hover:shadow inline-flex items-center gap-1.5"
                                            >
                                                <span>👁️</span>
                                                <span>Xem ({group.total})</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-400">
                                        Không tìm thấy sản phẩm nào có đánh giá phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TAB 3: TẤT CẢ ĐÁNH GIÁ (DẠNG PHẲNG ĐẦY ĐỦ) */}
            {viewMode === 'all' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="text-xs font-semibold text-gray-700">
                            Danh sách chi tiết tất cả đánh giá ({filteredReviews.length} mục)
                        </div>
                    </div>

                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200/80 text-gray-600 uppercase font-semibold text-[11px] tracking-wider">
                            <tr>
                                <th className="p-4 w-12 font-mono">ID</th>
                                <th className="p-4 w-48">Người đánh giá</th>
                                <th className="p-4 w-56">Sản phẩm</th>
                                <th className="p-4 w-28">Số sao</th>
                                <th className="p-4">Nội dung bình luận</th>
                                <th className="p-4 w-28 text-center">Trạng thái</th>
                                <th className="p-4 w-32 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-400">
                                        Đang tải danh sách nhận xét...
                                    </td>
                                </tr>
                            ) : filteredReviews.length > 0 ? (
                                filteredReviews.map((rev) => (
                                    <tr key={rev.id} className="hover:bg-gray-50/80 transition">
                                        <td className="p-4 font-mono font-medium text-gray-500">#{rev.id}</td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{rev.user_name}</div>
                                            {rev.user_email && (
                                                <div className="text-[11px] text-gray-400">{rev.user_email}</div>
                                            )}
                                            <div className="mt-0.5">
                                                {rev.is_buyer ? (
                                                    <span className="inline-block text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold">
                                                        ✓ Đã mua hàng
                                                    </span>
                                                ) : (
                                                    <span className="inline-block text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded font-medium">
                                                        Chưa mua
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">
                                                {new Date(rev.created_at).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-gray-800 line-clamp-2">
                                                {rev.product?.name || `Sản phẩm #${rev.product_id}`}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-amber-400 text-sm">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <span key={s}>{rev.rating >= s ? '★' : '☆'}</span>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-semibold text-gray-600 mt-0.5 block">
                                                {rev.rating} / 5 sao
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-gray-700 leading-relaxed font-light">
                                                "{rev.comment}"
                                            </p>
                                        </td>
                                        <td className="p-4 text-center">
                                            {rev.status ? (
                                                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                                    ✓ Đang hiện
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                                    ✕ Đang ẩn
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                            <button
                                                disabled={actionLoadingId === rev.id}
                                                onClick={(e) => handleToggleStatus(rev.id, e)}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                                                    rev.status
                                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                }`}
                                            >
                                                {rev.status ? 'Ẩn' : 'Hiện'}
                                            </button>
                                            <button
                                                disabled={actionLoadingId === rev.id}
                                                onClick={(e) => handleDeleteReview(rev.id, e)}
                                                className="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-lg text-[11px] font-medium transition"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-400">
                                        Không có đánh giá nào phù hợp với bộ lọc.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 5. MODAL CHI TIẾT - HIỂN THỊ TẤT CẢ ĐÁNH GIÁ CỦA 1 TÀI KHOẢN HOẶC 1 SẢN PHẨM */}
            {detailModal.isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))}
                >
                    <div 
                        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-gray-50 via-white to-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                                    {detailModal.avatar}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {detailModal.title}
                                        </h3>
                                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
                                            {detailModal.reviews.length} đánh giá
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {detailModal.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="flex items-center text-amber-500 font-bold text-sm">
                                        <span>★</span>
                                        <span className="ml-1">{detailModal.avgRating} / 5</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400">Điểm trung bình</span>
                                </div>
                                <button
                                    onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Body Modal: Danh sách các bài đánh giá của tài khoản/sản phẩm này */}
                        <div className="p-6 overflow-y-auto space-y-4 flex-1 divide-y divide-gray-100">
                            {detailModal.reviews.map((rev, index) => (
                                <div 
                                    key={rev.id} 
                                    className="pt-4 first:pt-0 group hover:bg-gray-50/50 p-3 rounded-2xl transition"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        {/* Sản phẩm đã đánh giá (nếu xem theo user) hoặc Tên khách (nếu xem theo sp) */}
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-gray-400">#{index + 1}</span>
                                            {detailModal.type === 'user' ? (
                                                <div className="font-semibold text-gray-900 text-xs flex items-center gap-2">
                                                    <span>📦 {rev.product?.name || `Sản phẩm #${rev.product_id}`}</span>
                                                    {rev.is_buyer ? (
                                                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full font-medium">✓ Đã mua</span>
                                                    ) : (
                                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.2 rounded-full font-medium">Chưa mua</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="font-semibold text-gray-900 text-xs flex items-center gap-2">
                                                    <span>👤 {rev.user_name} ({rev.user_email || 'Không có email'})</span>
                                                    {rev.is_buyer ? (
                                                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full font-medium">✓ Đã mua</span>
                                                    ) : (
                                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.2 rounded-full font-medium">Chưa mua</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Số sao */}
                                            <div className="flex items-center text-amber-400 text-sm">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <span key={s}>{rev.rating >= s ? '★' : '☆'}</span>
                                                ))}
                                                <span className="ml-1.5 text-xs font-bold text-gray-700">
                                                    {rev.rating} sao
                                                </span>
                                            </div>

                                            <span className="text-[11px] text-gray-400">
                                                {new Date(rev.created_at).toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Nội dung nhận xét */}
                                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 my-2.5">
                                        <p className="text-xs text-gray-800 leading-relaxed font-light italic">
                                            "{rev.comment}"
                                        </p>
                                    </div>

                                    {/* Footer của mỗi dòng: Trạng thái & Thao tác */}
                                    <div className="flex items-center justify-between pt-1">
                                        <div>
                                            {rev.status ? (
                                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                                    ✓ Đang hiển thị công khai
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                                    ✕ Đang ẩn khỏi trang chủ/sản phẩm
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={actionLoadingId === rev.id}
                                                onClick={(e) => handleToggleStatus(rev.id, e)}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                                                    rev.status
                                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                                }`}
                                            >
                                                {actionLoadingId === rev.id ? '...' : (rev.status ? '👁️ Ẩn đánh giá' : '✓ Cho phép hiện')}
                                            </button>

                                            <button
                                                disabled={actionLoadingId === rev.id}
                                                onClick={(e) => handleDeleteReview(rev.id, e)}
                                                className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-medium transition"
                                            >
                                                {actionLoadingId === rev.id ? '...' : '🗑️ Xóa'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                            <div>
                                Tổng cộng: <strong className="text-gray-900">{detailModal.reviews.length}</strong> bài đánh giá
                            </div>
                            <button
                                onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))}
                                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition"
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
