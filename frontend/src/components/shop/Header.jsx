import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-lg border-b border-gray-200/50 transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>
          </div>
          <span>DuyAnh<span className="font-light">Store</span></span>
        </Link>

        {/* Menu Navigation */}
        <nav className="hidden md:flex space-x-10">
          <Link href="/" className="text-[15px] text-gray-600 hover:text-black font-medium transition-colors">
            Cửa hàng
          </Link>
          <Link href="/products" className="text-[15px] text-gray-600 hover:text-black font-medium transition-colors">
            Quần áo
          </Link>
          <Link href="/products" className="text-[15px] text-gray-600 hover:text-black font-medium transition-colors">
            Phụ kiện
          </Link>
          <Link href="/cart" className="text-[15px] text-gray-600 hover:text-black font-medium transition-colors flex items-center gap-1">
            Giỏ hàng 
            <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full">0</span>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link href="/login" className="text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">
            Đăng nhập
          </Link>
          <Link href="/register" className="bg-black text-white text-sm px-5 py-2 rounded-full font-medium hover:scale-105 active:scale-95 transition-all">
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
