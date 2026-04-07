<?php

declare(strict_types=1);

namespace App\Services\Subtitle;

final class SrtParser
{
    /**
     * @return list<array{index: int, start: float, end: float, text: string}>
     */
    public function parse(string $srtContent): array
    {
        $segments = [];
        $blocks = preg_split('/\r?\n\r?\n/', trim($srtContent));

        if (! $blocks) {
            return [];
        }

        foreach ($blocks as $block) {
            $block = trim($block);

            if ($block === '') {
                continue;
            }

            $lines = preg_split('/\r?\n/', $block);

            if (! $lines || count($lines) < 3) {
                continue;
            }

            $index = (int) trim($lines[0]);
            $timecode = trim($lines[1]);
            $text = implode(' ', array_slice($lines, 2));

            if (! preg_match('/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/', $timecode, $matches)) {
                continue;
            }

            $start = (int) $matches[1] * 3600 + (int) $matches[2] * 60 + (int) $matches[3] + (int) $matches[4] / 1000;
            $end = (int) $matches[5] * 3600 + (int) $matches[6] * 60 + (int) $matches[7] + (int) $matches[8] / 1000;

            $segments[] = [
                'index' => $index,
                'start' => round($start, 3),
                'end' => round($end, 3),
                'text' => strip_tags($text),
            ];
        }

        return $segments;
    }
}
