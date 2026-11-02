<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Mã giảm giá: VD: GIAM10, FREESHIP
            $table->string('name');
            $table->decimal('discount_amount', 12, 2)->default(0); // Số tiền giảm trực tiếp
            $table->integer('discount_percent')->default(0); // % giảm (0-100)
            $table->decimal('min_order_value', 12, 2)->default(0); // Đơn hàng tối thiểu
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('usage_limit')->default(100);
            $table->boolean('status')->default(1);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
