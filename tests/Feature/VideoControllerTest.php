<?php

use App\Models\Video;
use App\VideoStatus;

test('videos index page loads successfully', function () {
    Video::factory()->count(3)->create();

    $response = $this->get(route('videos.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('videos/index')
        ->has('videos.data', 3)
        ->has('filters')
        ->where('filters.status', '')
    );
});

test('videos index paginates results', function () {
    Video::factory()->count(15)->create();

    $response = $this->get(route('videos.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('videos/index')
        ->has('videos.data', 12)
        ->where('videos.current_page', 1)
        ->where('videos.last_page', 2)
        ->where('videos.total', 15)
    );
});

test('videos index filters by completed status', function () {
    Video::factory()->create(['status' => VideoStatus::COMPLETED]);
    Video::factory()->create(['status' => VideoStatus::PENDING]);
    Video::factory()->create(['status' => VideoStatus::DRAFT]);

    $response = $this->get(route('videos.index', ['status' => 'completed']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('videos.data', 1)
        ->where('videos.data.0.status', 'completed')
        ->where('filters.status', 'completed')
    );
});

test('videos index filters by processing status includes pending', function () {
    Video::factory()->create(['status' => VideoStatus::PROCESSING]);
    Video::factory()->create(['status' => VideoStatus::PENDING]);
    Video::factory()->create(['status' => VideoStatus::COMPLETED]);

    $response = $this->get(route('videos.index', ['status' => 'processing']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('videos.data', 2)
    );
});

test('videos index filters by failed status', function () {
    Video::factory()->create(['status' => VideoStatus::FAILED]);
    Video::factory()->create(['status' => VideoStatus::COMPLETED]);

    $response = $this->get(route('videos.index', ['status' => 'failed']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('videos.data', 1)
        ->where('videos.data.0.status', 'failed')
    );
});

test('videos index returns video resource with status_color', function () {
    Video::factory()->create(['status' => VideoStatus::COMPLETED]);

    $response = $this->get(route('videos.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('videos.data.0.status_color', 'green')
        ->where('videos.data.0.status_label', 'Completed')
    );
});

test('video can be deleted', function () {
    $video = Video::factory()->create();

    $response = $this->delete(route('videos.destroy', $video));

    $response->assertRedirect();
    $this->assertDatabaseMissing('videos', ['id' => $video->id]);
});

test('video download returns file when completed', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::COMPLETED,
        'video_path' => 'videos/test-video.mp4',
    ]);

    $storagePath = storage_path('app/videos');
    if (! is_dir($storagePath)) {
        mkdir($storagePath, 0755, true);
    }
    file_put_contents(storage_path('app/videos/test-video.mp4'), 'fake-video-content');

    $response = $this->get(route('videos.download', $video));

    $response->assertSuccessful();

    @unlink(storage_path('app/videos/test-video.mp4'));
});

test('video download returns 404 when not completed', function () {
    $video = Video::factory()->create([
        'status' => VideoStatus::PENDING,
        'video_path' => null,
    ]);

    $response = $this->get(route('videos.download', $video));

    $response->assertNotFound();
});

test('subtitle download returns file when srt exists', function () {
    $video = Video::factory()->create([
        'srt_path' => 'subtitles/test.srt',
    ]);

    $storagePath = storage_path('app/subtitles');
    if (! is_dir($storagePath)) {
        mkdir($storagePath, 0755, true);
    }
    file_put_contents(storage_path('app/subtitles/test.srt'), 'fake-srt-content');

    $response = $this->get(route('videos.download-subtitle', $video));

    $response->assertSuccessful();

    @unlink(storage_path('app/subtitles/test.srt'));
});

test('subtitle download returns 404 when no srt', function () {
    $video = Video::factory()->create([
        'srt_path' => null,
    ]);

    $response = $this->get(route('videos.download-subtitle', $video));

    $response->assertNotFound();
});

test('home redirects to videos index', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('videos.index'));
});
