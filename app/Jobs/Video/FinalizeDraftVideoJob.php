<?php

namespace App\Jobs\Video;

use App\Events\VideoProcessingUpdated;
use App\Models\Video;
use App\VideoStatus;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class FinalizeDraftVideoJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Video $video
    ) {}

    public function handle(): void
    {
        $this->video->refresh();

        $videoUrl = Storage::disk('public')->url($this->video->video_path);

        $this->video->update(['status' => VideoStatus::COMPLETED]);

        VideoProcessingUpdated::dispatch($this->video->id, 'draft', 'completed', $videoUrl);
    }
}
