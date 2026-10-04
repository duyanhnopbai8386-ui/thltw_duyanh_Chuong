import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ShopDuyAnh
        </Link>

        {/* Menu Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Trang chủ
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Sản phẩm
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Giỏ hàng <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">0</span>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
            Đăng nhập
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-sm">
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
