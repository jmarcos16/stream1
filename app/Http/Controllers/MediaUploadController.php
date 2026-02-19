<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;

final class MediaUploadController extends Controller
{
    public function upload(Request $request): RedirectResponse
    {
        $request->validate([
            'files.*' => 'required|image|max:512000',
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store('images', 'public');

            $uploadedFiles[] = [
                'id' => uniqid(),
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
                'size' => $file->getSize(),
            ];
        }

        return redirect()->back()->with('uploadedFiles', $uploadedFiles);
    }
}
