import ProductCard from '@/components/shop/product/ProductCard';
import Link from 'next/link';
import { mockProducts } from '@/data/products';

export default function ShopHomePage() {
  // Lấy 4 sản phẩm đầu tiên để hiển thị ở trang chủ
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      {/* Hero Section (Apple Style) */}
      <section className="bg-black text-white text-center pt-24 pb-20 px-4 overflow-hidden relative">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">iPhone 15 Pro</h2>
        <p className="text-xl md:text-2xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
          Titan. Bền bỉ. Nhẹ. Pro.
        </p>
        <div className="flex justify-center gap-6">
          <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-300">
            Mua ngay
          </button>
          <button className="text-blue-500 hover:text-blue-400 hover:underline px-6 py-3 font-medium transition-colors">
            Tìm hiểu thêm &gt;
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Sản phẩm mới nhất.
          </h2>
          <Link href="/products" className="text-blue-600 hover:underline mb-1 font-medium hidden sm:block">
            Xem tất cả &gt;
          </Link>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </main>
    </div>
  );
}
