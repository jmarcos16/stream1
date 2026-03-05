<?php

declare(strict_types=1);

namespace App\Http\Controllers\Video;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Inertia\Response;

final class EditVideoDraftController extends Controller
{
    public function __invoke(Video $video): Response
    {
        return inertia('video-creator-v2-wizard', [
            'video' => $video,
        ]);
    }
}
