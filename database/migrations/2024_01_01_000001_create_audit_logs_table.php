<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * 감사 로그 테이블
 *
 * ERP / 사내 시스템처럼 변경 이력이 중요한 프로젝트에서 활성화하세요.
 * 사용 방법: app/Traits/Auditable.php 트레이트를 모델에 추가
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event');               // created, updated, deleted
            $table->string('auditable_type');      // 모델 클래스명
            $table->unsignedBigInteger('auditable_id'); // 모델 ID
            $table->json('old_values')->nullable(); // 변경 전 값
            $table->json('new_values')->nullable(); // 변경 후 값
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['auditable_type', 'auditable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
