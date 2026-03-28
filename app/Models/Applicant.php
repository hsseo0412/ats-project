<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Applicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_posting_id',
        'name',
        'email',
        'phone',
        'resume_path',
        'resume_text',
        'ai_summary',
        'ai_score',
        'ai_analyzed_at',
    ];

    protected $casts = [
        'ai_score'       => 'integer',
        'ai_analyzed_at' => 'datetime',
    ];

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function stages(): HasMany
    {
        return $this->hasMany(ApplicationStage::class);
    }

    public function latestStage(): HasOne
    {
        return $this->hasOne(ApplicationStage::class)->latestOfMany();
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }

    public function isAiAnalyzed(): bool
    {
        return $this->ai_analyzed_at !== null;
    }
}
