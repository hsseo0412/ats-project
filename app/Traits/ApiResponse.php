<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * 성공 응답
     */
    protected function success(
        mixed $data = null,
        string $message = '요청이 성공적으로 처리되었습니다.',
        int $statusCode = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $statusCode);
    }

    /**
     * 생성 성공 응답 (201)
     */
    protected function created(
        mixed $data = null,
        string $message = '성공적으로 생성되었습니다.'
    ): JsonResponse {
        return $this->success($data, $message, 201);
    }

    /**
     * 에러 응답
     */
    protected function error(
        string $message = '요청 처리 중 오류가 발생했습니다.',
        int $statusCode = 400,
        mixed $errors = null
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $statusCode);
    }

    /**
     * 인증 실패 응답 (401)
     */
    protected function unauthorized(string $message = '인증이 필요합니다.'): JsonResponse
    {
        return $this->error($message, 401);
    }

    /**
     * 권한 없음 응답 (403)
     */
    protected function forbidden(string $message = '접근 권한이 없습니다.'): JsonResponse
    {
        return $this->error($message, 403);
    }

    /**
     * 찾을 수 없음 응답 (404)
     */
    protected function notFound(string $message = '요청한 리소스를 찾을 수 없습니다.'): JsonResponse
    {
        return $this->error($message, 404);
    }

    /**
     * 페이지네이션 응답
     */
    protected function paginated(
        mixed $paginator,
        string $message = '조회가 완료되었습니다.'
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $paginator->items(),
            'meta'    => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }
}
