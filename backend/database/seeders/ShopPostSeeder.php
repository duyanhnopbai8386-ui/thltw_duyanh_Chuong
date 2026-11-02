<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class ShopPostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Đánh giá iPhone 16 Pro Max: Đỉnh cao công nghệ và nút Camera Control',
                'slug' => 'danh-gia-iphone-16-pro-max',
                'thumbnail' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
                'summary' => 'Chi tiết về siêu phẩm iPhone 16 Pro Max với chip A18 Pro, khung titan sa mạc cực đẹp và trải nghiệm phím Camera Control độc đáo.',
                'content' => 'iPhone 16 Pro Max năm nay mang đến một bước đột phá lớn về trải nghiệm nhiếp ảnh và hiệu năng. Với chip xử lý Apple A18 Pro tiến trình 3nm thế hệ thứ 2, máy xử lý mọi tác vụ đồ họa và trí tuệ nhân tạo Apple Intelligence một cách mượt mà.\n\nĐiểm nhấn lớn nhất là phím bấm Camera Control nằm ở cạnh phải, cho phép người dùng mở nhanh máy ảnh, trượt để zoom hoặc chỉnh khẩu độ như một chiếc máy ảnh cơ chuyên nghiệp. Màn hình Super Retina XDR 6.9 inch viền siêu mỏng cũng mang lại góc nhìn vô cùng mãn nhãn.',
                'status' => true,
                'views' => 1250,
            ],
            [
                'title' => 'Top 5 phụ kiện cáp sạc và pin dự phòng không thể thiếu cho dân văn phòng',
                'slug' => 'top-5-phu-kien-sac-pin-du-phong-van-phong',
                'thumbnail' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
                'summary' => 'Gợi ý những dòng củ sạc nhanh GaN 65W nhỏ gọn, pin dự phòng sạc không dây từ tính Anker, Baseus giúp bàn làm việc gọn gàng.',
                'content' => 'Trong kỷ nguyên số, việc trang bị những phụ kiện sạc thông minh giúp tăng hiệu suất làm việc đáng kể. Củ sạc công nghệ GaN hiện nay có kích thước chỉ bằng một nửa so với củ sạc truyền thống nhưng cung cấp công suất lên tới 65W - 100W, sạc cùng lúc cả MacBook và điện thoại.\n\nNgoài ra, pin sạc dự phòng chuẩn Qi2 và MagSafe hít từ tính mặt lưng giúp bạn thoải mái di chuyển mà không cần dây cáp rườm rà. Hãy chọn những thương hiệu uy tín như Anker, Baseus, Ugreen để đảm bảo an toàn phòng chống cháy nổ.',
                'status' => true,
                'views' => 840,
            ],
            [
                'title' => 'Bí quyết bảo quản tai nghe Bluetooth và loa không dây luôn bền bỉ',
                'slug' => 'bi-quyet-bao-quan-tai-nghe-bluetooth-ben-dep',
                'thumbnail' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop',
                'summary' => 'Hướng dẫn vệ sinh đúng cách, mẹo sạc pin chống chai và bảo quản màng loa tai nghe chống ẩm mốc mùa mưa.',
                'content' => 'Tai nghe True Wireless rất dễ bị bám bụi và giảm chất lượng âm thanh sau một thời gian sử dụng nếu không được vệ sinh đúng cách. Bạn nên sử dụng cọ lông mềm hoặc tăm bông thấm cồn y tế 70 độ để làm sạch đầu tip silicon và lưới loa.\n\nKhông nên để hộp sạc cạn pin trong thời gian dài. Giữ pin ở mức 20% đến 80% sẽ giúp tăng gấp đôi tuổi thọ cell pin lithium. Khi tập thể thao xong, hãy lau khô mồ hôi trước khi đặt tai nghe vào dock sạc.',
                'status' => true,
                'views' => 620,
            ],
            [
                'title' => 'Chính sách bảo hành 1 đổi 1 trong 30 ngày tại hệ thống cửa hàng chúng tôi',
                'slug' => 'chinh-sach-bao-hanh-1-doi-1-uy-tin',
                'thumbnail' => 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=800&auto=format&fit=crop',
                'summary' => 'Tìm hiểu quyền lợi của khách hàng khi mua sắm: Đổi trả miễn phí 30 ngày, bảo hành chính hãng 12-24 tháng trên toàn quốc.',
                'content' => 'Với phương châm đặt sự hài lòng của khách hàng lên hàng đầu, cửa hàng cam kết cung cấp 100% sản phẩm chính hãng với tem phụ và hóa đơn VAT đầy đủ.\n\nTrong 30 ngày đầu tiên nếu thiết bị gặp bất kỳ lỗi kỹ thuật nào từ nhà sản xuất, khách hàng sẽ được đổi ngay một sản phẩm mới nguyên seal mà không mất thêm bất kỳ chi phí nào. Đội ngũ kỹ thuật viên sẵn sàng hỗ trợ trực tuyến 24/7.',
                'status' => true,
                'views' => 2100,
            ],
        ];

        foreach ($posts as $p) {
            Post::updateOrCreate(
                ['slug' => $p['slug']],
                $p
            );
        }
    }
}
