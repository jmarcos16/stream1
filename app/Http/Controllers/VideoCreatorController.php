<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Inertia\Inertia;
use Inertia\Response;

class VideoCreatorController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index(): Response
    {
        $videos = Video::latest()->get();

        return Inertia::render('video-creator', [
            'videos' => $videos,
        ]);
    }

    /**
     * Handle the V2 incoming request.
     */
    public function v2(): Response
    {
        $videos = Video::query()
            ->latest()
            ->get();

        return Inertia::render('video-creator-v2', [
            'videos' => $videos,
        ]);
    }
}
