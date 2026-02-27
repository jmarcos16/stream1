<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

use function Laravel\Prompts\intro;

class TesteVideoProcessor extends Command
{
    protected $signature = 'app:teste {--merge : Merge the latest audio and video files}';

    protected $description = 'Generate short-form video (9:16) from images with Ken Burns effect and transitions';

    private const WIDTH = 1080;

    private const HEIGHT = 1920;

    private const FPS = 30;

    private const CLIP_DURATION = 5;

    private const TRANSITION_DURATION = 0.2;

    private const TRANSITIONS = [
        'fade',
        'slideup',
        'slideleft',
        'circleopen',
        'dissolve',
        'wiperight',
    ];

    public function handle(): void
    {
        intro('TesteVideoProcessor Command');

        if ($this->option('merge')) {
            $this->mergeLatestAudioVideo();

            return;
        }

        $images = $this->getImages();

        if (empty($images)) {
            $this->error('No images found in the directory.');

            return;
        }

        $this->info('Found '.count($images).' images.');

        $tempDir = storage_path('app/videos/temp');
        $outputDir = storage_path('app/videos');
        File::ensureDirectoryExists($tempDir);
        File::ensureDirectoryExists($outputDir);

        $clips = $this->buildClips($images, $tempDir);

        if (count($clips) < 2) {
            $finalClip = $clips[0] ?? null;
            if ($finalClip) {
                File::copy($finalClip, $outputDir.'/raw_video.mp4');
            }
        } else {
            $this->concatenateWithTransitions($clips, $outputDir.'/raw_video.mp4');
        }

        File::deleteDirectory($tempDir);

        $this->info('Video saved to: '.$outputDir.'/raw_video.mp4');
    }

    private function mergeLatestAudioVideo(): void
    {
        $audioDir = storage_path('app/private/audio');
        $videosDir = storage_path('app/videos');

        $audioFiles = collect(File::files($audioDir))
            ->filter(fn ($f) => $f->getExtension() === 'mp3')
            ->sortByDesc(fn ($f) => $f->getMTime());

        $videoFiles = collect(File::allFiles($videosDir))
            ->filter(fn ($f) => $f->getFilename() === 'raw_video.mp4')
            ->sortByDesc(fn ($f) => $f->getMTime());

        if ($audioFiles->isEmpty() || $videoFiles->isEmpty()) {
            $this->error('No audio or video files found.');

            return;
        }

        $audioPath = $audioFiles->first()->getRealPath();
        $videoPath = $videoFiles->first()->getRealPath();

        $this->info("Audio: {$audioPath}");
        $this->info("Video: {$videoPath}");

        $outputPath = $videosDir.'/merged_test.mp4';

        $this->runFfmpeg([
            'ffmpeg', '-y',
            '-i', $videoPath,
            '-i', $audioPath,
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-shortest',
            $outputPath,
        ]);

        $this->info("Merged video saved to: {$outputPath}");
    }

    /**
     * @param  list<string>  $images
     * @return list<string>
     */
    private function buildClips(array $images, string $tempDir): array
    {
        $clips = [];
        $effects = $this->getKenBurnsEffects();

        foreach ($images as $index => $imagePath) {
            $outputPath = $tempDir.'/clip_'.str_pad((string) $index, 3, '0', STR_PAD_LEFT).'.mp4';
            $effect = $effects[$index % count($effects)];

            $this->info("Processing image {$index}: ".basename($imagePath));

            $this->runFfmpeg([
                'ffmpeg', '-y',
                '-i', $imagePath,
                '-vf', $this->buildFilterChain($effect),
                '-c:v', 'libx264',
                '-preset', 'medium',
                '-crf', '18',
                '-pix_fmt', 'yuv420p',
                '-t', (string) self::CLIP_DURATION,
                '-an',
                $outputPath,
            ]);

            $clips[] = $outputPath;
            $this->info("Clip {$index} created.");
        }

        return $clips;
    }

    private function buildFilterChain(string $zoompanFilter): string
    {
        $w = self::WIDTH;
        $h = self::HEIGHT;
        $scaleW = $w * 2;
        $scaleH = $h * 2;

        return "scale={$scaleW}:{$scaleH}:force_original_aspect_ratio=increase,"
             ."crop={$scaleW}:{$scaleH},"
             .$zoompanFilter;
    }

