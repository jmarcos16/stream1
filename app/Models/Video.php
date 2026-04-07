<?php

namespace App\Models;

use App\VideoEncoder;
use App\VideoStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class Video extends Model
{
    use HasFactory;

    protected $appends = ['status_label', 'status_color'];

    protected $fillable = [
        'title',
        'script',
        'status',
        'audio_path',
        'audio_duration',
        'video_path',
        'raw_video_path',
        'srt_path',
        'subtitle_style',
        'encoder',
    ];

    /**
     * Get the user that owns the video.
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter videos by status type.
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return match ($status) {
            'processing' => $query->whereIn('status', ['processing', 'pending']),
            'completed' => $query->where('status', 'completed'),
            'failed' => $query->where('status', 'failed'),
            'drafts' => $query->where('status', 'draft'),
            'pending' => $query->where('status', 'pending'),
            default => $query,
        };
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

    protected function statusColor(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status->color(),
        );
    }

    protected function casts(): array
    {
        return [
            'status' => VideoStatus::class,
            'encoder' => VideoEncoder::class,
        ];
    }
}
