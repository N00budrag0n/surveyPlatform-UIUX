<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ArticleReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'user_id',
        'reason',
        'description',
        'status'
    ];

    public function article()
    {
        return $this->belongsTo(Articles::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => \Carbon\Carbon::parse($value)->timezone('Asia/Jakarta')->translatedFormat('H:i \W\I\B d/m/Y'),
        );
    }
}
