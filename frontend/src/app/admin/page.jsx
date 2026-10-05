export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan hệ thống (Dashboard)</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Tổng sản phẩm</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">128</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Đơn hàng mới</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Khách hàng</p>
          <p className="text-3xl font-bold text-green-600 mt-2">45</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Doanh thu tháng</p>
          <p className="text-3xl font-bold text-red-600 mt-2">45.000.000đ</p>
        </div>
      </div>
    </div>
  );
}
