<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('menus')) {
            Schema::create('menus', function (Blueprint $table) {
                $table->id();
                $table->string('name', 150);
                $table->string('link', 255);
                $table->string('position', 50)->default('header'); // 'header', 'footer'
                $table->integer('sort_order')->default(0);
                $table->unsignedBigInteger('parent_id')->nullable();
                $table->boolean('status')->default(true);
                $table->softDeletes();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
