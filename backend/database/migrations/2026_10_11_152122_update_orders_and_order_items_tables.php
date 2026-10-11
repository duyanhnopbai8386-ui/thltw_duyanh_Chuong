<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()->after('id');
            $table->string('customer_name')->after('user_id');
            $table->string('customer_email')->nullable()->after('customer_name');
            $table->string('customer_phone')->after('customer_email');
            $table->text('customer_address')->after('customer_phone');
            $table->text('note')->nullable()->after('customer_address');
            $table->decimal('total_price', 12, 2)->default(0)->after('note');
            $table->string('status')->default('pending')->after('total_price'); // pending, processing, completed, cancelled
            $table->softDeletes()->after('updated_at');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('order_id')->after('id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->after('order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name')->after('product_id');
            $table->decimal('price', 12, 2)->after('product_name');
            $table->integer('quantity')->default(1)->after('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropForeign(['product_id']);
            $table->dropColumn(['order_id', 'product_id', 'product_name', 'price', 'quantity']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id', 'customer_name', 'customer_email', 'customer_phone',
                'customer_address', 'note', 'total_price', 'status', 'deleted_at'
            ]);
        });
    }
};
