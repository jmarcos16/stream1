<?php
declare(strict_types=1);

namespace App\Http\Controllers\Video;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;

final class StoreDraftVideoController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        $video = Video::create([
            'title' => 'Untitled Project',
            'status' => 'draft',
        ]);

        return redirect()->route('video-creator.v2.edit', $video->id);
    }
}
