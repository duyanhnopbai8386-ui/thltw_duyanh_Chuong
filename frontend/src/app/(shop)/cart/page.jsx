'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockCartItems } from '@/data/cart';

export default function CartPage() {
  const [items, setItems] = useState(mockCartItems);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    note: ''
  });
  const router = useRouter();

  useEffect(() => {
    // Tải sản phẩm thật từ API để giỏ hàng liên kết đúng ID sản phẩm đang có trong Database
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => {
        const prodList = data.data || [];
        if (prodList.length > 0) {
          const initialCart = prodList.slice(0, 2).map((p, idx) => ({
            id: p.id,
            name: p.name,
            price: Number(p.sale_price || p.price),
            image: p.image,
            quantity: idx === 0 ? 2 : 1
          }));
          setItems(initialCart);
        }
      })
      .catch(err => console.error("Lỗi tải sản phẩm cho giỏ hàng:", err));
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Chuẩn bị dữ liệu gửi lên API orders
      const payload = {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_address: form.customer_address,
        note: form.note,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        if (typeof window !== 'undefined') {
          const guestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
          if (data.data?.id && !guestOrders.includes(data.data.id)) {
            guestOrders.unshift(data.data.id);
            localStorage.setItem('guest_orders', JSON.stringify(guestOrders));
          }
          if (form.customer_phone) {
            localStorage.setItem('last_customer_phone', form.customer_phone);
          }
        }
        alert('🎉 Đặt hàng thành công! Đơn hàng của bạn đã được ghi nhận.');
        setShowCheckout(false);
        router.push('/orders');
      } else {
        alert(data.message || 'Đặt hàng thất bại, vui lòng kiểm tra lại thông tin!');
      }
    } catch (err) {
      console.error('Lỗi đặt hàng:', err);
      alert('Không thể kết nối đến máy chủ để đặt hàng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Giỏ hàng.</h1>
          <Link href="/orders" className="text-sm text-blue-600 hover:underline font-medium">
            📋 Xem đơn hàng đã mua
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
                
                {/* Image Placeholder */}
                <div className="w-24 h-24 bg-[#fbfbfd] rounded-2xl flex items-center justify-center text-xs text-gray-400 shrink-0">
                  📦
                </div>
                
                {/* Item Details */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                  <p className="text-gray-500 mt-1">{item.price.toLocaleString('vi-VN')}đ</p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center bg-[#f5f5f7] rounded-full px-1 py-1">
                  <span className="w-10 text-center font-semibold text-gray-900 text-sm">
                    x{item.quantity}
                  </span>
                </div>
                
                {/* Total & Remove */}
                <div className="flex flex-col items-center sm:items-end gap-2 shrink-0 min-w-[100px]">
                  <span className="font-semibold text-gray-900 text-lg">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
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
                  <span className="text-gray-900 font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-gray-900 font-medium">{shipping.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-gray-900">{total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-[#0071e3] text-white font-medium text-[15px] py-3.5 rounded-full mt-8 hover:bg-[#0077ED] active:scale-95 transition-all shadow-md"
              >
                Tiến hành Đặt hàng
              </button>
              
              <div className="text-center mt-6">
                <Link href="/products" className="text-sm text-[#0071e3] hover:underline">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHECKOUT / ĐẶT HÀNG */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Thông tin giao hàng</h3>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên người nhận *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A..."
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0912345678..."
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ nhận hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  value={form.customer_address}
                  onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                <textarea
                  rows="2"
                  placeholder="Giao giờ hành chính, gọi trước khi giao..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between text-sm">
                <span className="text-gray-500">Tổng thanh toán:</span>
                <span className="text-xl font-bold text-blue-600">{total.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="w-1/2 py-3 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-[#0071e3] text-white py-3 rounded-full text-sm font-medium hover:bg-[#0077ED] transition disabled:opacity-50"
                >
                  {loading ? 'Đang gửi...' : 'Xác nhận Đặt hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
