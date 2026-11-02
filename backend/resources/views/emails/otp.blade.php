<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã xác nhận đặt lại mật khẩu</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f5f5f7;
            color: #1d1d1f;
        }
        .container {
            max-width: 560px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
            border: 1px solid #e5e5ea;
        }
        .header {
            background: linear-gradient(135deg, #0071e3 0%, #0051ba 100%);
            padding: 36px 30px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 8px 0 0;
            font-size: 13px;
            opacity: 0.9;
        }
        .body {
            padding: 36px 30px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .message {
            font-size: 14px;
            line-height: 1.6;
            color: #515154;
            margin-bottom: 28px;
        }
        .otp-box {
            background-color: #f5f5f7;
            border: 2px dashed #0071e3;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin: 24px 0;
        }
        .otp-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #86868b;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 10px;
            color: #0071e3;
            font-family: 'Courier New', Courier, monospace;
        }
        .warning-box {
            background-color: #fff8e6;
            border-left: 4px solid #f5a623;
            padding: 14px 18px;
            border-radius: 8px;
            font-size: 12px;
            color: #8a6300;
            line-height: 1.5;
            margin-top: 24px;
        }
        .footer {
            background-color: #fafafc;
            padding: 24px 30px;
            text-align: center;
            font-size: 11px;
            color: #86868b;
            border-top: 1px solid #e5e5ea;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Apple Store THLTW</h1>
            <p>Xác thực đặt lại mật khẩu tài khoản</p>
        </div>

        <div class="body">
            <div class="greeting">Xin chào {{ $userName }},</div>
            <div class="message">
                Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác thực (OTP) bên dưới để tiến hành thiết lập mật khẩu mới:
            </div>

            <div class="otp-box">
                <div class="otp-label">Mã xác thực OTP của bạn</div>
                <div class="otp-code">{{ $otp }}</div>
            </div>

            <div class="warning-box">
                ⚠️ <strong>Lưu ý bảo mật:</strong> Mã xác nhận này có hiệu lực trong vòng <strong>15 phút</strong>. Tuyệt đối không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên hỗ trợ.
            </div>

            <p style="font-size: 13px; color: #86868b; margin-top: 24px;">
                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc đổi mật khẩu để bảo vệ an toàn cho tài khoản.
            </p>
        </div>

        <div class="footer">
            <p style="margin: 0 0 6px 0;">© {{ date('Y') }} Apple Store THLTW. Môn Thực hành Lập trình Web.</p>
            <p style="margin: 0;">Email này được gửi tự động, vui lòng không phản hồi trực tiếp.</p>
        </div>
    </div>
</body>
</html>
