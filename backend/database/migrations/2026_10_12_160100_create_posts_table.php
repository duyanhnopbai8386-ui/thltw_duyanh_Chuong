<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('posts')) {
            Schema::create('posts', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->string('thumbnail')->nullable();
                $table->text('summary')->nullable();
                $table->longText('content')->nullable();
                $table->boolean('status')->default(true); // 1: Xuất bản, 0: Bản nháp
                $table->unsignedBigInteger('views')->default(0);
                $table->softDeletes();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
