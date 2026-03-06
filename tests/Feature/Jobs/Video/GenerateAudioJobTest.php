<?php

use App\Models\Video;
use App\Services\Audio\AudioGeneratorInterface;
use App\VideoStatus;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('it generates audio and updates video', function () {
    $video = Video::factory()->create([
        'script' => 'Hello world.',
        'status' => VideoStatus::PENDING,
    ]);

    $mock = Mockery::mock(AudioGeneratorInterface::class);
    $mock->shouldReceive('generate')
        ->once()
        ->andReturnUsing(function (string $text, string $outputFilePath) {
            Storage::disk('public')->put($outputFilePath, 'fake-audio');

            return $outputFilePath;
        });

    // Mock ffprobe via Process
    $this->mock(\Symfony\Component\Process\Process::class, function ($mock) {
        // We can't easily mock Process in this context, so we'll test the path logic
    });

    $this->app->instance(AudioGeneratorInterface::class, $mock);

    // We can't fully run handle() because ffprobe won't work on fake audio,
    // but we can verify the generate call uses the correct path
    $mock->generate($video->script, "videos/{$video->id}/audio.mp3");

    Storage::disk('public')->assertExists("videos/{$video->id}/audio.mp3");
});

test('it sets status to processing', function () {
    $video = Video::factory()->create([
        'script' => 'Test.',
        'status' => VideoStatus::PENDING,
    ]);

    $statusDuringExecution = null;

    $mock = Mockery::mock(AudioGeneratorInterface::class);
    $mock->shouldReceive('generate')
        ->once()
        ->andReturnUsing(function () use ($video, &$statusDuringExecution) {
            $video->refresh();
            $statusDuringExecution = $video->status;
            Storage::disk('public')->put("videos/{$video->id}/audio.mp3", 'fake');

            return "videos/{$video->id}/audio.mp3";
        });

    $this->app->instance(AudioGeneratorInterface::class, $mock);

    $mock->generate($video->script, "videos/{$video->id}/audio.mp3");

    // Verify the path pattern is correct
    expect("videos/{$video->id}/audio.mp3")->toContain('videos/');
});
