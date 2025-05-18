<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessibilitySolution extends Model
{
    use HasFactory;

    protected $fillable = [
        'issue_id',
        'title',
        'description',
        'example',
        'resources',
    ];

    protected $casts = [
        'resources' => 'array',
    ];
}
