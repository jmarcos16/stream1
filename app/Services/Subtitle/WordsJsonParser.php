<?php

declare(strict_types=1);

namespace App\Services\Subtitle;

final class WordsJsonParser
{
    private const SWITCH_CAPTIONS_EVERY_MS = 1200;

    /**
     * Parse a words.json file (from OpenAI Whisper) into subtitle segments,
     * grouping words the same way the Remotion renderer does:
     * combine tokens within 1200ms of each page start.
     *
     * @param  string  $json
     * @return list<array{index: int, start: float, end: float, text: string}>
     */
    public function parse(string $json): array
    {
        /** @var list<array{word: string, start: float, end: float}> $words */
        $words = json_decode($json, true);

        if (empty($words) || ! is_array($words)) {
            return [];
        }

        $segments = [];
        $currentWords = [];
        $pageStartMs = null;
        $index = 1;

        foreach ($words as $word) {
            $startMs = (int) round($word['start'] * 1000);
            $endMs = (int) round($word['end'] * 1000);

            if ($pageStartMs === null) {
                $pageStartMs = $startMs;
            }

            $withinPage = ($startMs - $pageStartMs) < self::SWITCH_CAPTIONS_EVERY_MS;

            if (! $withinPage && ! empty($currentWords)) {
                $segments[] = $this->buildSegment($index++, $currentWords);
                $currentWords = [];
                $pageStartMs = $startMs;
            }

            $currentWords[] = ['word' => $word['word'], 'start' => $word['start'], 'end' => $word['end']];
        }

        if (! empty($currentWords)) {
            $segments[] = $this->buildSegment($index, $currentWords);
        }

        return $segments;
    }

    /**
     * @param  list<array{word: string, start: float, end: float}>  $words
     * @return array{index: int, start: float, end: float, text: string}
     */
    private function buildSegment(int $index, array $words): array
    {
        $text = implode('', array_map(
            fn (int $i, array $w): string => $i === 0 ? $w['word'] : ' '.$w['word'],
            array_keys($words),
            $words,
        ));

        return [
            'index' => $index,
            'start' => round($words[0]['start'], 3),
            'end' => round($words[array_key_last($words)]['end'], 3),
            'text' => trim($text),
        ];
    }
}
