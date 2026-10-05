import ProductCard from '@/components/shop/product/ProductCard';

export default function ProductListPage() {
  const mockProducts = [
    { id: 1, name: "Áo thun Basic Pro", price: 150000, sale_price: 120000, description: "Thiết kế hoàn toàn mới. Mềm mại hơn bao giờ hết." },
    { id: 2, name: "Quần Jeans nữ Max", price: 350000, sale_price: null, description: "Tôn dáng tuyệt đối. Vừa vặn hoàn hảo." },
    { id: 3, name: "Sneaker Sport Ultra", price: 550000, sale_price: 499000, description: "Bước đi nhẹ tựa lông hồng." },
    { id: 4, name: "Balo thời trang Lite", price: 280000, sale_price: null, description: "Mang cả thế giới trên vai." },
    { id: 5, name: "Mũ lưỡi trai SE", price: 99000, sale_price: 79000, description: "Phong cách tối giản. Năng động mỗi ngày." },
    { id: 6, name: "Áo khoác gió Pro Max", price: 400000, sale_price: null, description: "Chống chọi mọi thời tiết." },
    { id: 7, name: "Váy nữ thanh lịch", price: 320000, sale_price: 290000, description: "Vẻ đẹp vượt thời gian." },
    { id: 8, name: "Dép siêu nhẹ", price: 50000, sale_price: null, description: "Thoải mái trong từng bước chân." },
    { id: 9, name: "Đồng hồ thông minh S1", price: 1200000, sale_price: 999000, description: "Công nghệ trên cổ tay." },
    { id: 10, name: "Tai nghe không dây", price: 850000, sale_price: null, description: "Âm thanh sống động." },
  ];

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
