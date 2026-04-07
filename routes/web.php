<?php

use App\Http\Controllers\TempMediaController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoCreatorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('videos.index');
})->name('home');

Route::get('video-creator', [VideoCreatorController::class, 'index'])
    ->name('video-creator');

Route::post('video/generate', [\App\Http\Controllers\VideoGenerationController::class, 'process'])
    ->name('video.generate');

Route::post('video/draft', [\App\Http\Controllers\DraftVideoController::class, 'store'])
    ->name('video.draft');

Route::post('temp-media', [TempMediaController::class, 'store'])
    ->name('temp-media.store');

Route::delete('temp-media/{filename}', [TempMediaController::class, 'destroy'])
    ->name('temp-media.destroy');

Route::get('videos', [VideoController::class, 'index'])
    ->name('videos.index');

Route::get('videos/{video}', [VideoController::class, 'show'])
    ->name('videos.show');

Route::delete('videos/{video}', [VideoController::class, 'destroy'])
    ->name('videos.destroy');

Route::get('videos/{video}/download', [VideoController::class, 'download'])
    ->name('videos.download');

Route::get('videos/{video}/download-subtitle', [VideoController::class, 'downloadSubtitle'])
    ->name('videos.download-subtitle');

require __DIR__.'/settings.php';
