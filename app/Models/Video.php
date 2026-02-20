<?php

namespace App\Models;

use App\VideoStatus;
use Illuminate\Database\Eloquent\Model;

final class Video extends Model
{
    protected $fillable = [
        'script',
        'status',
        'audio_path',
        'video_path',
        'raw_video_path',
        'srt_path'
    ];

    /**
     * Get the user that owns the video.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => VideoStatus::class,
        ];
    }
}
