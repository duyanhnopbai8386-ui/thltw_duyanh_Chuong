'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    note: ''
  });
  const router = useRouter();

  // 1. Tải giỏ hàng từ localStorage & thông tin user đã đăng nhập
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        let rawCart = [];
        try {
          const raw = localStorage.getItem('cart');
          const parsed = raw ? JSON.parse(raw) : [];
          rawCart = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          rawCart = [];
        }
        setItems(rawCart.filter(item => item && item.id));

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setForm(prev => ({
            ...prev,
            customer_name: user.name || '',
            customer_phone: user.phone || '',
          }));
        }
      } catch (e) {
        console.error("Lỗi đọc giỏ hàng:", e);
      }
    }
  }, []);

  // Cập nhật giỏ hàng vào localStorage và dispatch event
  const saveCart = (newItems) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    const updated = items.map(item => item.id === id ? { ...item, quantity: newQty } : item);
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = items.filter(item => item.id !== id);
    saveCart(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0);
  const shipping = subtotal > 0 ? (subtotal >= 1000000 ? 0 : 30000) : 0;
  const total = subtotal + shipping;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    setLoading(true);
    try {
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
        // Xóa giỏ hàng sau khi đặt thành công
        localStorage.removeItem('cart');
        setItems([]);
        window.dispatchEvent(new Event('cartUpdated'));

        // Lưu đơn hàng guest nếu chưa đăng nhập
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

        alert('🎉 Đặt hàng thành công! Đơn hàng của bạn đã được tiếp nhận và xử lý.');
        setShowCheckout(false);
        router.push('/orders');
      } else {
        const errorMsg = data.errors
          ? Object.values(data.errors).flat().join('\n')
          : (data.message || 'Đặt hàng thất bại, vui lòng kiểm tra lại thông tin!');
        alert('Lỗi đặt hàng:\n' + errorMsg);
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
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Giỏ hàng của bạn.</h1>
            <p className="text-xs text-gray-500 mt-1">Kiểm tra các sản phẩm đã chọn trước khi thanh toán</p>
          </div>
          <Link href="/orders" className="text-xs text-blue-600 hover:underline font-semibold bg-blue-50 px-3.5 py-2 rounded-full">
            📦 Xem đơn hàng đã mua
          </Link>
        </div>
        
        {items.length === 0 ? (
          /* GIỎ TRỐNG */
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
              Hãy khám phá các thiết bị công nghệ hấp dẫn và chọn cho mình sản phẩm ưng ý nhất.
            </p>
            <Link
              href="/products"
              className="bg-black text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition inline-block"
            >
              Khám phá sản phẩm ngay &gt;
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Cột trái: Danh sách sản phẩm trong giỏ */}
            <div className="w-full lg:w-2/3 space-y-3">
              {items.map(item => {
                const itemImg = item.image
                  ? (item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`)
                  : null;

                return (
                  <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center gap-4 transition hover:shadow-md">
                    
                    {/* Ảnh sản phẩm */}
                    <div className="w-20 h-20 bg-[#fbfbfd] rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100">
                      {itemImg ? (
                        <img src={itemImg} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    
                    {/* Thông tin */}
                    <div className="flex-grow min-w-0">
                      <Link href={`/products/${item.id}`} className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition truncate block">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {Number(item.price).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    
                    {/* Tăng / Giảm số lượng */}
                    <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Tổng tiền món */}
                    <div className="text-right shrink-0 min-w-[90px]">
                      <div className="font-bold text-gray-900 text-sm">
                        {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} đ
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] text-red-500 hover:text-red-700 underline mt-1"
                      >
                        Xóa
                      </button>
                    </div>

                  </div>
                );
              })}

              <div className="pt-2">
                <Link href="/products" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  &larr; Tiếp tục chọn thêm sản phẩm khác
                </Link>
              </div>
            </div>

            {/* Cột phải: Tóm tắt đơn hàng & Nút thanh toán */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  Tóm tắt đơn hàng
                </h2>
                
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="text-gray-900 font-semibold">{subtotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-gray-900 font-semibold">
                      {shipping === 0 ? <span className="text-emerald-600">Miễn phí</span> : `${shipping.toLocaleString('vi-VN')} đ`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-[10px] text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                      🎉 Đơn hàng trên 1.000.000đ được Miễn phí giao hàng toàn quốc!
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-lg font-extrabold text-red-600">{total.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-[#0071e3] text-white font-semibold text-xs sm:text-sm py-3.5 rounded-full mt-6 hover:bg-[#0077ED] active:scale-95 transition-all shadow-md"
                >
                  Tiến hành Đặt hàng
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL CHECKOUT / ĐẶT HÀNG */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Thông tin nhận hàng</h3>
                <p className="text-xs text-gray-500">Vui lòng điền thông tin để nhân viên giao hàng liên hệ</p>
              </div>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên người nhận *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ giao hàng chi tiết *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  value={form.customer_address}
                  onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ghi chú đơn hàng (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Giao trong giờ hành chính, gọi trước khi đến..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                />
              </div>

              {/* Tóm tắt tổng tiền */}
              <div className="bg-gray-50 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                <span className="text-gray-600 font-medium">Tổng tiền thanh toán (COD):</span>
                <span className="text-base font-extrabold text-red-600">{total.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs font-semibold transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0071e3] hover:bg-[#0077ED] text-white py-3 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                >
                  {loading ? 'Đang gửi đơn...' : 'Xác nhận Đặt hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
