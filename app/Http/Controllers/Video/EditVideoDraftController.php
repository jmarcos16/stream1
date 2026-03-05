<?php

declare(strict_types=1);

namespace App\Http\Controllers\Video;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

final class EditVideoDraftController extends Controller
{
    public function __invoke(Video $video): Response
    {
        $images = collect(Storage::disk('public')->files("videos/{$video->id}/images") ?: [])
            ->map(fn ($path) => [
                'id' => basename($path),
                'name' => basename($path),
                'path' => $path,
                'url' => Storage::url($path),
            ])
            ->values()
            ->all();

        return inertia('video-creator-v2-wizard', [
            'video' => $video,
            'existingImages' => $images,
        ]);
    }
}
