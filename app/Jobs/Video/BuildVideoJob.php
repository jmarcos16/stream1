<?php

namespace App\Jobs\Video;

use App\Models\Video;
use App\VideoStatus;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

class BuildVideoJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 300;

    private const WIDTH = 1080;

    private const HEIGHT = 1920;

    private const FPS = 30;

    private const DEFAULT_CLIP_DURATION = 5;

    private const TRANSITION_DURATION = 0.3;

    private const TRANSITIONS = [
        'fade',
        'slideup',
        'slideleft',
        'circleopen',
        'dissolve',
        'wiperight',
    ];

    private float $clipDuration = self::DEFAULT_CLIP_DURATION;

    public function __construct(
        public Video $video
    ) {}

    public function handle(): void
    {
        $this->video->update(['status' => VideoStatus::PROCESSING]);

        $this->video->refresh();

        $images = $this->getImages();

        if (empty($images)) {
            throw new Exception('No images found to build the video.');
        }

        $this->clipDuration = $this->calculateClipDuration(count($images));

        $videoDir = storage_path('app/videos/'.$this->video->id);
        File::ensureDirectoryExists($videoDir);

        $tempDir = storage_path('app/videos/temp/'.$this->video->id);
        File::ensureDirectoryExists($tempDir);

        $output = $videoDir.'/raw_video.mp4';

        try {
            $clips = $this->buildClips($images, $tempDir);

            if (count($clips) < 2) {
                $finalClip = $clips[0] ?? null;
                if ($finalClip) {
                    File::copy($finalClip, $output);
                }
            } else {
                $this->concatenateWithTransitions($clips, $output);
            }

            $this->video->update([
                'status' => VideoStatus::COMPLETED,
                'raw_video_path' => 'videos/'.$this->video->id.'/raw_video.mp4',
            ]);
        } finally {
            File::deleteDirectory($tempDir);
        }
    }

    /**
     * @return list<string>
     */
    private function getImages(): array
    {
        $imagesPath = storage_path('app/public/images');

        if (! is_dir($imagesPath)) {
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

            $this->runFfmpeg([
                'ffmpeg', '-y',
                '-i', $imagePath,
                '-vf', $this->buildFilterChain($effect),
                '-c:v', 'libx264',
                '-preset', 'medium',
                '-crf', '18',
                '-pix_fmt', 'yuv420p',
                '-t', (string) $this->clipDuration,
                '-an',
                $outputPath,
            ]);

            $clips[] = $outputPath;
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
        $d = (int) ($this->clipDuration * self::FPS);
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
        $cd = $this->clipDuration;
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

    private function calculateClipDuration(int $imageCount): float
    {
        if ($this->video->audio_duration && $imageCount > 0) {
            return $this->video->audio_duration / $imageCount;
        }

        return self::DEFAULT_CLIP_DURATION;
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
            throw new Exception('FFmpeg error: '.$process->getErrorOutput());
        }
    }
}
