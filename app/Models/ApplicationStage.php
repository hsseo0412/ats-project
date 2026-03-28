<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationStage extends Model
{
    use HasFactory;

    protected $fillable = [
        'applicant_id',
        'stage',
        'changed_by',
        'note',
    ];

    const STAGES = ['서류', '1차면접', '2차면접', '최종합격', '불합격'];

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(Applicant::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
