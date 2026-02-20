<?php

namespace App\Console\Commands;

use FFMpeg\Filters\Video\VideoFilters;
use FFMpeg\Format\Video\X264;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

use function Laravel\Prompts\intro;

class TesteVideoProcessor extends Command
{
    protected $signature = 'app:teste';
    protected $description = 'Test video processor command';

    public function handle()
    {
        intro('TesteVideoProcessor Command');

        $images = $this->getImages();
        if (empty($images)) {
            $this->error('No images found in the directory.');
            return;
        }

        $output = 'videos/raw_video.mp4';

        $videoFiles = $this->buildVideoFromImages($images);
        $this->concatenateVideos($videoFiles, $output);
        $this->info('Video processing completed successfully.');
    }

    private function buildVideoFromImages(array $images): array
    {
        $duration = 5;
        $tempDir  = 'videos/temp';

        File::ensureDirectoryExists(storage_path('app/' . $tempDir));

        $videoFiles = [];

        foreach ($images as $index => $image) {
            $inputPath     = 'images/' . $image;
            $tempVideoPath = $tempDir . '/clip_' . $index . '.mp4';

            FFMpeg::fromDisk('public')
                ->open($inputPath)
                ->export()
                ->toDisk('local')
                ->asTimelapseWithFramerate(1 / $duration)
                ->inFormat((new X264)->setKiloBitrate(1000))
                ->save($tempVideoPath);

            $videoFiles[] = $tempVideoPath;

            $this->info("Clip {$index} criado: {$tempVideoPath}");
        }
        
        return $videoFiles;
    }

    private function concatenateVideos(array $videoFiles, string $output): void
    {
        FFMpeg::fromDisk('local')
            ->open($videoFiles)
            ->export()
            ->toDisk('local')
            ->inFormat((new X264)->setKiloBitrate(1000))
            ->concatWithTranscoding(hasVideo: true, hasAudio: false)
            ->save($output);

        $this->info("Vídeo final salvo em: {$output}");
    }

    private function getImages(): array
    {
        $imagesPath = storage_path('app/public/images');

        if (!is_dir($imagesPath)) {
            $this->error('Images directory does not exist: ' . $imagesPath);
            return [];
        }

        $files  = scandir($imagesPath);
        $images = array_filter($files, function ($file) {
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            return in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif', 'webp']);
        });

        return array_values($images);
    }
}
