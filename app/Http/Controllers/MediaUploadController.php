<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

final class MediaUploadController extends Controller
{
    public function upload(Request $request): RedirectResponse
    {
        $request->validate([
            'files.*' => 'required|image',
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store('images', 'public');

            $uploadedFiles[] = [
                'id' => uniqid(),
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'url' => Storage::url($path),
                'size' => $file->getSize(),
            ];
        }

        return redirect()->back()->with('uploadedFiles', $uploadedFiles);
    }
}
