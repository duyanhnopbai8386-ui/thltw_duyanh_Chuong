// src/app/admin/page.js
export default function AdminDashboard() {
    const stats = [
        { title: 'Tổng doanh thu', value: '32.500.000 đ', icon: '💰', color: 'bg-green-500' },
        { title: 'Đơn hàng mới', value: '142', icon: '🛒', color: 'bg-blue-500' },
        { title: 'Sản phẩm', value: '48', icon: '📦', color: 'bg-purple-500' },
        { title: 'Khách hàng', value: '1,230', icon: '👥', color: 'bg-orange-500' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan hệ thống</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                            <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}