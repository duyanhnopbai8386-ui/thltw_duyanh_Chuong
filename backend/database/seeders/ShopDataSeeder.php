<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;

class ShopDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        $catPhone = Category::firstOrCreate(['slug' => 'dien-thoai'], ['name' => 'Điện Thoại']);
        $catTablet = Category::firstOrCreate(['slug' => 'ipad-may-tinh-bang'], ['name' => 'iPad & Máy Tính Bảng']);
        $catCharger = Category::firstOrCreate(['slug' => 'cap-cu-sac-nhanh'], ['name' => 'Cáp & Củ Sạc Nhanh']);
        $catPowerBank = Category::firstOrCreate(['slug' => 'pin-sac-du-phong'], ['name' => 'Pin Sạc Dự Phòng']);
        $catAudio = Category::firstOrCreate(['slug' => 'tai-nghe-am-thanh'], ['name' => 'Tai Nghe & Âm Thanh']);
        $catCase = Category::firstOrCreate(['slug' => 'op-lung-bao-da'], ['name' => 'Ốp Lưng & Bao Da']);
        $catStylus = Category::firstOrCreate(['slug' => 'but-cam-ung-ban-phim'], ['name' => 'Bút Cảm Ứng & Bàn Phím']);
        $catGlass = Category::firstOrCreate(['slug' => 'kinh-cuong-luc'], ['name' => 'Kính Cường Lực']);

        // 2. Brands
        $brandApple = Brand::firstOrCreate(['slug' => 'apple'], ['name' => 'Apple']);
        $brandSamsung = Brand::firstOrCreate(['slug' => 'samsung'], ['name' => 'Samsung']);
        $brandAnker = Brand::firstOrCreate(['slug' => 'anker'], ['name' => 'Anker']);
        $brandBaseus = Brand::firstOrCreate(['slug' => 'baseus'], ['name' => 'Baseus']);
        $brandUgreen = Brand::firstOrCreate(['slug' => 'ugreen'], ['name' => 'Ugreen']);
        $brandBelkin = Brand::firstOrCreate(['slug' => 'belkin'], ['name' => 'Belkin']);
        $brandSony = Brand::firstOrCreate(['slug' => 'sony'], ['name' => 'Sony']);

        // 3. Products với đúng ảnh người dùng upload
        $products = [
            [
                'name' => 'iPhone 16 Pro Max 256GB Titan Sa Mạc',
                'slug' => 'iphone-16-pro-max-256gb',
                'category_id' => $catPhone->id,
                'brand_id' => $brandApple->id,
                'price' => 34990000,
                'sale_price' => 32490000,
                'stock' => 30,
                'status' => 1,
                'image' => '/storage/products/HFeGFxLBMnTYIi4rOSjKR8NZsSnBKhgupTDchtul.jpg',
                'description' => 'Khung viền Titan sa mạc cao cấp, chip A18 Pro mạnh mẽ, phím Camera Control thế hệ mới.',
            ],
            [
                'name' => 'iPad Pro M4 11 inch Wi-Fi 256GB',
                'slug' => 'ipad-pro-m4-11-inch-256gb',
                'category_id' => $catTablet->id,
                'brand_id' => $brandApple->id,
                'price' => 28990000,
                'sale_price' => 26990000,
                'stock' => 20,
                'status' => 1,
                'image' => '/storage/products/kCo2xQdogxEbVoYyZje5Xy7PwuMtaSGUsaJC6Cxv.webp',
                'description' => 'Màn hình Ultra Retina XDR OLED kép siêu mỏng nhẹ, chip Apple M4 đột phá hiệu năng đồ họa.',
            ],
            [
                'name' => 'iPad Air 6 M2 11 inch 128GB',
                'slug' => 'ipad-air-6-m2-11-inch-128gb',
                'category_id' => $catTablet->id,
                'brand_id' => $brandApple->id,
                'price' => 16990000,
                'sale_price' => 15490000,
                'stock' => 40,
                'status' => 1,
                'image' => '/storage/products/9Juh72E9NAvgh5fXBkNJjA3A4jqzLyBHiz0lH3ds.jpg',
                'description' => 'Thiết kế trẻ trung, sức mạnh chip M2 hỗ trợ Apple Pencil Pro vẽ và ghi chú đỉnh cao.',
            ],
            [
                'name' => 'Củ sạc nhanh Anker 30W GaN Nano 3',
                'slug' => 'cu-sac-nhanh-anker-30w-gan-nano-3',
                'category_id' => $catCharger->id,
                'brand_id' => $brandAnker->id,
                'price' => 450000,
                'sale_price' => 350000,
                'stock' => 100,
                'status' => 1,
                'image' => '/storage/products/10DQnSEaDbJfCN5WcGB7m1NxPsJ4lPYkOStM6tOs.jpg',
                'description' => 'Công nghệ chip GaN siêu nhỏ gọn bỏ túi, sạc nhanh tối đa 30W cho iPhone và iPad.',
            ],
            [
                'name' => 'Cáp sạc Ugreen USB-C to USB-C 100W bọc dù 1m',
                'slug' => 'cap-sac-ugreen-usbc-to-usbc-100w',
                'category_id' => $catCharger->id,
                'brand_id' => $brandUgreen->id,
                'price' => 220000,
                'sale_price' => 160000,
                'stock' => 150,
                'status' => 1,
                'image' => '/storage/products/fSfyEWiqDsPeTQyW8XRnTQb1829KvcQ1t0MN6aOo.jpg',
                'description' => 'Dây dù nylon siêu bền chống đứt gãy gập, truyền tải sạc nhanh 100W Power Delivery.',
            ],
            [
                'name' => 'Đế sạc không dây 3-in-1 Anker MagGo Qi2 15W',
                'slug' => 'de-sac-khong-day-3in1-anker-maggo',
                'category_id' => $catCharger->id,
                'brand_id' => $brandAnker->id,
                'price' => 2100000,
                'sale_price' => 1790000,
                'stock' => 35,
                'status' => 1,
                'image' => '/storage/products/jVAXYJypD50dHWpS9BJxhGnZxSaY7G2xt4pqr3d5.jpg',
                'description' => 'Chuẩn sạc không dây nam châm Qi2 sạc đồng thời iPhone, Apple Watch và AirPods.',
            ],
            [
                'name' => 'Pin sạc dự phòng Baseus Blade 20000mAh 65W Siêu Mỏng',
                'slug' => 'pin-sac-du-phong-baseus-blade-20000mah',
                'category_id' => $catPowerBank->id,
                'brand_id' => $brandBaseus->id,
                'price' => 1250000,
                'sale_price' => 990000,
                'stock' => 50,
                'status' => 1,
                'image' => '/storage/products/1zYNZbl4SsElMr353fThaZXC5lNXcCn1bpAhxmp7.jpg',
                'description' => 'Thiết kế dẹp mỏng như quyển sổ, sạc nhanh 65W cứu cánh cho cả iPad và laptop khi di chuyển.',
            ],
            [
                'name' => 'Bút cảm ứng Apple Pencil Pro',
                'slug' => 'but-cam-ung-apple-pencil-pro',
                'category_id' => $catStylus->id,
                'brand_id' => $brandApple->id,
                'price' => 3490000,
                'sale_price' => 3190000,
                'stock' => 40,
                'status' => 1,
                'image' => '/storage/products/GcJTLyPlus0luFLzlC34pzYpS7xSjBZ4XZS2ow98.jpg',
                'description' => 'Hỗ trợ cảm biến lực bóp (Squeeze), xoay thân bút và rung phản hồi Haptic cực nhạy.',
            ],
            [
                'name' => 'Samsung Galaxy Tab S9 Ultra 256GB',
                'slug' => 'samsung-galaxy-tab-s9-ultra',
                'category_id' => $catTablet->id,
                'brand_id' => $brandSamsung->id,
                'price' => 25990000,
                'sale_price' => 23990000,
                'stock' => 20,
                'status' => 1,
                'image' => '/storage/products/GICp6ch9olUInFCjwdUBGdiDnvipMkTUATM2Gn4a.jpg',
                'description' => 'Màn hình Dynamic AMOLED 2X 14.6 inch cực đại kèm bút S-Pen thế hệ mới.',
            ],
        ];

        foreach ($products as $pData) {
            Product::updateOrCreate(
                ['name' => $pData['name']],
                $pData
            );
        }
    }
}
