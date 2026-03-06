<?php

use App\Http\Controllers\MediaUploadController;
use App\Http\Controllers\Video\EditVideoDraftController;
use App\Http\Controllers\Video\StoreDraftVideoController;
use App\Http\Controllers\Video\UpdateVideoScriptController;
use App\Http\Controllers\VideoCreatorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('video-creator');
})->name('home');

Route::get('video-creator', [VideoCreatorController::class, 'index'])
    ->name('video-creator');

Route::post('video-creator/draft', StoreDraftVideoController::class)
    ->name('video-creator.draft.store');

Route::get('video-creator/{video}/edit', EditVideoDraftController::class)
    ->name('video-creator.edit');

Route::patch('videos/{video}/script', UpdateVideoScriptController::class)
    ->name('video.script.update');

Route::post('video/generate', [\App\Http\Controllers\VideoGenerationController::class, 'process'])
    ->name('video.generate');

Route::post('videos/{video}/media/upload', [MediaUploadController::class, 'upload'])
    ->name('media.upload');

Route::delete('videos/{video}/media/{filename}', [MediaUploadController::class, 'delete'])
    ->name('media.delete');

require __DIR__.'/settings.php';
