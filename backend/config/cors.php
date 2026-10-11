<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or CORS. This determines what cross-origin operationsĐúng vậy! Thư mục `config` của bạn hiện chưa có file `cors.php`, dẫn đến việc các request từ Next.js (`localhost:3000`) bị trình duyệt chặn (lỗi Preflight/CORS) ngay cả khi server Laravel đã chạy.

### Cách khắc phục: Tạo thủ công file `cors.php`

Bạn có thể tự tạo file này một cách nhanh chóng bằng các bước sau:

1. Trong thư mục dự án Laravel (`backend/config/`), bạn tạo một file mới hoàn toàn có tên là **`cors.php`**.
2. Dán đoạn mã cấu hình chuẩn sau đây vào file `cors.php` và lưu lại:

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or CORS. This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'], // Cho phép tất cả các nguồn gọi vào (hoặc đổi thành ['http://localhost:3000'])

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];