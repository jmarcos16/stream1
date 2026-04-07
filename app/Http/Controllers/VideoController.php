<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateSubtitlesRequest;
use App\Jobs\Video\AddSubtitlesJob;
use App\Jobs\Video\MergeAudioVideoJob;
use App\Models\Video;
use App\Services\Subtitle\WordsJsonParser;
use App\VideoStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
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

    public function show(Video $video, WordsJsonParser $wordsParser): Response
    {
        abort_unless(in_array($video->status->value, ['completed', 'processing']), 404);

        $subtitles = [];

        if ($video->status->value === 'completed') {
            $wordsJsonRelative = 'videos/'.$video->id.'/words.json';

            if (Storage::disk('public')->exists($wordsJsonRelative)) {
                $subtitles = $wordsParser->parse(Storage::disk('public')->get($wordsJsonRelative));
            }
        }

        return Inertia::render('videos/show', [
            'video' => $video,
            'subtitles' => $subtitles,
        ]);
    }

    public function generateSubtitles(Video $video, GenerateSubtitlesRequest $request): \Illuminate\Http\RedirectResponse
    {
        abort_unless($video->raw_video_path && $video->audio_path, 422);
        abort_if(in_array($video->status->value, ['processing', 'pending']), 409);

        $video->update([
            'subtitle_style' => $request->validated('subtitle_style'),
            'status' => VideoStatus::PROCESSING,
        ]);

        Bus::chain([
            new MergeAudioVideoJob($video),
            new AddSubtitlesJob($video),
        ])->dispatch();

        return redirect()->route('videos.show', $video);
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
