<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WcagTestResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_id',
        'user_id',
        'url',
        'compliance_score',
        'conformance_level',
        'summary_data',
        'issues_data',
    ];

    protected $casts = [
        'summary_data' => 'array',
        'issues_data' => 'array',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
