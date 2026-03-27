<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * API 요청은 항상 JSON으로 응답
     */
    public function render($request, Throwable $e): JsonResponse|\Illuminate\Http\Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($e);
        }

        return parent::render($request, $e);
    }

    private function handleApiException(Throwable $e): JsonResponse
    {
        // 유효성 검사 실패
        if ($e instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => '입력값을 확인해주세요.',
                'errors'  => $e->errors(),
            ], 422);
        }

        // 인증 실패
        if ($e instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => '인증이 필요합니다.',
                'errors'  => null,
            ], 401);
        }

        // 권한 없음
        if ($e instanceof AccessDeniedHttpException) {
            return response()->json([
                'success' => false,
                'message' => '접근 권한이 없습니다.',
                'errors'  => null,
            ], 403);
        }

        // 모델 찾을 수 없음
        if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
            return response()->json([
                'success' => false,
                'message' => '요청한 리소스를 찾을 수 없습니다.',
                'errors'  => null,
            ], 404);
        }

        // 그 외 서버 에러
        return response()->json([
            'success' => false,
            'message' => app()->isProduction()
                ? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
                : $e->getMessage(),
            'errors'  => null,
        ], 500);
    }
}
