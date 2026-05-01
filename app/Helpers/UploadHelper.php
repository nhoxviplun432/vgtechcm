<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;

class UploadHelper
{
    /**
     * Store an uploaded file under public/uploads/{subfolder}/{year}/{month}/
     * Returns the public URL path relative to the app base URL.
     */
    public static function store(UploadedFile $file): string
    {
        $now   = now();
        $year  = $now->format('Y');
        $month = $now->format('m');

        $dir      = public_path("uploads/{$year}/{$month}");
        $filename = uniqid('', true) . '.' . $file->getClientOriginalExtension();

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $file->move($dir, $filename);

        return "/uploads/{$year}/{$month}/{$filename}";
    }

    /**
     * Delete a file previously stored by store() given its URL path.
     */
    public static function delete(string $urlPath): void
    {
        $abs = public_path(ltrim($urlPath, '/'));
        if (is_file($abs)) {
            @unlink($abs);
        }
    }
}