<?php

declare(strict_types=1);

namespace App\Services\Subtitle;

final class SrtGenerator
{
    private const SWITCH_CAPTIONS_EVERY_MS = 1200;

    /**
     * Convert a words.json array (from OpenAI Whisper) into SRT format string.
     *
     * @param  list<array{word: string, start: float, end: float}>  $words
     */
    public function fromWords(array $words): string
    {
        if (empty($words)) {
            return '';
        }

        $segments = [];
        $currentWords = [];
        $pageStartMs = null;

        foreach ($words as $word) {
            $startMs = (int) round($word['start'] * 1000);

            if ($pageStartMs === null) {
                $pageStartMs = $startMs;
            }

            if (($startMs - $pageStartMs) >= self::SWITCH_CAPTIONS_EVERY_MS && ! empty($currentWords)) {
                $segments[] = $currentWords;
                $currentWords = [];
                $pageStartMs = $startMs;
            }

            $currentWords[] = $word;
        }

        if (! empty($currentWords)) {
            $segments[] = $currentWords;
        }

        $lines = [];

        foreach ($segments as $index => $segWords) {
            $start = $segWords[0]['start'];
            $end = $segWords[array_key_last($segWords)]['end'];
            $text = implode(
                '',
                array_map(
                    fn (int $i, array $w): string => $i === 0 ? $w['word'] : ' '.$w['word'],
                    array_keys($segWords),
                    $segWords,
                ),
            );

            $lines[] = (string) ($index + 1);
            $lines[] = $this->formatTimecode($start).' --> '.$this->formatTimecode($end);
            $lines[] = trim($text);
            $lines[] = '';
        }

        return implode("\n", $lines);
    }

    private function formatTimecode(float $seconds): string
    {
        $ms = (int) round(($seconds - floor($seconds)) * 1000);
        $s = (int) $seconds % 60;
        $m = (int) ($seconds / 60) % 60;
        $h = (int) ($seconds / 3600);

        return sprintf('%02d:%02d:%02d,%03d', $h, $m, $s, $ms);
    }
}
