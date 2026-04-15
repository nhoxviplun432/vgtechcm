<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});

// Health check — kiểm tra kết nối DB + Redis
Route::get('/api/health', function () {
    $checks = [];

    // Database
    try {
        \DB::connection()->getPdo();
        $checks['database'] = ['status' => 'ok', 'driver' => config('database.default')];
    } catch (\Exception $e) {
        $checks['database'] = ['status' => 'error', 'message' => $e->getMessage()];
    }

    // Redis / Cache
    try {
        
        \Cache::put('health_check', true, 5);
        \Cache::forget('health_check');
        $checks['cache'] = ['status' => 'ok', 'driver' => config('cache.default')];

    } catch (\Exception $e) {
        $checks['cache'] = ['status' => 'error', 'message' => $e->getMessage()];
    }

    $allOk = collect($checks)->every(fn($c) => $c['status'] === 'ok');

    return response()->json([
        'status'  => $allOk ? 'ok' : 'degraded',
        'app'     => config('app.name'),
        'version' => app()->version(),
        'checks'  => $checks,
    ], $allOk ? 200 : 503);

});
