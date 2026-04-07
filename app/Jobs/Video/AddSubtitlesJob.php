<?php

namespace App\Jobs\Video;

use App\Events\VideoProcessingUpdated;
use App\Models\Video;
use App\Services\Subtitle\SrtGenerator;
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

    public function handle(SubtitleGeneratorInterface $subtitleGenerator, SrtGenerator $srtGenerator): void
    {
        $this->video->refresh();
        $this->video->update(['status' => VideoStatus::PROCESSING]);

        VideoProcessingUpdated::dispatch($this->video->id, 'subtitles', 'processing');

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

        $words = $subtitleGenerator->generate($audioFullPath, $wordsJsonPath);

        $srtRelative = 'videos/'.$this->video->id.'/subtitles.srt';
        $publicDisk->put($srtRelative, $srtGenerator->fromWords($words));

        $outputPath = dirname($videoFullPath).'/subtitled_video.mp4';

        $this->renderWithDocker($videoFullPath, $wordsJsonPath, $outputPath);

        rename($outputPath, $videoFullPath);

        $this->video->update([
            'srt_path' => $srtRelative,
            'status' => VideoStatus::COMPLETED,
        ]);

        VideoProcessingUpdated::dispatch(
            $this->video->id,
            'subtitles',
            'completed',
            Storage::disk('public')->url($this->video->video_path),
        );
    }

    private function renderWithDocker(string $videoPath, string $wordsJsonPath, string $outputPath): void
    {
        $duration = $this->video->audio_duration ?? 30;
        $videoDir = dirname($videoPath);
        $videoFile = basename($videoPath);
        $wordsFile = basename($wordsJsonPath);
        $outputFile = basename($outputPath);
        $subtitleStyle = $this->video->subtitle_style ?? 'bottom';

        $process = new Process([
            'docker', 'compose', 'exec', '-T', 'remotion',
            'npx', 'tsx', 'remotion/render-subtitles.mts',
            '--video=/data/videos/'.$this->video->id.'/'.$videoFile,
            '--words=/data/videos/'.$this->video->id.'/'.$wordsFile,
            '--output=/data/videos/'.$this->video->id.'/'.$outputFile,
            '--duration='.$duration,
            '--style='.$subtitleStyle,
            '--chrome=/usr/bin/chromium',
        ]);

        $process->setTimeout(900);
        $process->setWorkingDirectory(base_path());
        $process->run();

        if (! $process->isSuccessful()) {
            throw new Exception('Remotion Docker render failed: '.$process->getErrorOutput());
        }
    }
}
