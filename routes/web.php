<?php

use App\Http\Controllers\MediaUploadController;
use App\Http\Controllers\Video\CreateVideoProjectController;
use App\Http\Controllers\VideoCreatorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('video-creator.v2');
})->name('home');

Route::get('video-creator', [VideoCreatorController::class, 'index'])
    ->name('video-creator');

Route::get('v2/video-creator', [VideoCreatorController::class, 'v2'])
    ->name('video-creator.v2');

Route::get('v2/video-creator/new', CreateVideoProjectController::class)
    ->name('video-creator.v2.wizard');

Route::post('video/generate', [\App\Http\Controllers\VideoGenerationController::class, 'process'])
    ->name('video.generate');

Route::post('media/upload', [MediaUploadController::class, 'upload'])
    ->name('media.upload');

require __DIR__.'/settings.php';
