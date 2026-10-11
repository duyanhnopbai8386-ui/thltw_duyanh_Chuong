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
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->unique()->after('name')->nullable();
            $table->string('image')->nullable()->after('slug');
            $table->integer('stock')->default(0)->after('price');
            $table->decimal('sale_price', 10, 2)->nullable()->after('price');
            $table->boolean('status')->default(true)->after('description');
        });

        Schema::table('brands', function (Blueprint $table) {
            $table->string('image')->nullable()->after('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['slug', 'image', 'stock', 'sale_price', 'status']);
        });

        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn(['image']);
        });
    }
};
