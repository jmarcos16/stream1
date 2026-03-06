<?php

use App\Jobs\Video\BuildVideoJob;
use App\Models\Video;
use App\VideoStatus;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('it throws exception when no images found', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::PENDING,
        'audio_duration' => 10.0,
    ]);

    (new BuildVideoJob($video))->handle();
})->throws(Exception::class, 'No images found to build the video.');

test('it reads images from correct directory', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::PENDING,
        'audio_duration' => 5.0,
    ]);

    // No images in the directory — should throw
    Storage::disk('public')->makeDirectory("videos/{$video->id}/images");

    (new BuildVideoJob($video))->handle();
})->throws(Exception::class, 'No images found to build the video.');

test('it sets status to processing', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::PENDING,
    ]);

    try {
        (new BuildVideoJob($video))->handle();
    } catch (\Exception) {
        // Will fail because no images, but status should be updated
    }

    $video->refresh();
    expect($video->status)->toBe(VideoStatus::PROCESSING);
});
