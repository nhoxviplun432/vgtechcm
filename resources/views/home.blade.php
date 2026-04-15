<!DOCTYPE html>
<html lang="vi" class="h-full antialiased">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'VGTech MD') }}</title>
    <meta name="description" content="Tra cứu bản đồ năng lượng cá nhân qua Human Design và Thần số học.">

    {{-- Favicon --}}
    <link rel="icon" href="/favicon.ico">

    {{-- Vite: CSS + JS --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-full bg-slate-950 text-slate-50 flex items-center justify-center">

    <div class="mx-auto max-w-lg px-6 py-20 text-center">

        {{-- Logo / Icon --}}
        <div class="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 shadow-lg shadow-fuchsia-500/25">
            <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
        </div>

        {{-- Heading --}}
        <h1 class="text-3xl font-semibold tracking-tight">
            <span class="bg-gradient-to-r from-fuchsia-300 via-indigo-200 to-sky-200 bg-clip-text text-transparent">
                VGTech MD
            </span>
        </h1>
        <p class="mt-3 text-slate-400">
            Backend API đang chạy. Frontend được phục vụ qua Next.js.
        </p>

        {{-- Status badge --}}
        <div class="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-slate-300">Laravel {{ app()->version() }} · PHP {{ PHP_MAJOR_VERSION }}.{{ PHP_MINOR_VERSION }}</span>
        </div>

        {{-- Links --}}
        <div class="mt-10 flex flex-wrap justify-center gap-3">
            <a href="http://localhost:3000"
               target="_blank"
               class="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-fuchsia-600 hover:to-indigo-600 transition-all">
                Mở Frontend (Next.js)
            </a>
            <a href="/api/health"
               class="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors">
                API Health Check
            </a>
        </div>

        {{-- Env info (chỉ hiện khi debug = true) --}}
        @if(config('app.debug'))
        <div class="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-xs text-slate-400">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Debug Info</p>
            <div class="space-y-1.5">
                <div class="flex justify-between">
                    <span>Environment</span>
                    <span class="text-slate-300">{{ config('app.env') }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Database</span>
                    <span class="text-slate-300">{{ config('database.default') }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Cache</span>
                    <span class="text-slate-300">{{ config('cache.default') }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Queue</span>
                    <span class="text-slate-300">{{ config('queue.default') }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Session</span>
                    <span class="text-slate-300">{{ config('session.driver') }}</span>
                </div>
            </div>
        </div>
        @endif

    </div>

</body>
</html>
