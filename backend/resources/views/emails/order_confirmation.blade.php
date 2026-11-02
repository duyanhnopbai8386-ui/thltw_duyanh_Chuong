<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng #{{ $order->id }}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px; color: #1d1d1f; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #000000; color: #ffffff; padding: 30px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 8px 0 0; font-size: 13px; color: #86868b; }
        .content { padding: 30px 24px; }
        .greeting { font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
        .order-meta { background: #fbfbfd; border: 1px solid #e5e5ea; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px; }
        .order-meta table { width: 100%; border-collapse: collapse; }
        .order-meta td { padding: 6px 0; }
        .order-meta td:first-child { color: #86868b; width: 40%; }
        .order-meta td:last-child { font-weight: 600; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
        .items-table th { background: #f5f5f7; text-align: left; padding: 10px; font-weight: 600; border-bottom: 1px solid #e5e5ea; }
        .items-table td { padding: 12px 10px; border-bottom: 1px solid #f2f2f7; }
        .total-box { text-align: right; margin-top: 16px; padding-top: 16px; border-top: 2px solid #1d1d1f; font-size: 16px; font-weight: 700; color: #e63946; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
        .badge-cod { background: #e0f2fe; color: #0369a1; }
        .badge-bank { background: #fef3c7; color: #b45309; }
        .badge-momo { background: #fce7f3; color: #be185d; }
        .footer { background: #fbfbfd; border-top: 1px solid #e5e5ea; padding: 20px; text-align: center; font-size: 12px; color: #86868b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Cảm ơn bạn đã đặt hàng!</h1>
            <p>Mã đơn hàng: #{{ $order->id }} • {{ now()->format('d/m/Y H:i') }}</p>
        </div>

        <div class="content">
            <div class="greeting">
                Xin chào <strong>{{ $order->customer_name }}</strong>,<br>
                Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình đóng gói để chuẩn bị giao đến bạn.
            </div>

            <!-- THÔNG TIN GIAO HÀNG -->
            <div class="order-meta">
                <table>
                    <tr>
                        <td>Người nhận:</td>
                        <td>{{ $order->customer_name }}</td>
                    </tr>
                    <tr>
                        <td>Số điện thoại:</td>
                        <td>{{ $order->customer_phone }}</td>
                    </tr>
                    <tr>
                        <td>Địa chỉ nhận hàng:</td>
                        <td>{{ $order->customer_address }}</td>
                    </tr>
                    <tr>
                        <td>Phương thức thanh toán:</td>
                        <td>
                            @if($order->payment_method === 'bank_transfer')
                                <span class="badge badge-bank">Chuyển khoản Ngân hàng / QR</span>
                            @elseif($order->payment_method === 'momo')
                                <span class="badge badge-momo">Ví điện tử MoMo</span>
                            @else
                                <span class="badge badge-cod">Thanh toán khi nhận hàng (COD)</span>
                            @endif
                        </td>
                    </tr>
                    @if($order->note)
                    <tr>
                        <td>Ghi chú:</td>
                        <td>{{ $order->note }}</td>
                    </tr>
                    @endif
                </table>
            </div>

            <!-- DANH SÁCH SẢN PHẨM -->
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th style="text-align: center; width: 60px;">SL</th>
                        <th style="text-align: right; width: 100px;">Đơn giá</th>
                        <th style="text-align: right; width: 110px;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td><strong>{{ $item->product_name }}</strong></td>
                        <td style="text-align: center;">{{ $item->quantity }}</td>
                        <td style="text-align: right;">{{ number_format($item->price, 0, ',', '.') }} đ</td>
                        <td style="text-align: right; font-weight: 600;">{{ number_format($item->price * $item->quantity, 0, ',', '.') }} đ</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="total-box">
                Tổng thanh toán: {{ number_format($order->total_price, 0, ',', '.') }} VNĐ
            </div>
        </div>

        <div class="footer">
            <p>Mọi thắc mắc vui lòng liên hệ hotline: <strong>1900 8888</strong> (8:00 - 21:00 hàng ngày).</p>
            <p>© {{ date('Y') }} Cửa hàng Thiết bị Công nghệ Apple & Phụ kiện cao cấp.</p>
        </div>
    </div>
</body>
</html>
