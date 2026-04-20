<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use DateTime;
use DateTimeZone;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class HumanDesignController extends Controller
{
    public function lookup(Request $request)
    {
        $date     = $request->query('date', '');
        $timezone = $request->query('timezone', '');

        if (!$date || !$timezone) {
            return response()->json(['error' => 'Missing required params: date, timezone'], 400);
        }

        // Expect YYYY-MM-DD HH:MM:SS
        if (!preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $date)) {
            return response()->json(['error' => 'Invalid date format. Expected: YYYY-MM-DD HH:MM:SS'], 400);
        }

        // Convert IANA timezone name → UTC offset in minutes at the given birth date.
        // The API crashes on string timezone values; it expects a numeric minute offset.
        try {
            $tz = new DateTimeZone($timezone);
            $dt = new DateTime($date, $tz);
            $offsetMinutes = (int) ($tz->getOffset($dt) / 60);
        } catch (Exception) {
            return response()->json(['error' => 'Invalid timezone: ' . $timezone], 400);
        }

        $apiKey = config('services.bodygraph.api_key');

        // Build URL manually with rawurlencode so spaces become %20, not +.
        // The upstream API returns a WordPress 500 when spaces are encoded as +.
        $url = 'https://api.bodygraphchart.com/v221006/hd-data'
            . '?api_key='  . rawurlencode($apiKey)
            . '&date='     . rawurlencode($date)
            . '&timezone=' . $offsetMinutes;

        $response = Http::timeout(10)->get($url);

        if ($response->failed()) {
            return response()->json(['error' => 'Upstream error: ' . $response->status()], $response->status());
        }

        $data = $response->json();

        if (empty($data) || isset($data['error'])) {
            $msg = $data['error'] ?? 'No data returned from upstream';
            return response()->json(['error' => $msg], 404);
        }

        return response()->json($data);
    }
}
