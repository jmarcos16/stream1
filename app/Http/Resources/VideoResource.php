<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class VideoResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'script' => $this->script,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'audio_path' => $this->audio_path,
            'audio_duration' => $this->audio_duration,
            'video_path' => $this->video_path,
            'video_url' => $this->video_path ? Storage::url($this->video_path) : null,
            'raw_video_path' => $this->raw_video_path,
            'raw_video_url' => $this->raw_video_path ? Storage::url($this->raw_video_path) : null,
            'srt_path' => $this->srt_path,
            'subtitle_style' => $this->subtitle_style,
            'encoder' => $this->encoder?->value,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
