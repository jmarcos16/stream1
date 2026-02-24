<?php

namespace App\Jobs\Video;

use App\Models\Video;
use App\Services\Audio\AudioGeneratorInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateAudioJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Video $video
    ) {}

    /**
     *  The audio is generated using the Google Text-to-Speech API.
     *
     * @param AudioGeneratorInterface $audioGenerator
     */
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
