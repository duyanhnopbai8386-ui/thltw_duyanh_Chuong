'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import ProductCard from '@/components/shop/product/ProductCard';

export default function ProductDetailPage({ params: propParams }) {
  const router = useRouter();
  const routeParams = useParams();
  const productId = routeParams?.id || propParams?.id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total_reviews: 0, average_rating: 0, star_counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // State cho Form đánh giá
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });

  // Tự động điền thông tin nếu đã đăng nhập
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.name) setReviewerName(u.name);
        if (u.email) setReviewerEmail(u.email);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const [resProduct, resRelated, resReviews] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/products/${productId}`),
          fetch(`http://127.0.0.1:8000/api/products/${productId}/related`),
          fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews`),
        ]);

        if (resProduct.ok) {
          const prodData = await resProduct.json();
          setProduct(prodData.data || prodData);
        }

        if (resRelated.ok) {
          const relData = await resRelated.json();
          setRelatedProducts(relData.data || []);
        }

        if (resReviews.ok) {
          const revData = await resReviews.json();
          setReviews(revData.data || []);
          if (revData.stats) setReviewStats(revData.stats);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Xử lý gửi đánh giá mới
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      setReviewMsg({ type: 'error', text: 'Vui lòng nhập đầy đủ họ tên và nội dung đánh giá!' });
      return;
    }

    setSubmittingReview(true);
    setReviewMsg({ type: '', text: '' });

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rating: reviewRating,
          user_name: reviewerName.trim(),
          user_email: reviewerEmail.trim() || undefined,
          comment: reviewComment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviewMsg({ type: 'success', text: 'Cảm ơn bạn đã gửi đánh giá! Đánh giá đã được ghi nhận.' });
        setReviewComment('');
        setShowReviewForm(false);
        // Tải lại danh sách đánh giá
        const revRes = await fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews`);
        if (revRes.ok) {
          const revData = await revRes.json();
          setReviews(revData.data || []);
          if (revData.stats) setReviewStats(revData.stats);
        }
      } else {
        setReviewMsg({ type: 'error', text: data.message || 'Không thể gửi đánh giá, vui lòng thử lại!' });
      }
    } catch (err) {
      setReviewMsg({ type: 'error', text: 'Có lỗi kết nối máy chủ, vui lòng thử lại sau!' });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = (redirectCart = false) => {
    if (!product) {
      alert('Chưa tải được thông tin sản phẩm, vui lòng thử lại!');
      return;
    }

    try {
      let currentCart = [];
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
        const parsed = raw ? JSON.parse(raw) : [];
        currentCart = Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        currentCart = [];
      }

      const validCart = currentCart.filter(item => item && item.id);
      const existingIndex = validCart.findIndex((item) => Number(item.id) === Number(product.id));

      const actualPrice = product.sale_price && product.sale_price > 0 && product.sale_price < product.price
        ? product.sale_price
        : product.price;

      const qtyToAdd = Math.max(1, Number(quantity) || 1);

      if (existingIndex > -1) {
        validCart[existingIndex].quantity = (Number(validCart[existingIndex].quantity) || 1) + qtyToAdd;
      } else {
        validCart.push({
          id: product.id,
          name: product.name,
          price: actualPrice,
          original_price: product.price,
          sale_price: product.sale_price,
          image: product.image,
          quantity: qtyToAdd,
        });
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(validCart));
        window.dispatchEvent(new Event('cartUpdated'));
      }

      if (redirectCart) {
        router.push('/cart');
      } else {
        setAddedNotice(true);
        setTimeout(() => setAddedNotice(false), 3000);
      }
    } catch (e) {
      console.error('Lỗi thêm giỏ hàng:', e);
      alert('Có lỗi xảy ra: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm font-medium">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen py-24 px-6 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-xs text-gray-500 mb-6">Sản phẩm này có thể đã bị gỡ hoặc không tồn tại trên hệ thống.</p>
          <Link href="/products" className="bg-black text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const price = Number(product.price || 0);
  const salePrice = product.sale_price !== null && product.sale_price !== undefined ? Number(product.sale_price) : null;
  const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

  const imageUrl = product.image && !imgError
    ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`)
    : null;

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. BREADCRUMBS */}
        <nav className="text-xs text-gray-500 mb-6 font-medium flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-black transition">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition">Sản phẩm</Link>
          {product.category?.name && (
            <>
              <span>/</span>
              <Link href={`/products?category_id=${product.category.id}`} className="hover:text-black transition">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2. PRODUCT MAIN DETAIL CARD */}
        <div className="bg-white rounded-3xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Cột trái: Ảnh sản phẩm lớn */}
            <div className="lg:col-span-6 p-8 lg:p-14 bg-[#fbfbfd] flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[420px]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  className="max-h-[380px] w-auto object-contain hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 py-16">
                  <svg className="w-24 h-24 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-400 font-medium">[Ảnh {product.name}]</span>
                </div>
              )}

              {/* Badges trên ảnh */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {hasDiscount && (
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Tiết kiệm {discountPercent}%
                  </span>
                )}
                {product.status ? (
                  <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    ✓ Còn hàng
                  </span>
                ) : (
                  <span className="bg-gray-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    Tạm hết hàng
                  </span>
                )}
              </div>
            </div>

            {/* Cột phải: Thông tin & Nút mua */}
            <div className="lg:col-span-6 p-8 lg:p-14 flex flex-col justify-between">
              <div>
                {/* Brand & Category tags */}
                <div className="flex items-center gap-2 mb-3">
                  {product.brand?.name && (
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg">
                      {product.brand.name}
                    </span>
                  )}
                  {product.category?.name && (
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-lg">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Review quick badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-400 text-sm">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s}>
                        {reviewStats.average_rating >= s ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">
                    {reviewStats.average_rating > 0 ? `${reviewStats.average_rating} / 5` : 'Chưa có đánh giá'}
                  </span>
                  <span className="text-xs text-gray-300">•</span>
                  <a href="#reviews-section" className="text-xs text-blue-600 hover:underline font-medium">
                    {reviewStats.total_reviews} nhận xét
                  </a>
                </div>

                {/* Price Display */}
                <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100/80">
                  <div className="text-xs text-gray-400 mb-1">Giá bán niêm yết:</div>
                  {hasDiscount ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold text-red-600 tracking-tight">
                        {salePrice.toLocaleString('vi-VN')} đ
                      </span>
                      <span className="text-base text-gray-400 line-through">
                        {price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  ) : (
                    <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                      {price.toLocaleString('vi-VN')} đ
                    </div>
                  )}
                </div>

                {/* Short Description */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Mô tả sản phẩm:</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                    {product.description || 'Sản phẩm công nghệ chính hãng nguyên seal, bảo hành 12 tháng tại các trung tâm ủy quyền toàn quốc.'}
                  </p>
                </div>

                {/* Stock info */}
                <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                  <span>Kho hàng:</span>
                  <strong className="text-gray-900">
                    {product.stock !== undefined && product.stock !== null ? `${product.stock} sản phẩm sẵn có` : 'Còn hàng'}
                  </strong>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-semibold text-gray-700">Số lượng:</span>
                  <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-xs text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div>
                {addedNotice && (
                  <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
                    <span>Đã thêm <strong>{quantity} x {product.name}</strong> vào giỏ hàng!</span>
                    <Link href="/cart" className="font-bold underline hover:text-emerald-900">
                      Xem giỏ &gt;
                    </Link>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 bg-black hover:bg-gray-800 text-white py-3.5 rounded-full font-semibold text-xs sm:text-sm active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Thêm vào giỏ</span>
                  </button>
                  <button
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 bg-[#0071e3] hover:bg-[#0077ED] text-white py-3.5 rounded-full font-semibold text-xs sm:text-sm active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span> Mua ngay</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 3. ĐÁNH GIÁ & CHẤM ĐIỂM SẢN PHẨM (REVIEWS & RATINGS) */}
        <section id="reviews-section" className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 mb-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-gray-100">
            <div>
              <span className="text-amber-500 font-semibold text-xs uppercase tracking-wider">
                Đánh Giá Từ Khách Hàng
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                Nhận xét & Chấm điểm sản phẩm.
              </h2>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              {showReviewForm ? '✕ Đóng form đánh giá' : '★ Viết đánh giá của bạn'}
            </button>
          </div>

          {/* BẢNG TỔNG KẾT ĐIỂM SỐ */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 items-center border-b border-gray-100">
            {/* Cột điểm trung bình */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-[#fbfbfd] rounded-2xl border border-gray-100">
              <span className="text-5xl font-black text-gray-900 tracking-tight">
                {reviewStats.average_rating > 0 ? reviewStats.average_rating : '5.0'}
              </span>
              <div className="flex items-center text-amber-400 text-xl my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s}>
                    {(reviewStats.average_rating || 5) >= s ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Dựa trên <strong>{reviewStats.total_reviews}</strong> lượt đánh giá thực tế
              </p>
            </div>

            {/* Cột thanh phân bổ số sao */}
            <div className="md:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewStats.star_counts?.[star] || 0;
                const percent = reviewStats.total_reviews > 0 ? Math.round((count / reviewStats.total_reviews) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-medium text-gray-700 flex items-center gap-1">
                      {star} <span className="text-amber-400">★</span>
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="w-16 text-right text-gray-400 text-[11px]">
                      {count} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* THÔNG BÁO TRẠNG THÁI GỬI ĐÁNH GIÁ */}
          {reviewMsg.text && (
            <div className={`mt-6 p-4 rounded-2xl text-xs flex items-center justify-between ${
              reviewMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <span>{reviewMsg.text}</span>
              <button onClick={() => setReviewMsg({ type: '', text: '' })} className="font-bold ml-2">✕</button>
            </div>
          )}

          {/* FORM GỬI ĐÁNH GIÁ MỚI */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mt-8 p-6 sm:p-8 bg-gray-50/80 rounded-3xl border border-gray-200/80 space-y-5 animate-in fade-in duration-200">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                Gửi nhận xét của bạn về: <span className="text-blue-600">{product.name}</span>
              </h3>

              {/* Chọn số sao tương tác */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Chất lượng sản phẩm *:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <span className={(hoverRating || reviewRating) >= star ? 'text-amber-400' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-amber-600 ml-2">
                    {reviewRating === 5 && 'Tuyệt vời (5 sao)'}
                    {reviewRating === 4 && 'Rất tốt (4 sao)'}
                    {reviewRating === 3 && 'Bình thường (3 sao)'}
                    {reviewRating === 2 && 'Chưa hài lòng (2 sao)'}
                    {reviewRating === 1 && 'Rất tệ (1 sao)'}
                  </span>
                </div>
              </div>

              {/* Tên & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ và tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email liên hệ (Tùy chọn)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={reviewerEmail}
                    onChange={(e) => setReviewerEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                  />
                </div>
              </div>

              {/* Nội dung đánh giá */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nội dung nhận xét chi tiết *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Chia sẻ cảm nhận về đóng gói, chất lượng sử dụng, bảo hành hoặc dịch vụ..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-7 py-2.5 rounded-xl text-xs font-semibold transition shadow-md disabled:opacity-50"
                >
                  {submittingReview ? 'Đang gửi đánh giá...' : 'Gửi Đánh Giá'}
                </button>
              </div>
            </form>
          )}

          {/* DANH SÁCH CÁC ĐÁNH GIÁ */}
          <div className="mt-8 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-[#fbfbfd] rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 items-start">
                  {/* Avatar chữ cái đầu */}
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                    {rev.user_name ? rev.user_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {/* Nội dung review */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">
                          {rev.user_name}
                        </span>
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
                          ✓ Đã mua hàng
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(rev.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    {/* Số sao */}
                    <div className="flex items-center text-amber-400 text-xs mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s}>{rev.rating >= s ? '★' : '☆'}</span>
                      ))}
                    </div>

                    {/* Bình luận */}
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
                      {rev.comment}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-2xl text-gray-500 text-xs">
                Chưa có đánh giá nào cho sản phẩm này. Hãy bấm <strong>"Viết đánh giá của bạn"</strong> ở trên để là người đầu tiên nhận xét!
              </div>
            )}
          </div>
        </section>

        {/* 4. SẢN PHẨM LIÊN QUAN (RELATED PRODUCTS) */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">
                Gợi Ý Cho Bạn
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                Sản phẩm liên quan.
              </h2>
            </div>
            {product.category && (
              <Link
                href={`/products?category_id=${product.category.id}`}
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
              >
                Xem thêm cùng danh mục &gt;
              </Link>
            )}
          </div>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={`related-${relProduct.id}`} product={relProduct} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-gray-100">
              Không có sản phẩm liên quan nào khác.
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
