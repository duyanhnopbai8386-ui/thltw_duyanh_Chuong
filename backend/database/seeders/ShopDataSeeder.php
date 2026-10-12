<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Menu;
use App\Models\User;

class ShopDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        $catPhone = Category::firstOrCreate(['slug' => 'dien-thoai'], ['name' => 'Điện Thoại']);
        $catLaptop = Category::firstOrCreate(['slug' => 'laptop'], ['name' => 'Laptop & Macbook']);
        $catAudio = Category::firstOrCreate(['slug' => 'tai-nghe-loa'], ['name' => 'Âm Thanh & Loa']);
        $catAccessory = Category::firstOrCreate(['slug' => 'phu-kien'], ['name' => 'Phụ Kiện Công Nghệ']);
        $catWatch = Category::firstOrCreate(['slug' => 'dong-ho'], ['name' => 'Đồng Hồ Thông Minh']);

        // 2. Brands
        $brandApple = Brand::firstOrCreate(['slug' => 'apple'], ['name' => 'Apple']);
        $brandSamsung = Brand::firstOrCreate(['slug' => 'samsung'], ['name' => 'Samsung']);
        $brandAsus = Brand::firstOrCreate(['slug' => 'asus'], ['name' => 'ASUS']);
        $brandSony = Brand::firstOrCreate(['slug' => 'sony'], ['name' => 'Sony']);

        // 3. Products
        $products = [
            [
                'name' => 'iPhone 15 Pro Max 256GB',
                'slug' => 'iphone-15-pro-max-256gb',
                'category_id' => $catPhone->id,
                'brand_id' => $brandApple->id,
                'price' => 34990000,
                'sale_price' => 29990000,
                'stock' => 50,
                'status' => 1,
                'image' => '/storage/products/6k8p1vWHq4RFDIY6QTKrlJSg7J237Me8xMx7pwuY.webp',
                'description' => 'Thiết kế khung Titan bền nhẹ chuẩn hàng không vũ trụ. Chip A17 Pro mạnh mẽ vượt trội.',
            ],
            [
                'name' => 'MacBook Pro 14 M3 Pro 18GB/512GB',
                'slug' => 'macbook-pro-14-m3-pro',
                'category_id' => $catLaptop->id,
                'brand_id' => $brandApple->id,
                'price' => 49990000,
                'sale_price' => 46990000,
                'stock' => 25,
                'status' => 1,
                'image' => '/storage/products/jixGq7CwREkRkOcig3DV6uk17fXgyU1XaCJVfhJf.webp',
                'description' => 'Màn hình Liquid Retina XDR đỉnh cao, thời lượng pin lên đến 22 giờ liên tục.',
            ],
            [
                'name' => 'Tai nghe Apple AirPods Pro 2 USB-C',
                'slug' => 'airpods-pro-2-usbc',
                'category_id' => $catAudio->id,
                'brand_id' => $brandApple->id,
                'price' => 6190000,
                'sale_price' => 5490000,
                'stock' => 80,
                'status' => 1,
                'image' => '/storage/products/37MzVut6llAq06cVtCBvCvzWLmDVj2uRdOr4NfE4.png',
                'description' => 'Chống ồn chủ động gấp 2 lần, âm thanh thích ứng đỉnh cao.',
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra 12GB/256GB',
                'slug' => 'samsung-galaxy-s24-ultra',
                'category_id' => $catPhone->id,
                'brand_id' => $brandSamsung->id,
                'price' => 31990000,
                'sale_price' => 27490000,
                'stock' => 40,
                'status' => 1,
                'image' => '/storage/products/alGr7VoYcZG6xKRj8BP8z59LmVOPPcdGucGbE2Wd.webp',
                'description' => 'Trải nghiệm quyền năng Galaxy AI tiên phong, camera zoom quang học 100x sắc nét.',
            ],
            [
                'name' => 'Laptop ASUS ROG Zephyrus G16 OLED',
                'slug' => 'asus-rog-zephyrus-g16',
                'category_id' => $catLaptop->id,
                'brand_id' => $brandAsus->id,
                'price' => 52990000,
                'sale_price' => 48990000,
                'stock' => 15,
                'status' => 1,
                'image' => '/storage/products/mBRRyqyy9yZsZePcDc9tYrWSuEBOwjswXQXCQYVF.webp',
                'description' => 'Laptop Gaming siêu mỏng nhẹ với màn hình OLED 240Hz, card đồ họa RTX 4070.',
            ],
            [
                'name' => 'Tai nghe chống ồn Sony WH-1000XM5',
                'slug' => 'sony-wh-1000xm5',
                'category_id' => $catAudio->id,
                'brand_id' => $brandSony->id,
                'price' => 8990000,
                'sale_price' => 7490000,
                'stock' => 30,
                'status' => 1,
                'image' => '/storage/products/7dhZOHyjejmFn5fgwNcQVUOb8q9vr8AjZWpXa0H9.webp',
                'description' => 'Khử tiếng ồn đỉnh cao hàng đầu ngành công nghiệp với 8 microphone và 2 bộ xử lý âm thanh.',
            ],
            [
                'name' => 'Apple Watch Series 9 GPS 45mm',
                'slug' => 'apple-watch-series-9-45mm',
                'category_id' => $catWatch->id,
                'brand_id' => $brandApple->id,
                'price' => 11290000,
                'sale_price' => 9990000,
                'stock' => 45,
                'status' => 1,
                'image' => '/storage/products/brJTmBoViXGugtYp9z1SoOuAM9b0oOmPNj5KdHrF.jpg',
                'description' => 'Màn hình sáng hơn gấp đôi, thao tác Chạm Hai Lần (Double Tap) kỳ diệu.',
            ],
            [
                'name' => 'Củ sạc nhanh Apple 20W Type-C',
                'slug' => 'cu-sac-apple-20w-type-c',
                'category_id' => $catAccessory->id,
                'brand_id' => $brandApple->id,
                'price' => 590000,
                'sale_price' => 490000,
                'stock' => 120,
                'status' => 1,
                'image' => '/storage/products/sQq56kS4ILQJXOYQ6rpFSQnLReGQXlTOESSBZye2.webp',
                'description' => 'Sạc nhanh an toàn cho iPhone, iPad hỗ trợ công nghệ sạc Power Delivery.',
            ],
            [
                'name' => 'Chuột không dây Apple Magic Mouse 2',
                'slug' => 'apple-magic-mouse-2',
                'category_id' => $catAccessory->id,
                'brand_id' => $brandApple->id,
                'price' => 2200000,
                'sale_price' => 1890000,
                'stock' => 60,
                'status' => 1,
                'image' => '/storage/products/ihIwceme8ZzGE8wGcWvQo2YkH5QrgMcf9xRKUwVs.jpg',
                'description' => 'Bề mặt cảm ứng đa điểm mượt mà, kết nối Bluetooth liền mạch với Mac.',
            ],
            [
                'name' => 'Loa Bluetooth Sony SRS-XE300',
                'slug' => 'loa-sony-srs-xe300',
                'category_id' => $catAudio->id,
                'brand_id' => $brandSony->id,
                'price' => 3990000,
                'sale_price' => 3190000,
                'stock' => 35,
                'status' => 1,
                'image' => '/storage/products/QOoyfGjXZ6tbN5mCbm4A0L4ks12aeHItDJmxdX17.webp',
                'description' => 'Bộ khuếch tán dạng đường thẳng độc quyền, chuẩn kháng nước bụi IP67 pin 24 giờ.',
            ],
            [
                'name' => 'Samsung Galaxy Tab S9 Ultra 256GB',
                'slug' => 'samsung-galaxy-tab-s9-ultra',
                'category_id' => $catPhone->id,
                'brand_id' => $brandSamsung->id,
                'price' => 25990000,
                'sale_price' => null,
                'stock' => 20,
                'status' => 1,
                'image' => '/storage/products/6k8p1vWHq4RFDIY6QTKrlJSg7J237Me8xMx7pwuY.webp',
                'description' => 'Màn hình Dynamic AMOLED 2X 14.6 inch cực đại kèm bút S-Pen thế hệ mới.',
            ],
            [
                'name' => 'Bàn phím cơ không dây ASUS ROG Falchion Ace',
                'slug' => 'ban-phim-asus-rog-falchion-ace',
                'category_id' => $catAccessory->id,
                'brand_id' => $brandAsus->id,
                'price' => 3490000,
                'sale_price' => 2990000,
                'stock' => 50,
                'status' => 1,
                'image' => '/storage/products/jixGq7CwREkRkOcig3DV6uk17fXgyU1XaCJVfhJf.webp',
                'description' => 'Bố cục 65% nhỏ gọn, switch cơ học ROG NX đã bôi trơn sẵn cho cảm giác gõ êm ái.',
            ],
        ];

        foreach ($products as $pData) {
            Product::updateOrCreate(
                ['slug' => $pData['slug']],
                $pData
            );
        }

        // 4. Seed Menus
        $headerMenus = [
            ['name' => 'Trang chủ', 'link' => '/', 'position' => 'header', 'sort_order' => 1],
            ['name' => 'Sản phẩm', 'link' => '/products', 'position' => 'header', 'sort_order' => 2],
            ['name' => 'Tin tức & Đánh giá', 'link' => '/posts', 'position' => 'header', 'sort_order' => 3],
            ['name' => 'Đơn hàng của tôi', 'link' => '/orders', 'position' => 'header', 'sort_order' => 4],
        ];

        foreach ($headerMenus as $m) {
            Menu::updateOrCreate(
                ['link' => $m['link'], 'position' => $m['position']],
                $m
            );
        }

        $footerMenus = [
            ['name' => 'Giới thiệu công ty', 'link' => '/about', 'position' => 'footer', 'sort_order' => 1],
            ['name' => 'Chính sách mua hàng & Bảo hành', 'link' => '/policy', 'position' => 'footer', 'sort_order' => 2],
            ['name' => 'Liên hệ hỗ trợ', 'link' => '/contact', 'position' => 'footer', 'sort_order' => 3],
        ];

        foreach ($footerMenus as $m) {
            Menu::updateOrCreate(
                ['link' => $m['link'], 'position' => $m['position']],
                $m
            );
        }
    }
}
