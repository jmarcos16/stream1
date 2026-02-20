<?php

namespace App\Console\Commands;

use FFMpeg\Format\Video\X264;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

use function Laravel\Prompts\intro;

class TesteVideoProcessor extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:teste';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test video processor command';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        intro('TesteVideoProcessor Command');
        
        $images = $this->getImages();
        if (empty($images)) {
            $this->error('No images found in the directory.');
            return;
        }

        $outputDir = storage_path('app/videos/teste');
        File::ensureDirectoryExists($outputDir);

        $output = $outputDir . '/raw_video.mp4';

        $this->buildVideoFromImages($images, $output);
        $this->info('Video processing completed successfully.');
    }

    private function buildVideoFromImages(array $images, string $output): void
    {
        $durantion = 5;
        $fps = 30;
        $tempDir = storage_path('app/videos/teste/temp');
        File::ensureDirectoryExists($tempDir);

        $videosFiles = [];
        foreach ($images as $index => $image) {
            $inputPath = storage_path('app/public/images/' . $image);
            $tempVideoPath = $tempDir . '/video_' . $index . '.mp4';

            dd($inputPath, $tempVideoPath);
            
            FFMpeg::open($inputPath)
                ->export()
                ->toDisk('local')
                ->inFormat(new X264('libx264', 'libx264'))
                ->save($tempVideoPath);

            $videosFiles[] = $tempVideoPath;
        }

        FFMpeg::open($videosFiles)
            ->export()
            ->toDisk('local')
            ->inFormat(new X264('libx264', 'libx264'))
            ->save($output);

        File::deleteDirectory($tempDir);
    }

    private function getImages(): array
    {
        $imagesPath = storage_path('app/public/images');
        
        if (!is_dir($imagesPath)) {
            $this->error('Images directory does not exist.');
            return [];
        }

        $files = scandir($imagesPath);
        $images = array_filter($files, function ($file) use ($imagesPath) {
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            return in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif', 'webp']);
        });

        return array_values($images);
    }
}
