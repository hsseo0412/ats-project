<?php

use App\Http\Middleware\ApiLogger;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // Inertia.js (Breeze 설치 후 활성화)
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // API 자동 로깅
        $middleware->api(append: [
            ApiLogger::class,
        ]);

        // Sanctum SPA 인증
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {

        // 예외 발생 시 error 채널에 자동 기록
        $exceptions->reportable(function (\Throwable $e) {
            Log::channel('error')->error($e->getMessage(), [
                'exception' => get_class($e),
                'file'      => $e->getFile(),
                'line'      => $e->getLine(),
                'trace'     => collect($e->getTrace())->take(10)->toArray(),
            ]);
        });

    })->create();
