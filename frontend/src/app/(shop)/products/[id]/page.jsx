'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/shop/product/ProductCard';

export default function ProductDetailPage({ params }) {
  // Unwrap Next.js 15 dynamic params
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const [resProduct, resRelated] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/products/${productId}`),
          fetch(`http://127.0.0.1:8000/api/products/${productId}/related`),
        ]);

        if (resProduct.ok) {
          const prodData = await resProduct.json();
          setProduct(prodData.data || prodData);
        }

        if (resRelated.ok) {
          const relData = await resRelated.json();
          setRelatedProducts(relData.data || []);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Thêm vào giỏ hàng
  const handleAddToCart = (redirectCart = false) => {
    if (!product) return;

    try {
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingIndex = currentCart.findIndex((item) => item.id === product.id);

      const actualPrice = product.sale_price && product.sale_price > 0 && product.sale_price < product.price
        ? product.sale_price
        : product.price;

      if (existingIndex > -1) {
        currentCart[existingIndex].quantity = (currentCart[existingIndex].quantity || 1) + quantity;
      } else {
        currentCart.push({
          id: product.id,
          name: product.name,
          price: actualPrice,
          original_price: product.price,
          sale_price: product.sale_price,
          image: product.image,
          quantity: quantity,
        });
      }

      localStorage.setItem('cart', JSON.stringify(currentCart));
      window.dispatchEvent(new Event('cartUpdated'));

      if (redirectCart) {
        router.push('/cart');
      } else {
        setAddedNotice(true);
        setTimeout(() => setAddedNotice(false), 2500);
      }
    } catch (e) {
      console.error('Lỗi thêm giỏ hàng:', e);
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
          <div className="text-5xl mb-4">⚠️</div>
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
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>

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
                    <span>🎉 Đã thêm <strong>{quantity} x {product.name}</strong> vào giỏ hàng!</span>
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
                    <span>🛒 Thêm vào giỏ</span>
                  </button>
                  <button
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 bg-[#0071e3] hover:bg-[#0077ED] text-white py-3.5 rounded-full font-semibold text-xs sm:text-sm active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>⚡ Mua ngay</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 3. SẢN PHẨM LIÊN QUAN (RELATED PRODUCTS) */}
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
