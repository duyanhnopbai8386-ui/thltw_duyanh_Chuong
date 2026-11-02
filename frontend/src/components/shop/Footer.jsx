import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] text-[#1d1d1f] pt-16 pb-8 mt-auto text-sm border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
             <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>
              </div>
            DuyAnhStore
          </h3>
          <p className="text-gray-500 max-w-sm leading-relaxed text-xs">
            Hệ sinh thái mua sắm thiết bị công nghệ Apple và phụ kiện cao cấp chính hãng. 
            Cam kết 100% nguyên seal, bảo hành 1 đổi 1 trong 30 ngày.
          </p>
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p>Hotline: <strong className="text-gray-900">1900 8888</strong> (8:00 - 21:30)</p>
            <p>Email: <strong className="text-gray-900">support@duyanhstore.vn</strong></p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4 text-gray-900 text-xs uppercase tracking-wider">Khám phá</h3>
          <ul className="space-y-2.5 text-xs text-gray-500">
            <li><Link href="/" className="hover:text-black transition-colors">Trang chủ</Link></li>
            <li><Link href="/products" className="hover:text-black transition-colors">Tất cả sản phẩm</Link></li>
            <li><Link href="/posts" className="hover:text-black transition-colors">Tin tức công nghệ</Link></li>
            <li><Link href="/cart" className="hover:text-black transition-colors">Giỏ hàng</Link></li>
            <li><Link href="/orders" className="hover:text-black transition-colors">Tra cứu đơn hàng</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-gray-900 text-xs uppercase tracking-wider">Chính sách & Hỗ trợ</h3>
          <ul className="space-y-2.5 text-xs text-gray-500">
            <li><Link href="/pages/gioi-thieu" className="hover:text-black transition-colors">Giới thiệu công ty</Link></li>
            <li><Link href="/pages/chinh-sach-bao-hanh" className="hover:text-black transition-colors">Chính sách bảo hành & Đổi trả</Link></li>
            <li><Link href="/pages/huong-dan-mua-hang" className="hover:text-black transition-colors">Hướng dẫn mua hàng</Link></li>
            <li><Link href="/contact" className="hover:text-black transition-colors">Liên hệ đóng góp ý kiến</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>Bản quyền © {new Date().getFullYear()} DuyAnhStore Inc. Bảo lưu mọi quyền.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/pages/chinh-sach-bao-hanh" className="hover:text-black transition-colors">Chính sách bảo mật</Link>
          <span className="border-l border-gray-400"></span>
          <Link href="/pages/huong-dan-mua-hang" className="hover:text-black transition-colors">Điều khoản dịch vụ</Link>
        </div>
      </div>
    </footer>
  );
}
