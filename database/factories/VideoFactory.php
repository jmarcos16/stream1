<?php

namespace Database\Factories;

use App\VideoStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Video>
 */
class VideoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'script' => fake()->paragraph(),
            'status' => VideoStatus::PENDING,
            'audio_path' => null,
            'audio_duration' => null,
            'video_path' => null,
            'raw_video_path' => null,
            'srt_path' => null,
            'subtitle_style' => 'bottom',
        ];
    }
}
