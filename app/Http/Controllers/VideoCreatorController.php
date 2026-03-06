<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Inertia\Inertia;
use Inertia\Response;

class VideoCreatorController extends Controller
{
    public function index(): Response
    {
        $videos = Video::latest()->get();

        return Inertia::render('video-creator', [
            'videos' => $videos,
        ]);
    }
}
