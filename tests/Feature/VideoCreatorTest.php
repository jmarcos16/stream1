<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('video creator page loads successfully', function () {
    $response = $this->get(route('video-creator'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('video-creator')
        ->has('videos')
    );
});

test('home redirects to video creator', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('video-creator'));
});

test('temp media can be uploaded', function () {
    Storage::fake('public');

    $response = $this->postJson(route('temp-media.store'), [
        'file' => UploadedFile::fake()->image('photo.jpg'),
    ]);

    $response->assertOk()
        ->assertJsonStructure(['path', 'url', 'name']);

    Storage::disk('public')->assertExists($response->json('path'));
});

test('temp media can be deleted', function () {
    Storage::fake('public');

    $upload = $this->postJson(route('temp-media.store'), [
        'file' => UploadedFile::fake()->image('photo.jpg'),
    ]);

    $filename = basename($upload->json('path'));

    $this->deleteJson(route('temp-media.destroy', $filename))
        ->assertOk();

    Storage::disk('public')->assertMissing($upload->json('path'));
});

test('temp media upload validates image', function () {
    Storage::fake('public');

    $this->postJson(route('temp-media.store'), [
        'file' => UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf'),
    ])->assertUnprocessable();
});
