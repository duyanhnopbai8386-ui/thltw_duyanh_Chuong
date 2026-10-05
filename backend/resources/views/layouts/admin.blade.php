<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans">

    <div class="flex h-screen bg-gray-200">
        <!-- Sidebar -->
        <div class="w-64 bg-gray-900 text-white flex flex-col">
            <div class="p-5 text-2xl font-bold tracking-wider bg-gray-950 border-b border-gray-800">
                ADMIN PANEL
            </div>
            <nav class="flex-1 p-4 space-y-2">
                <a href="/admin/dashboard" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800">📊 Tổng quan</a>
                <a href="/admin/categories" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800">📂 Quản lý danh mục</a>
                <a href="/admin/products" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800">📦 Quản lý sản phẩm</a>
                <a href="/admin/orders" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800">🛒 Quản lý đơn hàng</a>
            </nav>
            <div class="p-4 bg-gray-950 border-t border-gray-800">
                <a href="#" class="block text-red-400 hover:text-red-300 font-medium">Đăng xuất</a>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Header -->
            <header class="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
                <h1 class="text-xl font-semibold text-gray-800">Hệ thống Quản trị Website</h1>
                <div class="text-gray-600 font-medium text-sm">Xin chào, Admin</div>
            </header>

            <!-- Page Content -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                @yield('content')
            </main>
        </div>
    </div>

</body>
</html>