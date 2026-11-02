'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Đơn hàng gần đây
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token && !savedUser) {
      router.push('/login?redirect=/profile');
      return;
    }

    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setName(u.name || '');
        setEmail(u.email || '');
        setPhone(u.phone || '');
      } catch (e) {}
    }

    // Tải thông tin mới nhất từ API
    const fetchProfile = async () => {
      try {
        if (!token) return;
        const res = await fetch('http://127.0.0.1:8000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          const userData = data.user || data.data || data;
          setUser(userData);
          setName(userData.name || '');
          setEmail(userData.email || '');
          setPhone(userData.phone || '');
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (err) {
        console.error('Lỗi tải thông tin cá nhân:', err);
      } finally {
        setLoading(false);
      }
    };

    // Tải danh sách đơn hàng của user
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        if (!token) return;
        const res = await fetch('http://127.0.0.1:8000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const oData = await res.json();
          setOrders(oData.data || oData || []);
        }
      } catch (e) {
        console.error('Lỗi tải đơn hàng:', e);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [router]);

  // Cập nhật hồ sơ
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    if (password && password !== passwordConfirm) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      setUpdating(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const bodyData = {
        name,
        phone,
      };
      if (password) {
        bodyData.password = password;
        bodyData.password_confirmation = passwordConfirm;
      }

      const res = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (res.ok) {
        const updated = { ...user, name, phone };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        setMessage({ type: 'success', text: 'Cập nhật thông tin tài khoản thành công!' });
        setPassword('');
        setPasswordConfirm('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Không thể cập nhật thông tin!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ!' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Hồ sơ cá nhân (Profile)</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Card & Navigation */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
            {user?.roles && (
              <span className="inline-block mt-3 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                Vai trò: {user.roles}
              </span>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{orders.length}</div>
                <div className="text-[11px] text-gray-400">Đơn hàng</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-600">Thành viên</div>
                <div className="text-[11px] text-gray-400">Trạng thái</div>
              </div>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <Link
              href="/orders"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 text-xs font-semibold transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">📦</span>
                <span>Danh sách đơn hàng của tôi</span>
              </div>
              <span className="text-gray-400 font-mono">→</span>
            </Link>

            <Link
              href="/cart"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 text-xs font-semibold transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🛒</span>
                <span>Giỏ hàng hiện tại</span>
              </div>
              <span className="text-gray-400 font-mono">→</span>
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 text-xs font-semibold transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🛍️</span>
                <span>Tiếp tục mua sắm</span>
              </div>
              <span className="text-gray-400 font-mono">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Update Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Thông tin tài khoản</h3>
                <p className="text-xs text-gray-500 mt-1">Cập nhật thông tin cá nhân và thay đổi mật khẩu bảo mật</p>
              </div>
              <span className="text-xl">⚙️</span>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl text-xs font-medium mb-6 ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? '✓ ' : '✕ '} {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-xs rounded-xl px-4 py-3 cursor-not-allowed outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Email dùng để đăng nhập và không thể sửa</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="text"
                  placeholder="0987654321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wider">
                  Đổi mật khẩu (Bỏ trống nếu không muốn đổi)
                </h4>
                <p className="text-[11px] text-gray-500 mb-4">Mật khẩu mới cần tối thiểu 6 ký tự</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-2xl shadow-md shadow-blue-500/20 transition disabled:opacity-60 flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu thay đổi hồ sơ</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
