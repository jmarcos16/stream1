<?php

namespace App\Jobs\Video;

use App\Models\Video;
use App\Services\Subtitle\SubtitleGeneratorInterface;
use App\VideoStatus;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class AddSubtitlesJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 900;

    public function __construct(
        public Video $video
    ) {}

    public function handle(SubtitleGeneratorInterface $subtitleGenerator): void
    {
        $this->video->refresh();
        $this->video->update(['status' => VideoStatus::PROCESSING]);

        $publicDisk = Storage::disk('public');
        $audioFullPath = $publicDisk->path($this->video->audio_path);
        $videoFullPath = $publicDisk->path($this->video->video_path);

        if (! file_exists($audioFullPath)) {
            throw new Exception('Audio file not found for subtitle generation.');
        }

        if (! file_exists($videoFullPath)) {
            throw new Exception('Video file not found for subtitle burn-in.');
        }

        $wordsJsonRelative = 'videos/'.$this->video->id.'/words.json';
        $wordsJsonPath = $publicDisk->path($wordsJsonRelative);

        $subtitleGenerator->generate($audioFullPath, $wordsJsonPath);

        $outputPath = dirname($videoFullPath).'/subtitled_video.mp4';

        $this->renderWithRemotion($videoFullPath, $wordsJsonPath, $outputPath);

        rename($outputPath, $videoFullPath);

        $this->video->update([
            'srt_path' => $wordsJsonRelative,
            'status' => VideoStatus::COMPLETED,
        ]);
    }

    private function renderWithRemotion(string $videoPath, string $wordsJsonPath, string $outputPath): void
    {
        $renderScript = base_path('remotion/render-subtitles.mts');
        $duration = $this->video->audio_duration ?? 30;

        $process = new Process([
            'npx', 'tsx', $renderScript,
            '--video='.$videoPath,
            '--words='.$wordsJsonPath,
            '--output='.$outputPath,
            '--duration='.$duration,
        ]);

        $process->setTimeout(900);
        $process->setWorkingDirectory(base_path());
        $process->run();

        if (! $process->isSuccessful()) {
            throw new Exception('Remotion render failed: '.$process->getErrorOutput());
        }
    }
}
