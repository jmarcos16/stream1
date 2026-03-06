<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadTempMediaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class TempMediaController extends Controller
{
    public function store(UploadTempMediaRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $filename = Str::ulid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('tmp/media', $filename, 'public');

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
            'name' => $file->getClientOriginalName(),
        ]);
    }

    public function destroy(string $filename): JsonResponse
    {
        Storage::disk('public')->delete('tmp/media/'.$filename);

        return response()->json(['ok' => true]);
    }
}
