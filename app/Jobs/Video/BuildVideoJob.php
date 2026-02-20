<?php

namespace App\Jobs\Video;

use App\Models\Video;
use App\VideoStatus;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use FFMpeg\Format\Video\X264;
use Illuminate\Support\Facades\File;

class BuildVideoJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $timeout = 300;

    public function __construct(public Video $video) 
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->video->update(['status' => VideoStatus::PROCESSING]);

        $images = $this->getImages();
        
        if (empty($images)) {
            throw new Exception('No images found to build the video.');
        }

        $outputDir = storage_path('app/videos/' . $this->video->id);
        File::ensureDirectoryExists($outputDir);
        
        $output = $outputDir . '/raw_video.mp4';

        $this->buildVideoFromImages($images, $output);
        $this->video->update([
            'status' => VideoStatus::COMPLETED,
            'raw_video_path' => 'videos/' . $this->video->id . '/raw_video.mp4',
        ]);
    }

    private function getImages(): array
    {
        $imagesPath = storage_path('app/public/images');
        
        if (!File::isDirectory($imagesPath)) {
            return [];
        }

        $images = File::files($imagesPath);
        $extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        $imageFiles = array_filter($images, function ($file) use ($extensions) {
            return in_array(strtolower($file->getExtension()), $extensions);
        });

        usort($imageFiles, function ($a, $b) {
            return strcmp($a->getFilename(), $b->getFilename());
        });

        return array_map(fn ($file) => $file->getRealPath(), $imageFiles);
    }

    private function buildVideoFromImages(array $images, string $output): void
    {
        $duration = 5;
        $fps = 30;
        $tempDir = storage_path('app/videos/temp/' . $this->video->id);
        File::ensureDirectoryExists($tempDir);

        $videoFiles = [];
        
        foreach ($images as $index => $imagePath) {
            $tempVideoPath = $tempDir . '/image_' . str_pad($index, 3, '0', STR_PAD_LEFT) . '.mp4';
            
            FFMpeg::open($imagePath)
                ->addFilter('fps=' . $fps)
                ->addFilter('pad=1920:1080:(ow-iw)/2:(oh-ih)/2')
                ->export()
                ->asX264()
                ->withoutAudio()
                ->onProgress(function ($progress) {})
                ->toDisk('local')
                ->save('videos/temp/' . $this->video->id . '/image_' . str_pad($index, 3, '0', STR_PAD_LEFT) . '.mp4');

            $videoFiles[] = $tempVideoPath;
        }

        $this->concatenateVideos($videoFiles, $output);
        File::deleteDirectory($tempDir);
    }

    private function concatenateVideos(array $videoFiles, string $output): void
    {
        $ffmpeg = FFMpeg::open($videoFiles[0]);
        $concat = $ffmpeg->concat();

        foreach ($videoFiles as $videoPath) {
            $concat->addSource(FFMpeg::open($videoPath));
        }

        $concat
            ->onFormat(new X264())
            ->save(storage_path($output));
    }
}
