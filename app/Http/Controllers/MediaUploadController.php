<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

final class MediaUploadController extends Controller
{
    public function upload(Request $request, Video $video): RedirectResponse
    {
        $request->validate([
            'files.*' => 'required|image',
        ]);

        $uploadedFiles = [];
        $existingCount = count(Storage::disk('public')->files("videos/{$video->id}/images") ?: []);

        foreach ($request->file('files') as $index => $file) {
            $fileNumber = $existingCount + $index + 1;
            $extension = $file->getClientOriginalExtension();
            $filename = str_pad((string) $fileNumber, 3, '0', STR_PAD_LEFT)."_foto{$fileNumber}.{$extension}";

            Storage::disk('public')->putFileAs("videos/{$video->id}/images", $file, $filename);

            $uploadedFiles[] = [
                'id' => uniqid(),
                'name' => $file->getClientOriginalName(),
                'path' => "videos/{$video->id}/images/{$filename}",
                'url' => Storage::url("videos/{$video->id}/images/{$filename}"),
                'size' => $file->getSize(),
            ];
        }

        return redirect()->back()->with('uploadedFiles', $uploadedFiles);
    }

    public function delete(Video $video, string $filename): RedirectResponse
    {
        Storage::disk('public')->delete("videos/{$video->id}/images/{$filename}");

        return redirect()->back();
    }
}
