<?php

use App\Jobs\Video\MergeAudioVideoJob;
use App\Models\Video;
use App\VideoStatus;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('it throws exception when audio file is missing', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::COMPLETED,
        'audio_path' => 'videos/1/audio.mp3',
        'raw_video_path' => 'videos/1/raw_video.mp4',
    ]);

    Storage::disk('public')->put($video->raw_video_path, 'fake-video');

    (new MergeAudioVideoJob($video))->handle();
})->throws(Exception::class, 'Audio or video file not found.');

test('it throws exception when video file is missing', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::COMPLETED,
        'audio_path' => 'videos/1/audio.mp3',
        'raw_video_path' => 'videos/1/raw_video.mp4',
    ]);

    Storage::disk('public')->put($video->audio_path, 'fake-audio');

    (new MergeAudioVideoJob($video))->handle();
})->throws(Exception::class, 'Audio or video file not found.');

test('it sets status to processing', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::PENDING,
        'audio_path' => 'videos/1/audio.mp3',
        'raw_video_path' => 'videos/1/raw_video.mp4',
    ]);

    Storage::disk('public')->put($video->audio_path, 'fake-audio');
    Storage::disk('public')->put($video->raw_video_path, 'fake-video');

    try {
        (new MergeAudioVideoJob($video))->handle();
    } catch (\Exception) {
        // ffmpeg will fail, but status should be updated
    }

    $video->refresh();
    expect($video->status)->toBe(VideoStatus::PROCESSING);
});
