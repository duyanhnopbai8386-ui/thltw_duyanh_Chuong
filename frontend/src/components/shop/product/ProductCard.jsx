import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-400 ease-out cursor-pointer group flex flex-col h-full border border-gray-100">
      
      {/* Image Container */}
      <div className="h-64 bg-[#fbfbfd] w-full flex items-center justify-center text-gray-400 relative overflow-hidden shrink-0">
        <span className="group-hover:scale-110 transition-transform duration-700 ease-out">
          [Ảnh {product.name}]
        </span>
        
        {/* Sale Badge */}
        {product.sale_price && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full">
            Ưu đãi
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-semibold text-xl text-gray-900 mb-1 tracking-tight">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-6 font-light line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-auto">
          {product.sale_price ? (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-black font-semibold text-lg">{product.sale_price.toLocaleString('vi-VN')}đ</span>
              <span className="text-gray-400 text-sm line-through">{product.price.toLocaleString('vi-VN')}đ</span>
            </div>
          ) : (
            <div className="text-black font-semibold text-lg mb-4">{product.price.toLocaleString('vi-VN')}đ</div>
          )}
          
          <button className="w-full bg-[#0071e3] text-white px-4 py-2.5 text-sm font-medium rounded-full hover:bg-[#0077ED] active:scale-95 transition-all">
            Mua
          </button>
        </div>
      </div>

    </div>
  );
}
