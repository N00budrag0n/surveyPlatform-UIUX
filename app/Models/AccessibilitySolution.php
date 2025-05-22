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

    public function getFormattedResourcesAttribute()
    {
        if (empty($this->resources)) {
            return '';
        }

        $html = '<ul>';
        foreach ($this->resources as $title => $url) {
            $html .= '<li><a href="' . $url . '" target="_blank" rel="noopener noreferrer">' . $title . '</a></li>';
        }
        $html .= '</ul>';

        return $html;
    }
}
