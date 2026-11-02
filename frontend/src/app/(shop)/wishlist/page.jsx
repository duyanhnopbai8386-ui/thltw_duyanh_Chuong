'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWishlist, removeFromWishlist, clearWishlist } from '@/app/services/wishlistService';
import { addToCart } from '@/app/services/cartService';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const loadWishlist = () => {
    const list = getWishlist();
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    loadWishlist();

    const handleSync = () => loadWishlist();
    window.addEventListener('wishlistUpdated', handleSync);
    window.addEventListener('authChange', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('wishlistUpdated', handleSync);
      window.removeEventListener('authChange', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleRemove = (id) => {
    removeFromWishlist(id);
    loadWishlist();
  };

  const handleClearAll = () => {
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi danh sách yêu thích?')) return;
    clearWishlist();
    loadWishlist();
  };

  const handleQuickAddToCart = (product) => {
    addToCart(product, 1);
    setToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setToast(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>✓</span>
          <span>{toast}</span>
          <Link href="/cart" className="underline font-bold ml-2 text-blue-400">Xem giỏ &gt;</Link>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-black transition">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Sản phẩm yêu thích (Wishlist)</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl text-red-500 animate-pulse">❤️</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Danh sách Sản phẩm Yêu thích
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Lưu trữ những sản phẩm bạn quan tâm để dễ dàng xem lại và mua sắm sau.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
              {items.length} sản phẩm
            </span>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-full font-medium transition"
            >
              ✕ Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* Body: Danh sách hoặc Trống */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((prod) => {
            const price = Number(prod.price || 0);
            const salePrice = prod.sale_price ? Number(prod.sale_price) : null;
            const hasDiscount = salePrice && salePrice > 0 && salePrice < price;

            const imageUrl = prod.image
              ? (prod.image.startsWith('http') ? prod.image : `http://127.0.0.1:8000${prod.image}`)
              : null;

            return (
              <div 
                key={prod.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative"
              >
                {/* Nút xóa khỏi yêu thích */}
                <button
                  onClick={() => handleRemove(prod.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 shadow-sm flex items-center justify-center transition"
                  title="Xóa khỏi yêu thích"
                >
                  ✕
                </button>

                {/* Ảnh */}
                <Link href={`/products/${prod.id}`} className="block relative h-56 bg-[#fbfbfd] w-full p-4 shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📱</span>
                    </div>
                  )}

                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Sale
                    </div>
                  )}
                </Link>

                {/* Thông tin */}
                <div className="p-5 flex flex-col flex-1">
                  {prod.brand?.name && (
                    <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
                      {prod.brand.name}
                    </span>
                  )}

                  <Link href={`/products/${prod.id}`}>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 hover:text-blue-600 transition mb-2">
                      {prod.name}
                    </h3>
                  </Link>

                  {/* Giá */}
                  <div className="mt-auto mb-4">
                    {hasDiscount ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-red-600 font-bold text-base">
                          {salePrice.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-gray-400 text-xs line-through">
                          {price.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-900 font-bold text-base">
                        {price.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickAddToCart(prod)}
                      className="flex-1 bg-black hover:bg-gray-800 text-white py-2.5 rounded-full text-xs font-semibold transition active:scale-95 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>🛒</span>
                      <span>Thêm vào giỏ</span>
                    </button>

                    <Link
                      href={`/products/${prod.id}`}
                      className="px-3.5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
                      title="Xem chi tiết"
                    >
                      Chi tiết &gt;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-xl mx-auto my-12">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 text-red-400 flex items-center justify-center text-3xl mb-4">
            💔
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Danh sách yêu thích đang trống!
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Bạn chưa lưu sản phẩm nào vào mục yêu thích. Hãy bấm vào biểu tượng <strong>❤️</strong> trên các sản phẩm trong cửa hàng để lưu lại nhé.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-full text-xs font-semibold transition shadow-md"
          >
            Khám phá sản phẩm ngay &gt;
          </Link>
        </div>
      )}
    </div>
  );
}
