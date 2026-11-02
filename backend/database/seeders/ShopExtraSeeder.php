<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Contact;
use App\Models\Promotion;
use Illuminate\Database\Seeder;

class ShopExtraSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Banners
        $banners = [
            [
                'name' => 'Banner iPhone 16 Pro Max Đỉnh Cao',
                'image' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1400&auto=format&fit=crop',
                'link' => '/products',
                'position' => 'slideshow',
                'sort_order' => 1,
                'status' => 1,
            ],
            [
                'name' => 'Ưu đãi Củ sạc nhanh & Pin dự phòng GaN',
                'image' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1400&auto=format&fit=crop',
                'link' => '/products?category_id=3',
                'position' => 'slideshow',
                'sort_order' => 2,
                'status' => 1,
            ],
        ];
        foreach ($banners as $b) {
            Banner::updateOrCreate(['name' => $b['name']], $b);
        }

        // 2. Seed Promotions / Vouchers
        $promotions = [
            [
                'code' => 'GIAM50K',
                'name' => 'Giảm ngay 50.000đ cho đơn từ 500k',
                'discount_amount' => 50000,
                'discount_percent' => 0,
                'min_order_value' => 500000,
                'start_date' => now()->subDays(5),
                'end_date' => now()->addDays(30),
                'usage_limit' => 200,
                'status' => 1,
            ],
            [
                'code' => 'VIP10',
                'name' => 'Giảm 10% cho thành viên thân thiết',
                'discount_amount' => 0,
                'discount_percent' => 10,
                'min_order_value' => 1000000,
                'start_date' => now()->subDays(5),
                'end_date' => now()->addDays(30),
                'usage_limit' => 100,
                'status' => 1,
            ],
        ];
        foreach ($promotions as $p) {
            Promotion::updateOrCreate(['code' => $p['code']], $p);
        }

        // 3. Seed Contacts
        $contacts = [
            [
                'name' => 'Trần Văn Hùng',
                'email' => 'hung.tran@gmail.com',
                'phone' => '0912345678',
                'title' => 'Tư vấn mua sạc nhanh cho MacBook M3',
                'content' => 'Tôi muốn hỏi củ sạc GaN 65W Baseus có sạc được cùng lúc cho iPhone 15 và MacBook Air M3 không?',
                'status' => 1, // Đã xử lý
            ],
            [
                'name' => 'Hoàng Mai Anh',
                'email' => 'maianh.hoang@gmail.com',
                'phone' => '0987654321',
                'title' => 'Hỏi về thời gian giao hàng tại Quận 7',
                'content' => 'Nếu tôi đặt hàng hôm nay thì bao lâu nhận được tại đường Nguyễn Thị Thập, Quận 7?',
                'status' => 0, // Chưa xử lý
            ],
        ];
        foreach ($contacts as $c) {
            Contact::firstOrCreate(['email' => $c['email'], 'title' => $c['title']], $c);
        }
    }
}
