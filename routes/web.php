<?php

use App\Http\Controllers\VideoCreatorController;
use App\Http\Controllers\MediaUploadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('video-creator');
})->name('home');

Route::get('video-creator', VideoCreatorController::class)
    ->name('video-creator');

Route::post('video/generate', [\App\Http\Controllers\VideoGenerationController::class, 'process'])
    ->name('video.generate');

Route::post('media/upload', [MediaUploadController::class, 'upload'])
    ->name('media.upload');

require __DIR__.'/settings.php';
