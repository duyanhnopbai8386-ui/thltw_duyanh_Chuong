import ProductCard from '@/components/shop/product/ProductCard';
import { mockProducts } from '@/data/products';

export default function ProductListPage() {

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 text-center">
          Tất cả sản phẩm.
        </h1>
        <p className="text-xl text-gray-500 mb-12 text-center font-light">
          Khám phá những thiết kế mới nhất dành cho bạn.
        </p>

        {/* Categories / Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['Tất cả', 'Áo thun', 'Quần Jeans', 'Phụ kiện', 'Giày dép'].map((cat, idx) => (
            <button 
              key={idx} 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                idx === 0 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-200 shadow-sm border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
