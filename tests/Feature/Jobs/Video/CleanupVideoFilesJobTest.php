<?php

use App\Jobs\Video\CleanupVideoFilesJob;
use App\Models\Video;
use App\VideoStatus;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('it deletes audio, raw video, and srt files', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::COMPLETED,
        'audio_path' => 'videos/1/audio.mp3',
        'raw_video_path' => 'videos/1/raw_video.mp4',
        'srt_path' => 'videos/1/words.json',
    ]);

    $publicDisk = Storage::disk('public');
    $publicDisk->put($video->audio_path, 'fake');
    $publicDisk->put($video->raw_video_path, 'fake');
    $publicDisk->put($video->srt_path, 'fake');

    (new CleanupVideoFilesJob($video))->handle();

    $publicDisk->assertMissing($video->audio_path);
    $publicDisk->assertMissing($video->raw_video_path);
    $publicDisk->assertMissing($video->srt_path);
});

test('it deletes temp and images directories', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::COMPLETED,
    ]);

    $publicDisk = Storage::disk('public');
    $publicDisk->put("videos/{$video->id}/temp/clip.mp4", 'fake');
    $publicDisk->put("videos/{$video->id}/images/001_foto1.jpg", 'fake');

    (new CleanupVideoFilesJob($video))->handle();

    $publicDisk->assertMissing("videos/{$video->id}/temp/clip.mp4");
    $publicDisk->assertMissing("videos/{$video->id}/images/001_foto1.jpg");
});

test('it handles missing files gracefully', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::COMPLETED,
        'audio_path' => null,
        'raw_video_path' => null,
        'srt_path' => null,
    ]);

    (new CleanupVideoFilesJob($video))->handle();

    expect(true)->toBeTrue();
});
