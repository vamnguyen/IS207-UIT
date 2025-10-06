<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Handle file uploads and return array of public URLs.
     * Accepts multipart form-data with files[]
     */
    public function upload(Request $request)
    {
        $request->validate([
            'folder' => 'required|string|max:255',
            'files' => 'required|array|max:20',
            'files.*' => 'file|mimes:jpg,jpeg,png,gif,webp|max:5120',
        ]);

        $disk = $request->input('folder');
        $uploadedUrls = [];

        if ($request->hasFile('files')) {
            $files = $request->file('files');
            foreach ($files as $file) {
                if (!$file || !$file->isValid()) {
                    continue;
                }

                $path = Storage::disk($disk)->putFile('', $file, 'public');
                if ($path) {
                    $baseUrl = config("filesystems.disks.$disk.url") ?? config('filesystems.disks.s3.url') ?? env('AWS_URL');
                    $root = config("filesystems.disks.$disk.root") ?? '';
                    $segments = array_filter([
                        rtrim($baseUrl, '/'),
                        trim($root, '/'),
                        ltrim($path, '/'),
                    ]);
                    $uploadedUrls[] = implode('/', $segments);
                }
            }
        }

        return response()->json(['urls' => $uploadedUrls]);
    }
}