    /**
     * @return list<string>
     */
    private function getKenBurnsEffects(): array
    {
        $d = self::CLIP_DURATION * self::FPS;
        $w = self::WIDTH;
        $h = self::HEIGHT;
        $fps = self::FPS;

        return [
            "zoompan=z='min(zoom+0.0015,1.5)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={$d}:s={$w}x{$h}:fps={$fps}",

            "zoompan=z='if(eq(on,1),1.5,max(zoom-0.0015,1.0))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={$d}:s={$w}x{$h}:fps={$fps}",

            "zoompan=z='1.3':x='if(eq(on,1),0,min(x+2,iw-iw/zoom))':y='ih/2-(ih/zoom/2)':d={$d}:s={$w}x{$h}:fps={$fps}",

            "zoompan=z='1.3':x='iw/2-(iw/zoom/2)':y='if(eq(on,1),0,min(y+2,ih-ih/zoom))':d={$d}:s={$w}x{$h}:fps={$fps}",

            "zoompan=z='1.3':x='if(eq(on,1),iw-iw/zoom,max(x-2,0))':y='ih/2-(ih/zoom/2)':d={$d}:s={$w}x{$h}:fps={$fps}",

            "zoompan=z='min(zoom+0.001,1.4)':x='if(eq(on,1),0,min(x+1,iw-iw/zoom))':y='ih/2-(ih/zoom/2)':d={$d}:s={$w}x{$h}:fps={$fps}",
        ];
    }

    /**
     * @param  list<string>  $clips
     */
    private function concatenateWithTransitions(array $clips, string $output): void
    {
        $this->info('Concatenating '.count($clips).' clips with transitions...');

        $inputs = [];
        foreach ($clips as $clip) {
            $inputs[] = '-i';
            $inputs[] = $clip;
        }

        $filterComplex = $this->buildXfadeFilterComplex(count($clips));

        $this->runFfmpeg(array_merge(
            ['ffmpeg', '-y'],
            $inputs,
            [
                '-filter_complex', $filterComplex,
                '-map', '[final]',
                '-c:v', 'libx264',
                '-preset', 'medium',
                '-crf', '18',
                '-pix_fmt', 'yuv420p',
                '-an',
                $output,
            ]
        ));
    }

    private function buildXfadeFilterComplex(int $clipCount): string
    {
        $td = self::TRANSITION_DURATION;
        $cd = self::CLIP_DURATION;
        $parts = [];
        $prevLabel = '[0:v]';

        for ($i = 1; $i < $clipCount; $i++) {
            $offset = $i * ($cd - $td);
            $transition = self::TRANSITIONS[($i - 1) % count(self::TRANSITIONS)];
            $outLabel = $i === $clipCount - 1 ? '[final]' : "[v{$i}]";

            $parts[] = "{$prevLabel}[{$i}:v]xfade=transition={$transition}:duration={$td}:offset={$offset}{$outLabel}";
            $prevLabel = $outLabel;
        }

        return implode(';', $parts);
    }

    /**
     * @param  list<string>  $command
     */
    private function runFfmpeg(array $command): void
    {
        $process = new Process($command);
        $process->setTimeout(300);
        $process->run();

        if (! $process->isSuccessful()) {
            $this->error('FFmpeg error: '.$process->getErrorOutput());
            throw new \RuntimeException('FFmpeg process failed: '.$process->getErrorOutput());
        }
    }

    /**
     * @return list<string>
     */
    private function getImages(): array
    {
        $imagesPath = storage_path('app/public/images');

        if (! is_dir($imagesPath)) {
            $this->error('Images directory does not exist: '.$imagesPath);

            return [];
        }

        $files = File::files($imagesPath);
        $extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        $imageFiles = array_filter($files, function ($file) use ($extensions) {
            return in_array(strtolower($file->getExtension()), $extensions);
        });

        usort($imageFiles, fn ($a, $b) => strcmp($a->getFilename(), $b->getFilename()));

        return array_map(fn ($file) => $file->getRealPath(), $imageFiles);
    }
}
