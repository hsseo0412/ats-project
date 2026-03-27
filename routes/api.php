<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| 인증이 필요없는 라우트는 상단에,
| 인증이 필요한 라우트는 auth:sanctum 미들웨어 안에 작성합니다.
|
*/

// 헬스체크
Route::get('/health', fn () => response()->json([
    'status'  => 'ok',
    'version' => config('app.version', '1.0.0'),
    'time'    => now()->toISOString(),
]));

// 인증 불필요
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// 인증 필요
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });

    // 여기에 도메인별 라우트 추가
    // Route::apiResource('posts', PostController::class);
});
