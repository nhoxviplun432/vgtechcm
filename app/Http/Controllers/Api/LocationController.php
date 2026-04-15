<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LocationController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->query('query', '');

        if (strlen(trim($query)) < 2) {
            return response()->json([]);
        }

        $apiKey = config('services.bodygraph.api_key');

        $response = Http::timeout(5)->get('https://api.bodygraphchart.com/v210502/locations', [
            'api_key' => $apiKey,
            'query'   => $query,
        ]);

        if ($response->failed()) {
            return response()->json([], 502);
        }

        return response()->json($response->json());
    }
}
