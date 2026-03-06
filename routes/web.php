<?php

use App\Http\Controllers\TempMediaController;
use App\Http\Controllers\VideoCreatorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('video-creator');
})->name('home');

Route::get('video-creator', [VideoCreatorController::class, 'index'])
    ->name('video-creator');

Route::post('video/generate', [\App\Http\Controllers\VideoGenerationController::class, 'process'])
    ->name('video.generate');

Route::post('temp-media', [TempMediaController::class, 'store'])
    ->name('temp-media.store');

Route::delete('temp-media/{filename}', [TempMediaController::class, 'destroy'])
    ->name('temp-media.destroy');

require __DIR__.'/settings.php';
