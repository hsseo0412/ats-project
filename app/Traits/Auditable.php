<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

/**
 * 모델 변경 이력을 자동으로 기록하는 트레이트
 *
 * 사용법: 모델에 use Auditable; 추가
 *
 * class Post extends Model
 * {
 *     use Auditable;
 *
 *     // 로그에서 제외할 필드 (기본값: password, remember_token)
 *     protected array $auditExclude = ['secret_field'];
 * }
 */
trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(fn (Model $model) => $model->recordAudit('created', [], $model->getAttributes()));
        static::updated(fn (Model $model) => $model->recordAudit('updated', $model->getOriginal(), $model->getChanges()));
        static::deleted(fn (Model $model) => $model->recordAudit('deleted', $model->getAttributes(), []));
    }

    private function recordAudit(string $event, array $oldValues, array $newValues): void
    {
        $exclude = array_merge(
            $this->auditExclude ?? [],
            ['password', 'remember_token', 'updated_at']
        );

        AuditLog::create([
            'user_id'        => auth()->id(),
            'event'          => $event,
            'auditable_type' => static::class,
            'auditable_id'   => $this->getKey(),
            'old_values'     => $this->filterAuditFields($oldValues, $exclude),
            'new_values'     => $this->filterAuditFields($newValues, $exclude),
            'ip_address'     => request()->ip(),
            'user_agent'     => request()->userAgent(),
        ]);
    }

    private function filterAuditFields(array $values, array $exclude): array
    {
        return array_diff_key($values, array_flip($exclude));
    }
}
