<?php

namespace App\Models;

use App\VideoStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

final class Video extends Model
{
    protected $appends = ['status_label'];

    protected $fillable = [
        'title',
        'script',
        'status',
        'audio_path',
        'audio_duration',
        'video_path',
        'raw_video_path',
        'srt_path',
    ];

    /**
     * Get the user that owns the video.
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
    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status->label(),
        );
    }

    protected function casts(): array
    {
        return [
            'status' => VideoStatus::class,
        ];
    }
}
