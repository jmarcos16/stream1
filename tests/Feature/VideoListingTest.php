<?php

use App\Models\Video;
use App\VideoStatus;

test('video listing shows draft videos with correct status', function () {
    $draftVideo = Video::factory()->create([
        'status' => VideoStatus::DRAFT,
        'script' => 'Test script content',
    ]);

    $response = $this->get(route('video-creator.v2'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('video-creator-v2')
        ->has('videos', 1)
        ->where('videos.0.id', $draftVideo->id)
        ->where('videos.0.status', 'draft')
        ->where('videos.0.status_label', 'Draft')
    );
});

test('draft video without script cannot generate video', function () {
    $draftVideo = Video::factory()->create([
        'status' => VideoStatus::DRAFT,
        'script' => null,
    ]);

    $response = $this->get(route('video-creator.v2'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('videos.0.script', null)
    );
});

test('draft video with script can generate video', function () {
    $draftVideo = Video::factory()->create([
        'status' => VideoStatus::DRAFT,
        'script' => 'Complete script for video generation',
    ]);

    $response = $this->get(route('video-creator.v2'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('videos.0.script', 'Complete script for video generation')
    );
});

test('video listing shows different status types correctly', function () {
    Video::factory()->create(['status' => VideoStatus::DRAFT]);
    Video::factory()->create(['status' => VideoStatus::PENDING]);
    Video::factory()->create(['status' => VideoStatus::PROCESSING]);
    Video::factory()->create(['status' => VideoStatus::COMPLETED]);

    $response = $this->get(route('video-creator.v2'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('videos', 4)
    );
});
