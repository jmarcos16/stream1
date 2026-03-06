<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class PreviewSubtitleStyle extends Command
{
    protected $signature = 'subtitle:preview {video_id} {style=center}';

    protected $description = 'Preview subtitle style for a video';

    public function handle(): int
    {
        $videoId = $this->argument('video_id');
        $style = $this->argument('style');

        $publicDisk = Storage::disk('public');
        $videoPath = "videos/{$videoId}/raw_video.mp4";
        $wordsPath = "videos/{$videoId}/words.json";

        if (! $publicDisk->exists($videoPath)) {
            $this->error("Video not found: {$videoPath}");

            return 1;
        }

        if (! $publicDisk->exists($wordsPath)) {
            $this->error("Words file not found: {$wordsPath}");

            return 1;
        }

        $videoFullPath = $publicDisk->path($videoPath);
        $wordsFullPath = $publicDisk->path($wordsPath);
        $outputPath = $publicDisk->path("videos/{$videoId}/preview_{$style}.mp4");

        $words = json_decode(file_get_contents($wordsFullPath), true);
        $duration = end($words)['end'] ?? 10;

        $this->info("Rendering preview with style: {$style}");
        $this->info("Duration: {$duration}s");

        $process = new Process([
            'docker', 'compose', 'exec', '-T', 'remotion',
            'npx', 'tsx', 'remotion/render-subtitles.mts',
            "--video=/data/videos/{$videoId}/".basename($videoFullPath),
            "--words=/data/videos/{$videoId}/words.json",
            "--output=/data/videos/{$videoId}/preview_{$style}.mp4",
            "--duration={$duration}",
            "--style={$style}",
            '--chrome=/usr/bin/chromium',
        ]);

        $process->setTimeout(900);
        $process->setWorkingDirectory(base_path());

        $this->info('Running render...');
        $process->run(function ($type, $buffer) {
            $this->line($buffer);
        });

        if (! $process->isSuccessful()) {
            $this->error('Render failed: '.$process->getErrorOutput());

            return 1;
        }

        $this->info("Preview saved to: {$outputPath}");
        $this->info('URL: '.Storage::disk('public')->url("videos/{$videoId}/preview_{$style}.mp4"));

        return 0;
    }
}
