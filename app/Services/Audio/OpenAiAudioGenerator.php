<?php

declare(strict_types=1);

namespace App\Services\Audio;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

final class OpenAiAudioGenerator implements AudioGeneratorInterface
{
    private string $apiKey {
        get => config('services.openai.key', '');
    }

    private string $model {
        get => config('services.openai.tts_model', 'tts-1');
    }

    private string $voice {
        get => config('services.openai.tts_voice', 'alloy');
    }

    private string $baseUrl = 'https://api.openai.com/v1';

    public function generate(string $text, string $outputFilePath): string
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('OpenAI API key is missing.');
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/audio/speech", [
            'model' => $this->model,
            'input' => $text,
            'voice' => $this->voice,
            'response_format' => 'mp3',
            'speed' => 1.0,
        ]);

        if ($response->failed()) {
            throw new RuntimeException('OpenAI TTS API Error: '.$response->body());
        }

        Storage::disk('public')->put($outputFilePath, $response->body());

        return $outputFilePath;
    }
}
