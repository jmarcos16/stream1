<?php

namespace App;

enum VideoEncoder: string
{
    case Cpu = 'cpu';
    case Gpu = 'gpu';

    /**
     * @return list<string>
     */
    public function initArgs(): array
    {
        return match ($this) {
            self::Cpu => [],
            self::Gpu => ['-vaapi_device', config('ffmpeg.vaapi_device')],
        };
    }

    /**
     * @return list<string>
     */
    public function encoderArgs(): array
    {
        return match ($this) {
            self::Cpu => ['-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p'],
            self::Gpu => ['-c:v', 'h264_vaapi', '-qp', (string) config('ffmpeg.gpu_qp')],
        };
    }

    public function appendHwUpload(string $filterChain): string
    {
        return match ($this) {
            self::Cpu => $filterChain,
            self::Gpu => $filterChain.',format=nv12,hwupload',
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Cpu => 'CPU (libx264)',
            self::Gpu => 'GPU (AMD VAAPI)',
        };
    }
}
