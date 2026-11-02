'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCartCount } from '@/app/services/cartService';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);

  // Profile modal state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profilePasswordConfirm, setProfilePasswordConfirm] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // 1. Tải user từ localStorage & kiểm tra token
  const syncUser = () => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (token && savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setProfileName(parsed.name || '');
          setProfilePhone(parsed.phone || '');
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      // Đếm số lượng sản phẩm trong giỏ hàng riêng của tài khoản hiện tại
      try {
        setCartCount(getCartCount());
      } catch (e) {
        setCartCount(0);
      }
    }
  };

  useEffect(() => {
    syncUser();

    // Lắng nghe sự kiện giỏ hàng & đăng nhập thay đổi
    const handleStorageChange = () => syncUser();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    window.addEventListener('authChange', syncUser);

    // 2. Tải menu động từ backend
    fetch('http://127.0.0.1:8000/api/menus?position=header')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setMenus(data.data);
        }
      })
      .catch(() => {});

    // Đóng dropdown khi click bên ngoài
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('authChange', syncUser);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Đăng xuất
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('guest_orders');
      localStorage.removeItem('last_customer_phone');
      setUser(null);
      setIsDropdownOpen(false);
      window.dispatchEvent(new Event('authChange'));
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Đã đăng xuất thành công!');
      router.push('/');
    }
  };

  // Cập nhật thông tin Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });

    if (profilePassword && profilePassword !== profilePasswordConfirm) {
      setProfileMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      setProfileLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const bodyData = {
        name: profileName,
        phone: profilePhone,
      };
      if (profilePassword) {
        bodyData.password = profilePassword;
        bodyData.password_confirmation = profilePasswordConfirm;
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
        const updatedUser = { ...user, name: profileName, phone: profilePhone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setProfileMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
        setProfilePassword('');
        setProfilePasswordConfirm('');
        setTimeout(() => {
          setIsProfileModalOpen(false);
          setProfileMessage({ type: '', text: '' });
        }, 1500);
      } else {
        setProfileMessage({
          type: 'error',
          text: data.message || 'Không thể cập nhật hồ sơ, vui lòng thử lại!',
        });
      }
    } catch (err) {
      setProfileMessage({ type: 'error', text: 'Lỗi kết nối máy chủ!' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Menu mặc định nếu chưa cấu hình trong DB
  const displayMenus = menus.length > 0 ? menus : [
    { name: 'Cửa hàng', link: '/' },
    { name: 'Sản phẩm', link: '/products' },
    { name: 'Tin tức & Đánh giá', link: '/posts' },
    { name: 'Liên hệ', link: '/contact' },
    { name: 'Đơn hàng của tôi', link: '/orders' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>
              </svg>
            </div>
            <span>DuyAnh<span className="font-light text-blue-600">Store</span></span>
          </Link>

          {/* Dynamic Menu Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {displayMenus.map((item, idx) => (
              <Link
                key={idx}
                href={item.link || '#'}
                className="text-[14px] text-gray-600 hover:text-black font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/cart"
              className="text-[14px] text-gray-600 hover:text-black font-medium transition-colors flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full"
            >
              <span>🛒 Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Section: Auth & Profile Dropdown */}
          <div className="flex items-center space-x-3">
            {user ? (
              /* ĐÃ ĐĂNG NHẬP: Hiển thị Profile Avatar Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 px-3 py-1.5 rounded-full transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-gray-900 leading-tight max-w-[120px] truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-500 capitalize">
                      {user.role === 'admin' ? '🛡️ Quản trị viên' : 'Khách hàng'}
                    </p>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Đăng nhập với tư cách</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {/* 1. Trang hồ sơ cá nhân */}
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <span className="text-base">👤</span>
                        <span>Hồ sơ cá nhân (Profile)</span>
                      </Link>

                      {/* 2. Đơn hàng của tôi */}
                      <Link
                        href="/orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <span className="text-base">📦</span>
                        <span>Đơn hàng của tôi</span>
                      </Link>

                      {/* 3. Phân quyền Admin nếu có */}
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full text-left px-4 py-2.5 text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-2.5 font-semibold transition-colors"
                        >
                          <span className="text-base">⚙️</span>
                          <span>Trang Quản trị Admin</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      {/* 4. Đăng xuất */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <span className="text-base">🚪</span>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* CHƯA ĐĂNG NHẬP: Nút Đăng nhập & Đăng ký */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-700 hover:text-black px-3.5 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-black text-white text-xs px-4 py-2 rounded-full font-semibold hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* MODAL CHỈNH SỬA HỒ SƠ (PROFILE) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  👤
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Hồ sơ cá nhân</h3>
                  <p className="text-xs text-gray-400">Cập nhật thông tin tài khoản của bạn</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            {profileMessage.text && (
              <div
                className={`p-3 rounded-xl text-xs mb-4 ${
                  profileMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email (Cố định)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-gray-100 text-gray-500 rounded-xl px-3.5 py-2.5 text-xs outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="0912345678"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition"
                />
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-900 mb-2">Đổi mật khẩu (Bỏ trống nếu không đổi)</p>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                    minLength={6}
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs outline-none transition"
                  />
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={profilePasswordConfirm}
                    onChange={(e) => setProfilePasswordConfirm(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs outline-none transition"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-semibold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex-1 bg-black hover:bg-gray-800 text-white py-2.5 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                >
                  {profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
