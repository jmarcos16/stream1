<?php

namespace App\Jobs\Video;

use App\Events\VideoProcessingUpdated;
use App\Models\Video;
use App\Services\Audio\AudioGeneratorInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class GenerateAudioJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Video $video
    ) {}

    public function handle(AudioGeneratorInterface $audioGenerator): void
    {
        $this->video->refresh();
        $this->video->update(['status' => \App\VideoStatus::PROCESSING]);

        VideoProcessingUpdated::dispatch($this->video->id, 'audio', 'processing');

        $path = "videos/{$this->video->id}/audio.mp3";
        $savedPath = $audioGenerator->generate($this->video->script, $path);

        $duration = $this->getAudioDuration($savedPath);

        $this->video->update([
            'audio_path' => $savedPath,
            'audio_duration' => $duration,
        ]);

        VideoProcessingUpdated::dispatch($this->video->id, 'audio', 'completed');
    }

    private function getAudioDuration(string $path): float
    {
        $fullPath = Storage::disk('public')->path($path);

        $process = new \Symfony\Component\Process\Process([
            'ffprobe', '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            $fullPath,
        ]);

        $process->run();

        if (! $process->isSuccessful()) {
            throw new \RuntimeException('Failed to get audio duration: '.$process->getErrorOutput());
        }

        return (float) trim($process->getOutput());
    }
}
