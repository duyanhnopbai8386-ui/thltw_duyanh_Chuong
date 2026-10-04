import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
        <div>
          <h3 className="text-xl font-bold mb-4">ShopDuyAnh</h3>
          <p className="text-gray-400">
            Hệ thống cửa hàng cung cấp sản phẩm chất lượng cao, giá cả hợp lý. Luôn đồng hành cùng bạn.
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/" className="hover:text-white transition">Trang chủ</Link></li>
            <li><Link href="/products" className="hover:text-white transition">Sản phẩm</Link></li>
            <li><Link href="/cart" className="hover:text-white transition">Giỏ hàng</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Email: duyanhnopbai8386@gmail.com</li>
            <li>SĐT: 0123.456.789</li>
            <li>Địa chỉ: Khu công nghệ cao, TP.HCM</li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm mt-8">
        &copy; {new Date().getFullYear()} ShopDuyAnh. Đồ án Thực hành Web.
      </div>
    </footer>
  );
}
