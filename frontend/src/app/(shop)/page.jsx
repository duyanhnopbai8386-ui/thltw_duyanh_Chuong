import ProductCard from '@/components/shop/product/ProductCard';
import Link from 'next/link';

export default function ShopHomePage() {
  const mockProducts = [
    { id: 1, name: "Áo thun Basic Pro", price: 150000, sale_price: 120000, description: "Thiết kế hoàn toàn mới. Mềm mại hơn bao giờ hết." },
    { id: 2, name: "Quần Jeans nữ Max", price: 350000, sale_price: null, description: "Tôn dáng tuyệt đối. Vừa vặn hoàn hảo." },
    { id: 3, name: "Sneaker Sport Ultra", price: 550000, sale_price: 499000, description: "Bước đi nhẹ tựa lông hồng." },
    { id: 4, name: "Balo thời trang Lite", price: 280000, sale_price: null, description: "Mang cả thế giới trên vai." },
    { id: 5, name: "Mũ lưỡi trai SE", price: 99000, sale_price: 79000, description: "Phong cách tối giản. Năng động mỗi ngày." },
    { id: 6, name: "Áo khoác gió Pro Max", price: 400000, sale_price: null, description: "Chống chọi mọi thời tiết." },
    { id: 7, name: "Váy nữ thanh lịch", price: 320000, sale_price: 290000, description: "Vẻ đẹp vượt thời gian." },
    { id: 8, name: "Dép siêu nhẹ", price: 50000, sale_price: null, description: "Thoải mái trong từng bước chân." },
  ];

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
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </main>
    </div>
  );
}
