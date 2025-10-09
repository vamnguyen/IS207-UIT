<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // ⚠️ Cập nhật danh sách ENUM mới
            $table->enum('status', [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled'
            ])->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // 🔁 Trả lại ENUM cũ (nếu rollback)
            $table->enum('status', [
                'pending',
                'confirmed',
                'active',
                'returned',
                'cancelled'
            ])->default('pending')->change();
        });
    }
};
