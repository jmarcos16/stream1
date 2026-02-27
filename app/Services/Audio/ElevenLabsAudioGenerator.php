<?php

declare(strict_types=1);

namespace App\Services\Audio;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

final class ElevenLabsAudioGenerator implements AudioGeneratorInterface
{
    private string $apiKey {
        get => config('services.elevenlabs.key', '');
    }

    private string $voiceId {
        get => config('services.elevenlabs.voice_id', 'bIHbv24MWmeRgasZH58o');
    }

    private string $baseUrl = 'https://api.elevenlabs.io/v1';

    public function generate(string $text, string $outputFilePath): string
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('ElevenLabs API key is missing.');
        }

        $response = Http::withHeaders([
            'xi-api-key' => $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'audio/mpeg',
        ])->post("{$this->baseUrl}/text-to-speech/{$this->voiceId}", [
            'text' => $text,
            'model_id' => 'eleven_multilingual_v2',
            'voice_settings' => [
                'stability' => 0.5,
                'similarity_boost' => 0.75,
                'speed' => 1.18,
            ],
        ]);

        if ($response->failed()) {
            throw new RuntimeException('ElevenLabs API Error: '.$response->body());
        }

        Storage::disk('local')->put($outputFilePath, $response->body());

        return $outputFilePath;
    }
}
