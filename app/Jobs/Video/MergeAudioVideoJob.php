<?php

namespace App\Jobs\Video;

use App\Models\Video;
use App\VideoStatus;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class MergeAudioVideoJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 300;

    public function __construct(
        public Video $video
    ) {}

    public function handle(): void
    {
        $this->video->refresh();
        $this->video->update(['status' => VideoStatus::PROCESSING]);

        $audioPath = Storage::disk('local')->path($this->video->audio_path);
        $videoPath = Storage::disk('local')->path($this->video->raw_video_path);

        if (! file_exists($audioPath) || ! file_exists($videoPath)) {
            throw new Exception('Audio or video file not found.');
        }

        $outputDir = storage_path('app/videos/'.$this->video->id);
        $outputPath = $outputDir.'/final_video.mp4';

        $process = new Process([
            'ffmpeg', '-y',
            '-i', $videoPath,
            '-i', $audioPath,
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-shortest',
            $outputPath,
        ]);

        $process->setTimeout(300);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new Exception('FFmpeg merge error: '.$process->getErrorOutput());
        }

        $this->video->update([
            'status' => VideoStatus::COMPLETED,
            'video_path' => 'videos/'.$this->video->id.'/final_video.mp4',
        ]);
    }
}
