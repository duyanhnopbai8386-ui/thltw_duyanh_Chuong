const sidebarItems = [
  { label: "Tổng quan", active: true, icon: "📊" },
  { label: "Quản lý danh mục", icon: "📂" },
  { label: "Quản lý sản phẩm", icon: "📦" },
  { label: "Quản lý đơn hàng", icon: "🛒" },
  { label: "Khách hàng", icon: "👥" },
  { label: "Cài đặt", icon: "⚙️" },
];

const stats = [
  { title: "Tổng số danh mục", value: "5", change: "+2.4%", tone: "blue" },
  { title: "Tổng sản phẩm", value: "24", change: "+12.8%", tone: "green" },
  { title: "Đơn hàng mới", value: "3", change: "+1.2%", tone: "amber" },
  { title: "Doanh thu", value: "12.8M", change: "+8.1%", tone: "purple" },
];

const recentOrders = [
  { id: "#1042", customer: "Nguyễn Văn A", total: "2.450.000đ", status: "Đã xác nhận" },
  { id: "#1043", customer: "Trần Thị B", total: "1.980.000đ", status: "Chờ xử lý" },
  { id: "#1044", customer: "Lê Hoàng C", total: "3.160.000đ", status: "Đang giao" },
  { id: "#1045", customer: "Phạm Minh D", total: "920.000đ", status: "Hoàn thành" },
];

const activity = [
  { title: "Đã thêm danh mục mới", time: "10 phút trước", color: "bg-blue-500" },
  { title: "Sản phẩm mới được đăng", time: "1 giờ trước", color: "bg-emerald-500" },
  { title: "Đơn hàng #1042 được thanh toán", time: "3 giờ trước", color: "bg-amber-500" },
  { title: "Có 2 phản hồi khách hàng mới", time: "Hôm nay", color: "bg-violet-500" },
];

const sales = [48, 62, 55, 76, 68, 94, 82];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="flex w-72 flex-col bg-slate-950 text-slate-200">
          <div className="border-b border-slate-800 bg-slate-950 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Admin panel
            </p>
            <h1 className="mt-3 text-2xl font-bold text-white">NEXUS</h1>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  item.active
                    ? "bg-slate-800 text-white shadow-inner shadow-slate-700"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <button className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20">
              Đăng xuất
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 shadow-sm">
            <div>
              <p className="text-sm text-slate-500">Trang quản trị</p>
              <h2 className="text-2xl font-bold text-slate-800">Hệ thống Quản trị Website</h2>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Xin chào, Admin</p>
                <p className="text-xs text-slate-500">Quản trị viên</p>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">Trang Tổng Quan</h3>
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
                Xuất báo cáo
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{item.title}</p>
                      <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
                    </div>
                    <div
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.tone === "blue"
                          ? "bg-blue-100 text-blue-700"
                          : item.tone === "green"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.tone === "amber"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-violet-100 text-violet-700"
                      }`}
                    >
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Doanh thu</h4>
                    <p className="text-sm text-slate-500">Theo dõi xu hướng tháng này</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    +18.2%
                  </span>
                </div>

                <div className="flex h-52 items-end gap-3">
                  {sales.map((value, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-slate-900 to-blue-400"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        {"T" + (index + 1)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-lg font-bold text-slate-800">Hoạt động gần đây</h4>
                <div className="mt-5 space-y-4">
                  {activity.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-800">Đơn hàng gần đây</h4>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Xem tất cả
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-3 font-medium">Mã đơn</th>
                        <th className="pb-3 font-medium">Khách hàng</th>
                        <th className="pb-3 font-medium">Tổng tiền</th>
                        <th className="pb-3 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-slate-100 last:border-b-0">
                          <td className="py-3 font-semibold text-slate-700">{order.id}</td>
                          <td className="py-3 text-slate-600">{order.customer}</td>
                          <td className="py-3 text-slate-600">{order.total}</td>
                          <td className="py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                order.status === "Đã xác nhận"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : order.status === "Chờ xử lý"
                                    ? "bg-amber-100 text-amber-700"
                                    : order.status === "Đang giao"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-lg font-bold text-slate-800">Tóm tắt</h4>
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Tỷ lệ hoàn thành</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-800">84%</span>
                      <span className="text-xs font-medium text-emerald-600">+6.2%</span>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-slate-200">
                      <div className="h-2.5 w-[84%] rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Khách hàng mới</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-800">126</span>
                      <span className="text-xs font-medium text-blue-600">+9.4%</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Giỏ hàng đang chờ</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-800">14</span>
                      <span className="text-xs font-medium text-amber-600">Needs review</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
