<?php

declare(strict_types=1);

namespace App\Http\Controllers\Video;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class UpdateVideoScriptController extends Controller
{
    public function __invoke(Request $request, Video $video): RedirectResponse
    {
        $request->validate([
            'script' => 'required|string|max:10000',
        ]);

        $video->update(['script' => $request->input('script')]);

        return back();
    }
}
