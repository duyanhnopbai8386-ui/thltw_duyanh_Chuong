'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ type: 'success', text: '✓ Cảm ơn bạn đã gửi liên hệ! Ban quản trị sẽ phản hồi qua email/SĐT trong vòng 24h.' });
        setForm({ name: '', email: '', phone: '', title: '', content: '' });
      } else {
        setMsg({ type: 'error', text: data.message || 'Không thể gửi liên hệ, vui lòng thử lại!' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Lỗi kết nối máy chủ, vui lòng thử lại sau!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* TIÊU ĐỀ */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">
            Trung Tâm Hỗ Trợ & Chăm Sóc Khách Hàng
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mt-2 mb-3">
            Liên Hệ Với Chúng Tôi.
          </h1>
          <p className="text-gray-500 font-light text-sm sm:text-base">
            Nếu bạn có thắc mắc về đơn hàng, chính sách bảo hành hoặc muốn tư vấn thiết bị, hãy để lại lời nhắn cho chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: THÔNG TIN SHOWROOM & HOTLINE */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-5">
              <h3 className="font-bold text-gray-900 text-base">Thông tin liên hệ trực tiếp</h3>
              
              <div className="flex items-start gap-3 text-xs">
                <span className="text-xl">📍</span>
                <div>
                  <strong className="block text-gray-800">Địa chỉ Showroom:</strong>
                  <span className="text-gray-500 leading-relaxed">
                    123 Đường Công Nghệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="text-xl">📞</span>
                <div>
                  <strong className="block text-gray-800">Hotline tư vấn & CSKH:</strong>
                  <span className="text-blue-600 font-semibold font-mono text-sm">1900 8888</span>
                  <span className="text-gray-400 block text-[11px]">(8:00 - 21:30 hàng ngày)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="text-xl">✉️</span>
                <div>
                  <strong className="block text-gray-800">Email hỗ trợ:</strong>
                  <span className="text-gray-600 font-mono">support@duyanhstore.vn</span>
                </div>
              </div>

              <div className="pt-4 border-t text-xs text-gray-400">
                <span>Giấy phép ĐKKD số: 0108888888 do Sở KHĐT TP.HCM cấp.</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md">
              <h4 className="font-bold text-sm mb-1">Chính sách bảo hành 1 đổi 1</h4>
              <p className="text-xs text-blue-100 font-light leading-relaxed mb-4">
                Đổi ngay sản phẩm mới trong 30 ngày đầu tiên nếu phát sinh lỗi từ nhà sản xuất.
              </p>
              <Link
                href="/pages/chinh-sach-bao-hanh"
                className="text-xs font-semibold bg-white text-blue-700 px-4 py-2 rounded-full inline-block hover:bg-blue-50 transition"
              >
                Xem chi tiết chính sách &gt;
              </Link>
            </div>
          </div>

          {/* CỘT PHẢI: FORM GỬI LIÊN HỆ */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-base mb-2">Gửi lời nhắn hoặc yêu cầu hỗ trợ</h3>
              <p className="text-xs text-gray-400 mb-6">Chúng tôi thường phản hồi qua email hoặc gọi lại trong vòng 2 giờ làm việc.</p>

              {msg.text && (
                <div className={`p-4 rounded-2xl text-xs mb-6 ${
                  msg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium'
                    : 'bg-red-50 border border-red-200 text-red-800 font-medium'
                }`}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên của bạn *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại liên hệ</label>
                    <input
                      type="tel"
                      placeholder="0912345678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Chủ đề cần hỗ trợ</label>
                    <input
                      type="text"
                      placeholder="Tư vấn mua hàng, Bảo hành..."
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nội dung chi tiết *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Mô tả chi tiết câu hỏi hoặc vấn đề bạn cần giải đáp..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full text-xs font-semibold transition shadow-md disabled:opacity-50"
                >
                  {loading ? 'Đang gửi lời nhắn...' : 'Gửi Yêu Cầu Hỗ Trợ'}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
