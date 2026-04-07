<?php

use App\Models\Video;
use App\VideoEncoder;

test('video encoder cpu returns correct init args', function () {
    expect(VideoEncoder::Cpu->initArgs())->toBe([]);
});

test('video encoder gpu returns vaapi device in init args', function () {
    config(['ffmpeg.vaapi_device' => '/dev/dri/renderD128']);

    $args = VideoEncoder::Gpu->initArgs();

    expect($args)->toBe(['-vaapi_device', '/dev/dri/renderD128']);
});

test('video encoder cpu returns libx264 encoder args', function () {
    $args = VideoEncoder::Cpu->encoderArgs();

    expect($args)->toBe(['-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p']);
});

test('video encoder gpu returns h264 vaapi encoder args', function () {
    config(['ffmpeg.gpu_qp' => 19]);

    $args = VideoEncoder::Gpu->encoderArgs();

    expect($args)->toBe(['-c:v', 'h264_vaapi', '-qp', '19']);
});

test('video encoder cpu does not modify filter chain', function () {
    $filter = 'scale=2160:3840,crop=2160:3840,zoompan=z=1.5';

    expect(VideoEncoder::Cpu->appendHwUpload($filter))->toBe($filter);
});

test('video encoder gpu appends hw upload to filter chain', function () {
    $filter = 'scale=2160:3840,crop=2160:3840,zoompan=z=1.5';

    $result = VideoEncoder::Gpu->appendHwUpload($filter);

    expect($result)->toBe($filter.',format=nv12,hwupload');
});

test('video encoder gpu appends hw upload to empty string', function () {
    expect(VideoEncoder::Gpu->appendHwUpload(''))->toBe(',format=nv12,hwupload');
});

test('video can be created with cpu encoder', function () {
    $video = Video::factory()->create(['encoder' => 'cpu']);

    expect($video->encoder)->toBe(VideoEncoder::Cpu);
});

test('video can be created with gpu encoder', function () {
    $video = Video::factory()->create(['encoder' => 'gpu']);

    expect($video->encoder)->toBe(VideoEncoder::Gpu);
});

test('video defaults to cpu encoder', function () {
    $video = Video::factory()->create();

    expect($video->encoder)->toBe(VideoEncoder::Cpu);
});

test('video generation request validates encoder field', function () {
    $response = $this->post(route('video.generate'), [
        'title' => 'Test Video',
        'script' => 'Test script content',
        'images' => ['test.jpg'],
        'subtitle_style' => 'bottom',
        'encoder' => 'invalid',
    ]);

    $response->assertSessionHasErrors('encoder');
});

test('video generation request accepts valid encoder values', function (string $encoder) {
    $response = $this->post(route('video.generate'), [
        'title' => 'Test Video',
        'script' => 'Test script content',
        'images' => ['test.jpg'],
        'subtitle_style' => 'bottom',
        'encoder' => $encoder,
    ]);

    $response->assertSessionHasNoErrors();
})->with(['cpu', 'gpu']);
