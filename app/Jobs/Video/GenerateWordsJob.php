<?php

namespace App\Jobs\Video;

use App\Models\Video;
use App\Services\Subtitle\SrtGenerator;
use App\Services\Subtitle\SubtitleGeneratorInterface;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class GenerateWordsJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 300;

    public function __construct(
        public Video $video
    ) {}

    public function handle(SubtitleGeneratorInterface $subtitleGenerator, SrtGenerator $srtGenerator): void
    {
        $this->video->refresh();

        $publicDisk = Storage::disk('public');
        $audioFullPath = $publicDisk->path($this->video->audio_path);

        if (! file_exists($audioFullPath)) {
            throw new Exception('Audio file not found for word generation.');
        }

        $wordsJsonRelative = 'videos/'.$this->video->id.'/words.json';
        $wordsJsonPath = $publicDisk->path($wordsJsonRelative);

        $words = $subtitleGenerator->generate($audioFullPath, $wordsJsonPath);

        $srtRelative = 'videos/'.$this->video->id.'/subtitles.srt';
        $publicDisk->put($srtRelative, $srtGenerator->fromWords($words));

        $this->video->update(['srt_path' => $srtRelative]);
    }
}
