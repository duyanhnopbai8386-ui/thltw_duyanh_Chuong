import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-3xl mx-auto border border-gray-100 mt-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Chào mừng đến với <span className="text-blue-600">ShopDuyAnh</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Trang chủ này đang được xây dựng giao diện tĩnh. Phần Header và Footer đã được đưa vào Component thành công!
          </p>
          
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Xem sản phẩm
            </button>
            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
              Giỏ hàng của bạn
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
