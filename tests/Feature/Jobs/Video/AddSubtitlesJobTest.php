<?php

use App\Jobs\Video\AddSubtitlesJob;
use App\Models\Video;
use App\Services\Subtitle\SubtitleGeneratorInterface;
use App\VideoStatus;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
});

test('it generates word timestamps from audio', function () {
    $video = Video::query()->create([
        'script' => 'Hello world, this is a test script.',
        'status' => VideoStatus::COMPLETED,
        'audio_path' => 'audio/test_audio.mp3',
        'audio_duration' => 10.0,
        'video_path' => 'videos/1/final_video.mp4',
        'raw_video_path' => 'videos/1/raw_video.mp4',
    ]);

    $localDisk = Storage::disk('local');
    $localDisk->put($video->audio_path, 'fake-audio-content');
    $localDisk->put($video->video_path, 'fake-video-content');

    $expectedWords = [
        ['word' => 'Hello', 'start' => 0.0, 'end' => 0.5],
        ['word' => 'world', 'start' => 0.5, 'end' => 1.0],
    ];

    $mock = Mockery::mock(SubtitleGeneratorInterface::class);
    $mock->shouldReceive('generate')
        ->once()
        ->andReturnUsing(function (string $audioPath, string $outputJsonPath) use ($expectedWords) {
            File::ensureDirectoryExists(dirname($outputJsonPath));
            File::put($outputJsonPath, json_encode($expectedWords));

            return $expectedWords;
        });

    $this->app->instance(SubtitleGeneratorInterface::class, $mock);

    $wordsJsonPath = $localDisk->path('videos/'.$video->id.'/words.json');

    $mock->generate($localDisk->path($video->audio_path), $wordsJsonPath);

    expect($localDisk->exists('videos/'.$video->id.'/words.json'))->toBeTrue();

    $savedWords = json_decode($localDisk->get('videos/'.$video->id.'/words.json'), true);
    expect($savedWords)->toBe($expectedWords);
});

test('it throws exception when audio file is missing', function () {
    $video = Video::query()->create([
        'script' => 'Test script.',
        'status' => VideoStatus::COMPLETED,
        'audio_path' => 'audio/missing.mp3',
        'video_path' => 'videos/1/final_video.mp4',
    ]);

    Storage::disk('local')->put($video->video_path, 'fake-video-content');

    $mock = Mockery::mock(SubtitleGeneratorInterface::class);
    $this->app->instance(SubtitleGeneratorInterface::class, $mock);

    (new AddSubtitlesJob($video))->handle($mock);
})->throws(Exception::class, 'Audio file not found for subtitle generation.');

test('it throws exception when video file is missing', function () {
    $video = Video::query()->create([
        'script' => 'Test script.',
        'status' => VideoStatus::COMPLETED,
        'audio_path' => 'audio/test.mp3',
        'video_path' => 'videos/1/final_video.mp4',
    ]);

    Storage::disk('local')->put($video->audio_path, 'fake-audio-content');

    $mock = Mockery::mock(SubtitleGeneratorInterface::class);
    $this->app->instance(SubtitleGeneratorInterface::class, $mock);

    (new AddSubtitlesJob($video))->handle($mock);
})->throws(Exception::class, 'Video file not found for subtitle burn-in.');

test('it updates video status to processing while running', function () {
    $video = Video::query()->create([
        'script' => 'Hello world.',
        'status' => VideoStatus::COMPLETED,
        'audio_path' => 'audio/test.mp3',
        'video_path' => 'videos/1/final_video.mp4',
    ]);

    $localDisk = Storage::disk('local');
    $localDisk->put($video->audio_path, 'fake-audio-content');
    $localDisk->put($video->video_path, 'fake-video-content');

    $statusDuringExecution = null;

    $mock = Mockery::mock(SubtitleGeneratorInterface::class);
    $mock->shouldReceive('generate')
        ->once()
        ->andReturnUsing(function (string $audioPath, string $outputJsonPath) use ($video, &$statusDuringExecution) {
            $video->refresh();
            $statusDuringExecution = $video->status;

            File::ensureDirectoryExists(dirname($outputJsonPath));
            File::put($outputJsonPath, json_encode([
                ['word' => 'Hello', 'start' => 0.0, 'end' => 0.5],
            ]));

            return [['word' => 'Hello', 'start' => 0.0, 'end' => 0.5]];
        });

    $this->app->instance(SubtitleGeneratorInterface::class, $mock);

    $mock->generate(
        $localDisk->path($video->audio_path),
        $localDisk->path('videos/'.$video->id.'/words.json')
    );

    expect($statusDuringExecution)->toBe(VideoStatus::PROCESSING);
});
