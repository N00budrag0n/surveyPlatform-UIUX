<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyAiRecommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_id',
        'method_type',
        'resume_description',
        'ai_recommendation',
        'generated_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
}
