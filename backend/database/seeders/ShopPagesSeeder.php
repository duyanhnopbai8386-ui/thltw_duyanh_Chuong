<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class ShopPagesSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Giới thiệu về DuyAnh Store',
                'slug' => 'gioi-thieu',
                'content' => "Chào mừng quý khách đến với DuyAnh Store – Hệ thống bán lẻ thiết bị công nghệ và phụ kiện chính hãng hàng đầu tại Việt Nam.\n\nĐược thành lập từ niềm đam mê với công nghệ đỉnh cao, chúng tôi cam kết mang tới cho khách hàng những sản phẩm nguyên seal 100%, bảo hành chính hãng từ các thương hiệu hàng đầu thế giới như Apple, Samsung, Anker, Baseus, Ugreen.\n\nĐội ngũ nhân sự tận tâm luôn sẵn sàng lắng nghe, tư vấn và hỗ trợ kỹ thuật 24/7 để mang lại trải nghiệm mua sắm hoàn hảo nhất.",
                'status' => 'published',
            ],
            [
                'title' => 'Chính sách bảo hành & Đổi trả',
                'slug' => 'chinh-sach-bao-hanh',
                'content' => "1. Chính sách 1 đổi 1 trong 30 ngày:\nNếu sản phẩm phát sinh lỗi kỹ thuật do nhà sản xuất trong vòng 30 ngày kể từ ngày nhận hàng, khách hàng sẽ được đổi ngay sản phẩm mới 100% nguyên hộp.\n\n2. Thời hạn bảo hành:\n- Điện thoại iPhone, iPad, MacBook: Bảo hành 12 tháng tại các trung tâm ủy quyền toàn quốc.\n- Cáp sạc, Củ sạc nhanh, Pin sạc dự phòng: Bảo hành 18 - 24 tháng theo quy định từng hãng.\n\n3. Điều kiện bảo hành:\n- Sản phẩm còn nguyên tem bảo hành, số Serial/IMEI trùng khớp với hóa đơn điện tử được gửi về email khi mua hàng.",
                'status' => 'published',
            ],
            [
                'title' => 'Hướng dẫn mua hàng & Thanh toán',
                'slug' => 'huong-dan-mua-hang',
                'content' => "Quy trình mua hàng trực tuyến tại DuyAnh Store vô cùng đơn giản với 4 bước:\n\nBước 1: Chọn sản phẩm yêu thích và bấm \"Thêm vào giỏ hàng\" hoặc \"Mua ngay\".\nBước 2: Mở giỏ hàng, kiểm tra số lượng và bấm \"Tiến hành đặt hàng\".\nBước 3: Nhập thông tin người nhận (Họ tên, Số điện thoại, Địa chỉ giao hàng và Email để nhận hóa đơn).\nBước 4: Chọn phương thức thanh toán: Tiền mặt khi nhận hàng (COD), Chuyển khoản VietQR siêu tốc hoặc Ví điện tử MoMo.\n\nĐơn hàng sẽ được nhân viên xác nhận và gửi hàng trong vòng 2 giờ tại nội thành hoặc 1-2 ngày đối với các tỉnh thành khác.",
                'status' => 'published',
            ],
        ];

        foreach ($pages as $p) {
            Page::updateOrCreate(
                ['slug' => $p['slug']],
                $p
            );
        }
    }
}
