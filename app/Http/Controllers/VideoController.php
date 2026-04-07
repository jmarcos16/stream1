<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Services\Subtitle\SrtParser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class VideoController extends Controller
{
    public function index(Request $request): Response
    {
        $videos = Video::query()
            ->when($request->query('status'), fn ($query, $status) => $query->byStatus($status))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('videos/index', [
            'videos' => $videos,
            'filters' => [
                'status' => $request->query('status', ''),
            ],
        ]);
    }

    public function show(Video $video, SrtParser $srtParser): Response
    {
        abort_unless($video->status->value === 'completed', 404);

        $subtitles = [];

        if ($video->srt_path && Storage::exists($video->srt_path)) {
            $subtitles = $srtParser->parse(Storage::get($video->srt_path));
        }

        return Inertia::render('videos/show', [
            'video' => $video,
            'subtitles' => $subtitles,
        ]);
    }

    public function destroy(Video $video): \Illuminate\Http\RedirectResponse
    {
        $video->delete();

        return back()->with('success', 'Video deleted successfully.');
    }

    public function download(Video $video): BinaryFileResponse
    {
        abort_unless($video->video_path && $video->status->value === 'completed', 404);

        return response()->download(storage_path("app/{$video->video_path}"));
    }

    public function downloadSubtitle(Video $video): BinaryFileResponse
    {
        abort_unless($video->srt_path, 404);

        return response()->download(storage_path("app/{$video->srt_path}"));
    }
}
