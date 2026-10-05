import Link from 'next/link';

export default function ProductDetailPage() {
  // Dữ liệu giả định cho một sản phẩm chi tiết
  const product = { 
    id: 1, 
    name: "Áo thun Basic Pro", 
    price: 150000, 
    sale_price: 120000, 
    description: "Thiết kế hoàn toàn mới. Mềm mại hơn bao giờ hết. Được chế tác từ chất liệu cotton cao cấp 100%, mang lại cảm giác nhẹ nhàng, thoáng mát suốt cả ngày dài. Từng đường kim mũi chỉ đều được chăm chút tỉ mỉ, tạo nên sự hoàn hảo không góc chết.",
    features: [
      "Chất liệu Cotton 100% thoáng mát.",
      "Công nghệ dệt không đường may (Seamless).",
      "Siêu nhẹ, siêu bền bỉ.",
      "Chống nhăn hiệu quả sau nhiều lần giặt."
    ]
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-black transition-colors">Trang chủ</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/products" className="hover:text-black transition-colors">Sản phẩm</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left: Image Placeholder */}
          <div className="w-full md:w-1/2 h-[400px] md:h-auto bg-[#fbfbfd] flex flex-col items-center justify-center text-gray-400 border-r border-gray-100 p-10 relative group">
            <span className="text-xl group-hover:scale-110 transition-transform duration-700 ease-out">
              [Ảnh {product.name} phóng to]
            </span>
            {product.sale_price && (
              <div className="absolute top-6 left-6 bg-black text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-md">
                Giảm giá
              </div>
            )}
          </div>
          
          {/* Right: Info */}
          <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">{product.name}</h1>
            
            <div className="mb-6">
              {product.sale_price ? (
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gray-900">{product.sale_price.toLocaleString('vi-VN')}đ</span>
                  <span className="text-xl text-gray-400 line-through">{product.price.toLocaleString('vi-VN')}đ</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{product.price.toLocaleString('vi-VN')}đ</span>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed font-light">
              {product.description}
            </p>

            <ul className="mb-10 space-y-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-700 text-sm">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mr-3 shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button className="flex-1 bg-[#0071e3] text-white py-4 rounded-full font-medium text-lg hover:bg-[#0077ED] active:scale-95 transition-all shadow-md">
                Thêm vào giỏ
              </button>
              <button className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-full font-medium text-lg hover:bg-gray-200 active:scale-95 transition-all">
                Mua ngay
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
