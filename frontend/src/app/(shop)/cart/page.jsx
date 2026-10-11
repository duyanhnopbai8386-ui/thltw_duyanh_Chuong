import Link from 'next/link';
import { mockCartItems } from '@/data/cart';

export default function CartPage() {

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-10 text-center">Giỏ hàng.</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 space-y-4">
            {mockCartItems.map(item => (
              <div key={item.id} className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
                
                {/* Image Placeholder */}
                <div className="w-24 h-24 bg-[#fbfbfd] rounded-2xl flex items-center justify-center text-xs text-gray-400 shrink-0">
                  [Ảnh]
                </div>
                
                {/* Item Details */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                  <p className="text-gray-500 mt-1">{item.price.toLocaleString('vi-VN')}đ</p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center bg-[#f5f5f7] rounded-full px-1 py-1">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-gray-600 font-medium transition-colors shadow-sm">
                    -
                  </button>
                  <input 
                    type="text" 
                    defaultValue={item.quantity} 
                    readOnly 
                    className="w-10 text-center bg-transparent outline-none font-semibold text-gray-900 text-sm" 
                  />
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-gray-600 font-medium transition-colors shadow-sm">
                    +
                  </button>
                </div>
                
                {/* Total & Remove */}
                <div className="flex flex-col items-center sm:items-end gap-2 shrink-0 min-w-[100px]">
                  <span className="font-semibold text-gray-900 text-lg">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
                  <button className="text-[13px] text-blue-600 hover:underline">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary (Sticky Glassmorphism) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border border-white p-8 sticky top-28">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">Tóm tắt</h2>
              
              <div className="space-y-4 text-[15px]">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="text-gray-900 font-medium">799.000đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-gray-900 font-medium">30.000đ</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-gray-900">829.000đ</span>
                </div>
              </div>

              <button className="w-full bg-[#0071e3] text-white font-medium text-[15px] py-3.5 rounded-full mt-8 hover:bg-[#0077ED] active:scale-95 transition-all">
                Thanh toán
              </button>
              
              <div className="text-center mt-6">
                <Link href="/" className="text-sm text-[#0071e3] hover:underline">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
