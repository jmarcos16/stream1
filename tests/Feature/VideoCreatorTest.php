<?php

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
