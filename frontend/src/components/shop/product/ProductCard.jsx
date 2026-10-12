'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const imageUrl = product.image && !imgError
    ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`)
    : null;

  const price = Number(product.price || 0);
  const salePrice = product.sale_price !== null && product.sale_price !== undefined ? Number(product.sale_price) : null;
  const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full border border-gray-100">
      
      {/* Image Container with Link */}
      <Link href={`/products/${product.id}`} className="block relative h-64 bg-[#fbfbfd] w-full overflow-hidden shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-6 group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
            <svg className="w-16 h-16 text-gray-300 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-500 text-center font-medium line-clamp-1">{product.name}</span>
          </div>
        )}

        {/* Sale Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
            <span>Giảm {discountPercent}%</span>
          </div>
        )}

        {/* Category Badge */}
        {product.category?.name && (
          <div className="absolute top-4 right-4 bg-gray-900/70 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            {product.category.name}
          </div>
        )}
      </Link>
      
      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Brand Name */}
        {product.brand?.name && (
          <span className="text-[11px] font-semibold tracking-wider text-blue-600 uppercase mb-1">
            {product.brand.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-base text-gray-900 mb-1.5 tracking-tight line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-4 font-light line-clamp-2 leading-relaxed flex-grow">
          {product.description || 'Sản phẩm công nghệ chính hãng, bảo hành toàn diện 12 tháng.'}
        </p>
        
        {/* Price & Action Button */}
        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="mb-3">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-red-600 font-bold text-lg tracking-tight">
                  {salePrice.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-gray-400 text-xs line-through">
                  {price.toLocaleString('vi-VN')} đ
                </span>
              </div>
            ) : (
              <div className="text-gray-900 font-bold text-lg tracking-tight">
                {price.toLocaleString('vi-VN')} đ
              </div>
            )}
          </div>
          
          <Link
            href={`/products/${product.id}`}
            className="w-full inline-flex items-center justify-center bg-black hover:bg-gray-800 text-white px-4 py-2.5 text-xs font-semibold rounded-full active:scale-95 transition-all shadow-sm group-hover:bg-[#0071e3]"
          >
            Xem chi tiết & Mua &gt;
          </Link>
        </div>
      </div>

    </div>
  );
}
