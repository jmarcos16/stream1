<?php

namespace App\Jobs\Video;

use App\Models\Video;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class CleanupVideoFilesJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 120;

    public function __construct(
        public Video $video
    ) {}

    public function handle(): void
    {
        $this->video->refresh();

        $publicDisk = Storage::disk('public');

        if ($this->video->audio_path) {
            $publicDisk->delete($this->video->audio_path);
        }

        if ($this->video->raw_video_path) {
            $publicDisk->delete($this->video->raw_video_path);
        }

        if ($this->video->srt_path) {
            $publicDisk->delete($this->video->srt_path);
        }

        $tempDir = $publicDisk->path('videos/'.$this->video->id.'/temp');

        if (is_dir($tempDir)) {
            File::deleteDirectory($tempDir);
        }

        $imagesDir = $publicDisk->path('videos/'.$this->video->id.'/images');

        if (is_dir($imagesDir)) {
            File::deleteDirectory($imagesDir);
        }
    }
}
