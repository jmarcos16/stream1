<?php

declare(strict_types=1);

namespace App\Services\Subtitle;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class OpenAiSubtitleGenerator implements SubtitleGeneratorInterface
{
    private string $apiKey {
        get => config('services.openai.key', '');
    }

    private string $model {
        get => config('services.openai.whisper_model', 'whisper-1');
    }

    private string $baseUrl = 'https://api.openai.com/v1';

    /**
     * @return list<array{word: string, start: float, end: float}>
     */
    public function generate(string $audioFilePath, string $outputJsonPath): array
    {
        if (file_exists($outputJsonPath)) {
            $cached = json_decode(File::get($outputJsonPath), true);

            if (! empty($cached)) {
                return $cached;
            }
        }

        if (empty($this->apiKey)) {
            throw new RuntimeException('OpenAI API key is missing.');
        }

        if (! file_exists($audioFilePath)) {
            throw new RuntimeException("Audio file not found: {$audioFilePath}");
        }

        File::ensureDirectoryExists(dirname($outputJsonPath));

        $response = Http::withToken($this->apiKey)
            ->attach('file', fopen($audioFilePath, 'r'), basename($audioFilePath))
            ->post("{$this->baseUrl}/audio/transcriptions", [
                'model' => $this->model,
                'response_format' => 'verbose_json',
                'timestamp_granularities' => ['word'],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('OpenAI Whisper API Error: '.$response->body());
        }

        $data = $response->json();

        if (empty($data['words'])) {
            throw new RuntimeException('OpenAI Whisper returned no word-level timestamps.');
        }

        $words = array_map(fn (array $w): array => [
            'word' => $w['word'],
            'start' => (float) $w['start'],
            'end' => (float) $w['end'],
        ], $data['words']);

        File::put($outputJsonPath, json_encode($words, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return $words;
    }
}
