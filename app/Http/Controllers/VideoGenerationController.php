<?php

namespace App\Http\Controllers;

use App\Events\VideoProcessingUpdated;
use App\Http\Requests\StoreVideoProjectRequest;
use App\Jobs\Video\AddSubtitlesJob;
use App\Jobs\Video\BuildVideoJob;
use App\Jobs\Video\GenerateAudioJob;
use App\Jobs\Video\MergeAudioVideoJob;
use App\Models\Video;
use App\VideoStatus;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;

final class VideoGenerationController extends Controller
{
    public function process(StoreVideoProjectRequest $request)
    {
        $video = Video::query()->create([
            'title' => $request->input('title'),
            'script' => $request->input('script'),
            'status' => VideoStatus::PENDING,
        ]);

        $this->moveImagesToVideoFolder($video, $request->input('images'));

        Bus::chain([
            new GenerateAudioJob($video),
            new BuildVideoJob($video),
            new MergeAudioVideoJob($video),
            // new AddSubtitlesJob($video),
            // new CleanupVideoFilesJob($video),desativar por enquanto para manter os arquivos para debug
        ])
            ->catch(function (\Throwable $e) use ($video) {
                $video->update(['status' => VideoStatus::FAILED]);
                VideoProcessingUpdated::dispatch($video->id, 'error', 'failed');
            })
            ->dispatch();

        return to_route('video-creator', ['processingVideoId' => $video->id]);
    }

    /**
     * Move uploaded images from temporary storage to the video's dedicated folder, renaming them in order.
     *
     * @param  list<string>  $imagePaths
     */
    private function moveImagesToVideoFolder(Video $video, array $imagePaths): void
    {
        $publicDisk = Storage::disk('public');

        foreach ($imagePaths as $index => $path) {
            if (! $publicDisk->exists($path)) {
                continue;
            }

            $extension = pathinfo($path, PATHINFO_EXTENSION);
            $fileNumber = $index + 1;
            $orderedName = str_pad((string) $fileNumber, 3, '0', STR_PAD_LEFT)."_foto{$fileNumber}.{$extension}";
            $destination = "videos/{$video->id}/images/{$orderedName}";

            $publicDisk->move($path, $destination);
        }
    }
}
