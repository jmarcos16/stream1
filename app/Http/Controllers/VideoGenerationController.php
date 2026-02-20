<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVideoProjectRequest;
use Illuminate\Support\Facades\Bus;

final class VideoGenerationController extends Controller
{
    public function process(StoreVideoProjectRequest $request)
    {
        $video = Video::query()->create([
            'script' => $request->input('script'),
            'status' => 'pending',
        ]);

        Bus::chain([
            new GenerateAudioJob($video),
            new GenerateTranscriptionJob($video),
            new BuildVideoJob($video),
            new MergeAudioVideoJob($video),
        ])
        ->onQueue('video-generation')
        ->catch(function (Throwable $e) use ($video) {
            $video->update(['status' => 'failed']);
            // before implementing the broadcast event with reverb
        })
        ->dispatch();

        return response()
            ->json([
                'message' => 'Video generation started',
                'video_id' => $video->id,
                'status' => $video->status,
            ], 202);
    }
}
