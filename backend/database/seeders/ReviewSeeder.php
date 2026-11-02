<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::all();
        if ($products->isEmpty()) return;

        $sampleReviews = [
            [
                'user_name' => 'Nguyễn Minh Quân',
                'user_email' => 'quan.nguyen@gmail.com',
                'rating' => 5,
                'comment' => 'Sản phẩm chính hãng, đóng gói rất kỹ càng. Dùng mượt mà và pin cực trâu, rất hài lòng!',
            ],
            [
                'user_name' => 'Trần Thu Hà',
                'user_email' => 'thuha.tran@outlook.com',
                'rating' => 5,
                'comment' => 'Giao hàng siêu nhanh chỉ 2 tiếng là nhận được. Thiết kế sang trọng, cầm chắc tay.',
            ],
            [
                'user_name' => 'Lê Hoàng Nam',
                'user_email' => 'namle.it@gmail.com',
                'rating' => 4,
                'comment' => 'Máy tốt trong tầm giá, nhân viên hỗ trợ nhiệt tình. Cho 4 sao vì shipper gọi lúc đang bận xíu.',
            ],
            [
                'user_name' => 'Đặng Thảo Vy',
                'user_email' => 'thaovy.dang@yahoo.com',
                'rating' => 5,
                'comment' => 'Mua làm quà tặng bạn gái, bạn khen nức nở luôn. Hàng nguyên seal chất lượng 10/10.',
            ],
        ];

        // Seed 2 - 4 reviews cho các sản phẩm đầu tiên
        foreach ($products->take(8) as $index => $product) {
            foreach ($sampleReviews as $rIndex => $rev) {
                // Đa dạng hóa số lượng review
                if (($index + $rIndex) % 2 === 0) {
                    Review::firstOrCreate(
                        [
                            'product_id' => $product->id,
                            'user_name' => $rev['user_name'],
                        ],
                        [
                            'user_email' => $rev['user_email'],
                            'rating' => $rev['rating'],
                            'comment' => $rev['comment'],
                            'is_buyer' => (($index + $rIndex) % 3 !== 1),
                            'status' => 1,
                            'created_at' => now()->subDays(rand(1, 15)),
                        ]
                    );
                }
            }
        }
    }
}
