'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setAuthorized(true);
            return;
        }

        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('admin_user') || localStorage.getItem('user') || 'null');
        } catch (e) {}

        if (!token || user?.role !== 'admin') {
            window.location.replace('/admin/login');
            return;
        }

        setAuthorized(true);
    }, [pathname]);

    // Nếu ở trang đăng nhập admin thì hiển thị giao diện login riêng, không kèm sidebar
    if (pathname === '/admin/login') {
        return children;
    }

    if (!authorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-400 font-medium text-sm">
                Đang chuyển hướng về đăng nhập...
            </div>
        );
    }

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Quản lý Sản phẩm', href: '/admin/products', icon: '📦' },
        { name: 'Quản lý Danh mục', href: '/admin/categories', icon: '📁' },
        { name: 'Quản lý Thương hiệu', href: '/admin/brands', icon: '🏷️' },
        { name: 'Quản lý Đơn hàng', href: '/admin/orders', icon: '🛒' },
        { name: 'Đánh giá (Reviews)', href: '/admin/reviews', icon: '⭐' },
        { name: 'Quản lý Bài viết', href: '/admin/posts', icon: '📝' },
        { name: 'Quản lý Trang đơn', href: '/admin/pages', icon: '📄' },
        { name: 'Banner quảng cáo', href: '/admin/banners', icon: '🖼️' },
        { name: 'Mã khuyến mãi', href: '/admin/promotions', icon: '🎟️' },
        { name: 'Hộp thư Liên hệ', href: '/admin/contacts', icon: '💬' },
        { name: 'Quản lý Menu', href: '/admin/menus', icon: '📑' },
        { name: 'Quản lý Người dùng', href: '/admin/users', icon: '👥' },
        { name: 'Cấu hình hệ thống', href: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
                <div className="p-5 text-xl font-bold tracking-wider border-b border-gray-800 flex items-center gap-2">
                    <span>⚡</span>
                    <span>Admin Panel</span>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-3 border-t border-gray-800 bg-gray-950">
                    <button
                        onClick={() => {
                            localStorage.removeItem('admin_token');
                            localStorage.removeItem('admin_user');
                            window.location.replace('/admin/login');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-gray-800 rounded-xl transition-colors font-semibold flex items-center gap-2"
                    >
                        <span>🚪</span>
                        <span>Đăng xuất Quản trị</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm shrink-0">
                    <h1 className="text-base font-bold text-gray-800">Hệ thống quản lý E-Commerce Fullstack</h1>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-full font-medium transition flex items-center gap-1"
                        >
                            <span>🌐</span>
                            <span>Xem Website</span>
                        </Link>
                        <div className="flex items-center gap-2 border-l pl-4">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                A
                            </div>
                            <span className="text-xs font-semibold text-gray-700">Administrator</span>
                        </div>
                    </div>
                </header>

                {/* Body Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
