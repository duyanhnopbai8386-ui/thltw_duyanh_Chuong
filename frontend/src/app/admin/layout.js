'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setAuthorized(true);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
        } else {
            setAuthorized(true);
        }
    }, [pathname, router]);

    // Nếu ở trang đăng nhập admin thì hiển thị giao diện login riêng, không kèm sidebar
    if (pathname === '/admin/login') {
        return children;
    }

    if (!authorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-500 font-medium">
                Đang kiểm tra quyền quản trị...
            </div>
        );
    }

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Quản lý Sản phẩm', href: '/admin/products', icon: '📦' },
        { name: 'Quản lý Danh mục', href: '/admin/categories', icon: '📁' },
        { name: 'Quản lý Thương hiệu', href: '/admin/brands', icon: '🏷️' },
        { name: 'Quản lý Đơn hàng', href: '/admin/orders', icon: '🛒' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-5 text-xl font-bold tracking-wider border-b border-gray-800">
                    ⚡ Admin Panel
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/admin/login';
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        🚪 Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-lg font-semibold text-gray-800">Hệ thống quản lý E-Commerce</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">Admin Chuong</span>
                        <div className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                            C
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}