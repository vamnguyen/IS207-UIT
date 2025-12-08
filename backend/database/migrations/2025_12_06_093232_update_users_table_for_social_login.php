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
        Schema::table('users', function (Blueprint $table) {
            // 1. Cho phép password được để trống (vì login GG/FB ko có pass)
            $table->string('password')->nullable()->change();

            // 2. Thêm các cột mới để lưu thông tin Social
            $table->string('provider', 50)->nullable()->after('email')->comment('google, facebook');
            $table->string('provider_id')->nullable()->after('provider')->comment('ID từ google/facebook');
            $table->string('avatar')->nullable()->after('address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Khi rollback (hoàn tác) thì trả lại như cũ
            $table->string('password')->nullable(false)->change();
            $table->dropColumn(['provider', 'provider_id', 'avatar']);
        });
    }
};