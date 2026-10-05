export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 text-blue-400">Admin Panel</h2>
        <nav className="space-y-4">
          <div className="text-gray-300 hover:text-white cursor-pointer">Dashboard</div>
          <div className="text-gray-300 hover:text-white cursor-pointer">Quản lý Sản phẩm</div>
          <div className="text-gray-300 hover:text-white cursor-pointer">Quản lý Danh mục</div>
          <div className="text-gray-300 hover:text-white cursor-pointer">Quản lý Thương hiệu</div>
          <div className="text-gray-300 hover:text-white cursor-pointer">Quản lý Đơn hàng</div>
        </nav>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b">
          <span className="font-semibold text-gray-700">Trang Quản Trị Hệ Thống</span>
          <span className="text-sm text-gray-500">Admin</span>
        </header>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
