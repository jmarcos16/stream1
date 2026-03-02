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

        $localDisk = Storage::disk('local');

        if ($this->video->audio_path) {
            $localDisk->delete($this->video->audio_path);
        }

        if ($this->video->raw_video_path) {
            $localDisk->delete($this->video->raw_video_path);
        }

        if ($this->video->srt_path) {
            $localDisk->delete($this->video->srt_path);
        }

        $tempDir = $localDisk->path('videos/temp/'.$this->video->id);

        if (is_dir($tempDir)) {
            File::deleteDirectory($tempDir);
        }

        $imagesDir = storage_path('app/public/images/'.$this->video->id);

        if (is_dir($imagesDir)) {
            File::deleteDirectory($imagesDir);
        }
    }
}
