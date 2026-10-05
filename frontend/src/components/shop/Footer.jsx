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
          <p className="text-gray-500 max-w-sm leading-relaxed">
            Hệ sinh thái mua sắm công nghệ và thời trang cao cấp. 
            Tối giản, mượt mà và tận tâm.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Khám phá</h3>
          <ul className="space-y-3 text-gray-500">
            <li><Link href="/" className="hover:text-black transition-colors">Trang chủ</Link></li>
            <li><Link href="/products" className="hover:text-black transition-colors">Sản phẩm</Link></li>
            <li><Link href="/cart" className="hover:text-black transition-colors">Giỏ hàng</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Hỗ trợ</h3>
          <ul className="space-y-3 text-gray-500">
            <li><a href="#" className="hover:text-black transition-colors">Trung tâm trợ giúp</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Bảo hành</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Liên hệ hệ thống</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>Bản quyền © {new Date().getFullYear()} DuyAnhStore Inc. Bảo lưu mọi quyền.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-black transition-colors">Chính sách quyền riêng tư</a>
          <span className="border-l border-gray-400"></span>
          <a href="#" className="hover:text-black transition-colors">Điều khoản sử dụng</a>
        </div>
      </div>
    </footer>
  );
}
