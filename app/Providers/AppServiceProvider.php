<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Services\Audio\AudioGeneratorInterface::class,
            fn () => match (config('services.audio_generator')) {
                'openai' => new \App\Services\Audio\OpenAiAudioGenerator(),
                'elevenlabs' => new \App\Services\Audio\ElevenLabsAudioGenerator(),
                default => new \App\Services\Audio\ElevenLabsAudioGenerator(),
            }
        );

        $this->app->bind(
            \App\Services\Subtitle\SubtitleGeneratorInterface::class,
            \App\Services\Subtitle\OpenAiSubtitleGenerator::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
