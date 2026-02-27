<?php

namespace App\Jobs\Video;

use App\Models\Video;
use App\Services\Audio\AudioGeneratorInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateAudioJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Video $video
    ) {}

    public function handle(AudioGeneratorInterface $audioGenerator): void
    {
        $this->video->update(['status' => \App\VideoStatus::PROCESSING]);

        $path = 'audio/'.$this->video->id.'_'.uniqid().'.mp3';
        $savedPath = $audioGenerator->generate($this->video->script, $path);

        $this->video->update([
            'audio_path' => $savedPath,
        ]);
    }
}
