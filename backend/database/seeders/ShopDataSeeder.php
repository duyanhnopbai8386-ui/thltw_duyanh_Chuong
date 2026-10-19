<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Menu;

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

        // 3. Products
        $products = [
            // Điện Thoại
            [
                'name' => 'iPhone 16 Pro Max 256GB Titan Sa Mạc',
                'slug' => 'iphone-16-pro-max-256gb',
                'category_id' => $catPhone->id,
                'brand_id' => $brandApple->id,
                'price' => 34990000,
                'sale_price' => 32490000,
                'stock' => 30,
                'status' => 1,
                'image' => '/storage/products/6k8p1vWHq4RFDIY6QTKrlJSg7J237Me8xMx7pwuY.webp',
                'description' => 'Khung viền Titan sa mạc cao cấp, chip A18 Pro mạnh mẽ, phím Camera Control thế hệ mới.',
            ],
            [
                'name' => 'iPhone 15 Pro Max 256GB',
                'slug' => 'iphone-15-pro-max-256gb',
                'category_id' => $catPhone->id,
                'brand_id' => $brandApple->id,
                'price' => 31990000,
                'sale_price' => 28990000,
                'stock' => 50,
                'status' => 1,
                'image' => '/storage/products/6k8p1vWHq4RFDIY6QTKrlJSg7J237Me8xMx7pwuY.webp',
                'description' => 'Khung Titan chuẩn hàng không vũ trụ, chip A17 Pro mượt mà đỉnh cao.',
            ],
            // iPad & Máy Tính Bảng
            [
                'name' => 'iPad Pro M4 11 inch Wi-Fi 256GB',
                'slug' => 'ipad-pro-m4-11-inch-256gb',
                'category_id' => $catTablet->id,
                'brand_id' => $brandApple->id,
                'price' => 28990000,
                'sale_price' => 26990000,
                'stock' => 20,
                'status' => 1,
                'image' => '/storage/products/jixGq7CwREkRkOcig3DV6uk17fXgyU1XaCJVfhJf.webp',
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
                'image' => '/storage/products/mBRRyqyy9yZsZePcDc9tYrWSuEBOwjswXQXCQYVF.webp',
                'description' => 'Thiết kế trẻ trung, sức mạnh chip M2 hỗ trợ Apple Pencil Pro vẽ và ghi chú đỉnh cao.',
            ],
            // Cáp & Củ Sạc Nhanh
            [
                'name' => 'Củ sạc nhanh Anker 30W GaN Nano 3',
                'slug' => 'cu-sac-nhanh-anker-30w-gan-nano-3',
                'category_id' => $catCharger->id,
                'brand_id' => $brandAnker->id,
                'price' => 450000,
                'sale_price' => 350000,
                'stock' => 100,
                'status' => 1,
                'image' => '/storage/products/sQq56kS4ILQJXOYQ6rpFSQnLReGQXlTOESSBZye2.webp',
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
                'image' => '/storage/products/ihIwceme8ZzGE8wGcWvQo2YkH5QrgMcf9xRKUwVs.jpg',
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
                'image' => '/storage/products/sQq56kS4ILQJXOYQ6rpFSQnLReGQXlTOESSBZye2.webp',
                'description' => 'Chuẩn sạc không dây nam châm Qi2 sạc đồng thời iPhone, Apple Watch và AirPods.',
            ],
            // Pin Sạc Dự Phòng
            [
                'name' => 'Pin sạc dự phòng Baseus Blade 20000mAh 65W Siêu Mỏng',
                'slug' => 'pin-sac-du-phong-baseus-blade-20000mah',
                'category_id' => $catPowerBank->id,
                'brand_id' => $brandBaseus->id,
                'price' => 1250000,
                'sale_price' => 990000,
                'stock' => 50,
                'status' => 1,
                'image' => '/storage/products/QOoyfGjXZ6tbN5mCbm4A0L4ks12aeHItDJmxdX17.webp',
                'description' => 'Thiết kế dẹp mỏng như quyển sổ, sạc nhanh 65W cứu cánh cho cả iPad và laptop khi di chuyển.',
            ],
            // Tai Nghe & Âm Thanh
            [
                'name' => 'Tai nghe Apple AirPods Pro 2 USB-C',
                'slug' => 'tai-nghe-apple-airpods-pro-2-usbc',
                'category_id' => $catAudio->id,
                'brand_id' => $brandApple->id,
                'price' => 6190000,
                'sale_price' => 5490000,
                'stock' => 60,
                'status' => 1,
                'image' => '/storage/products/37MzVut6llAq06cVtCBvCvzWLmDVj2uRdOr4NfE4.png',
                'description' => 'Cổng sạc Type-C thế hệ mới, chống ồn chủ động gấp đôi, kháng nước và bụi chuẩn IP54.',
            ],
            [
                'name' => 'Tai nghe chống ồn Sony WH-1000XM5',
                'slug' => 'tai-nghe-chong-on-sony-wh-1000xm5',
                'category_id' => $catAudio->id,
                'brand_id' => $brandSony->id,
                'price' => 8990000,
                'sale_price' => 7490000,
                'stock' => 30,
                'status' => 1,
                'image' => '/storage/products/7dhZOHyjejmFn5fgwNcQVUOb8q9vr8AjZWpXa0H9.webp',
                'description' => 'Khử tiếng ồn đỉnh cao hàng đầu ngành công nghiệp với 8 microphone và 2 bộ xử lý âm thanh.',
            ],
            // Ốp Lưng & Bao Da
            [
                'name' => 'Ốp lưng iPhone 16 Pro Max MagSafe trong suốt',
                'slug' => 'op-lung-iphone-16-pro-max-magsafe',
                'category_id' => $catCase->id,
                'brand_id' => $brandBaseus->id,
                'price' => 450000,
                'sale_price' => 320000,
                'stock' => 80,
                'status' => 1,
                'image' => '/storage/products/sQq56kS4ILQJXOYQ6rpFSQnLReGQXlTOESSBZye2.webp',
                'description' => 'Chất liệu TPU cao cấp chống ố vàng, tích hợp vòng nam châm MagSafe hít siêu chắc.',
            ],
            [
                'name' => 'Bao da iPad Pro 11 inch Smart Folio',
                'slug' => 'bao-da-ipad-pro-11-inch-smart-folio',
                'category_id' => $catCase->id,
                'brand_id' => $brandApple->id,
                'price' => 1890000,
                'sale_price' => 1590000,
                'stock' => 40,
                'status' => 1,
                'image' => '/storage/products/brJTmBoViXGugtYp9z1SoOuAM9b0oOmPNj5KdHrF.jpg',
                'description' => 'Bao da nam châm siêu mỏng bảo vệ cả 2 mặt trước sau, tự động tắt mở màn hình thông minh.',
            ],
            // Bút Cảm Ứng & Bàn Phím
            [
                'name' => 'Bút cảm ứng Apple Pencil Pro',
                'slug' => 'but-cam-ung-apple-pencil-pro',
                'category_id' => $catStylus->id,
                'brand_id' => $brandApple->id,
                'price' => 3490000,
                'sale_price' => 3190000,
                'stock' => 40,
                'status' => 1,
                'image' => '/storage/products/jixGq7CwREkRkOcig3DV6uk17fXgyU1XaCJVfhJf.webp',
                'description' => 'Hỗ trợ cảm biến lực bóp (Squeeze), xoay thân bút và rung phản hồi Haptic cực nhạy.',
            ],
            [
                'name' => 'Bàn phím Magic Keyboard cho iPad Pro 11 inch',
                'slug' => 'ban-phim-magic-keyboard-cho-ipad-pro-11-inch',
                'category_id' => $catStylus->id,
                'brand_id' => $brandApple->id,
                'price' => 8290000,
                'sale_price' => 7690000,
                'stock' => 20,
                'status' => 1,
                'image' => '/storage/products/jixGq7CwREkRkOcig3DV6uk17fXgyU1XaCJVfhJf.webp',
                'description' => 'Kê tay bằng nhôm sang trọng, dãy phím chức năng 14 phím và bàn di chuột Trackpad kính mượt mà.',
            ],
            // Kính Cường Lực
            [
                'name' => 'Kính cường lực Belkin UltraGlass 2 cho iPhone 16',
                'slug' => 'kinh-cuong-luc-belkin-ultraglass-2-cho-iphone-16',
                'category_id' => $catGlass->id,
                'brand_id' => $brandBelkin->id,
                'price' => 550000,
                'sale_price' => 420000,
                'stock' => 120,
                'status' => 1,
                'image' => '/storage/products/alGr7VoYcZG6xKRj8BP8z59LmVOPPcdGucGbE2Wd.webp',
                'description' => 'Độ cứng vượt trội gấp 2.7 lần, vát cạnh 2.5D mượt mà cho trải nghiệm vuốt chạm không cấn tay.',
            ],
            [
                'name' => 'Kính cường lực iPad Pro 11 inch Paper-feel',
                'slug' => 'kinh-cuong-luc-ipad-pro-11-inch-paper-feel',
                'category_id' => $catGlass->id,
                'brand_id' => $brandBaseus->id,
                'price' => 350000,
                'sale_price' => 280000,
                'stock' => 60,
                'status' => 1,
                'image' => '/storage/products/jixGq7CwREkRkOcig3DV6uk17fXgyU1XaCJVfhJf.webp',
                'description' => 'Bề mặt nhám mờ chống vân tay, cảm giác viết vẽ chân thực như trên giấy.',
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
