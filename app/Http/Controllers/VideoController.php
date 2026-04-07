<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
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
