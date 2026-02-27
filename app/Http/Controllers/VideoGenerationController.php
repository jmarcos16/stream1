<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVideoProjectRequest;
use App\Jobs\Video\BuildVideoJob;
use App\Jobs\Video\GenerateAudioJob;
use App\Jobs\Video\MergeAudioVideoJob;
use App\Models\Video;
use App\VideoStatus;
use Illuminate\Support\Facades\Bus;

final class VideoGenerationController extends Controller
{
    public function process(StoreVideoProjectRequest $request)
    {
        $video = Video::query()->create([
            'script' => $request->input('script'),
            'status' => VideoStatus::PENDING,
        ]);

        Bus::chain([
            new GenerateAudioJob($video),
            new BuildVideoJob($video),
            // new MergeAudioVideoJob($video),
        ])
            ->catch(function (\Throwable $e) use ($video) {
                $video->update(['status' => VideoStatus::FAILED]);
                // before implementing the broadcast event with reverb
            })
            ->dispatch();

        return to_route('video-creator');
    }
}
