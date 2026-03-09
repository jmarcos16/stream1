<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AddSubtitleCommand extends Command
{
    protected $signature = 'add:subtitle {videoId}';


    protected $description = 'Add subtitles to a video';

    public function handle()
    {
        $videoId = $this->argument('videoId');
        $video = \App\Models\Video::find($videoId);

        \App\Jobs\Video\AddSubtitlesJob::dispatch($video);

        $this->info("Subtitle addition job dispatched for video ID: {$videoId}");
    }
}
