<?php

use App\Models\Video;
use App\VideoStatus;

test('video can be created with bottom subtitle style', function () {
    $video = Video::factory()->create([
        'subtitle_style' => 'bottom',
    ]);

    expect($video->subtitle_style)->toBe('bottom');
});

test('video can be created with center subtitle style', function () {
    $video = Video::factory()->create([
        'subtitle_style' => 'center',
    ]);

    expect($video->subtitle_style)->toBe('center');
});

test('video defaults to bottom subtitle style', function () {
    $video = Video::factory()->create();

    expect($video->subtitle_style)->toBe('bottom');
});

test('video generation request validates subtitle style', function () {
    $response = $this->post(route('video.generate'), [
        'title' => 'Test Video',
        'script' => 'Test script content',
        'images' => ['test.jpg'],
        'subtitle_style' => 'invalid',
    ]);

    $response->assertSessionHasErrors('subtitle_style');
});

test('video generation request accepts valid subtitle styles', function (string $style) {
    $response = $this->post(route('video.generate'), [
        'title' => 'Test Video',
        'script' => 'Test script content',
        'images' => ['test.jpg'],
        'subtitle_style' => $style,
    ]);

    $response->assertSessionHasNoErrors();
})->with(['bottom', 'center']);
