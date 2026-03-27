<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ApiLogger
{
    // 로깅 제외 경로
    private array $except = [
        'api/health',
        'telescope*',
        'horizon*',
    ];

    // 응답 바디 최대 길이 (bytes)
    private int $maxBodyLength = 5000;

    public function handle(Request $request, Closure $next): Response
    {
        foreach ($this->except as $pattern) {
            if ($request->is($pattern)) {
                return $next($request);
            }
        }

        $requestId = (string) Str::uuid();
        $startTime = microtime(true);

        $this->logRequest($request, $requestId);

        $response = $next($request);

        $this->logResponse($request, $response, $requestId, $startTime);

        return $response;
    }

    private function logRequest(Request $request, string $requestId): void
    {
        Log::channel('api')->info('API Request', [
            'request_id' => $requestId,
            'method'     => $request->method(),
            'url'        => $request->fullUrl(),
            'ip'         => $request->ip(),
            'user_id'    => $request->user()?->id,
            'user_agent' => $request->userAgent(),
            // 민감 필드 자동 제외
            'body'       => $request->except(['password', 'password_confirmation', 'token', 'secret']),
            'headers'    => $this->filterHeaders($request->headers->all()),
        ]);
    }

    private function logResponse(
        Request $request,
        Response $response,
        string $requestId,
        float $startTime
    ): void {
        $duration   = round((microtime(true) - $startTime) * 1000, 2);
        $statusCode = $response->getStatusCode();

        $logData = [
            'request_id'  => $requestId,
            'method'      => $request->method(),
            'url'         => $request->fullUrl(),
            'status_code' => $statusCode,
            'duration_ms' => $duration,
            'user_id'     => $request->user()?->id,
        ];

        // 4xx / 5xx 는 응답 바디도 기록
        if ($statusCode >= 400) {
            $content = $response->getContent();
            $logData['response_body'] = strlen($content) > $this->maxBodyLength
                ? substr($content, 0, $this->maxBodyLength) . '... [truncated]'
                : $content;
        }

        // 상태 코드에 따라 로그 레벨 분기
        match (true) {
            $statusCode >= 500 => Log::channel('api')->error('API Response', $logData),
            $statusCode >= 400 => Log::channel('api')->warning('API Response', $logData),
            default            => Log::channel('api')->info('API Response', $logData),
        };

        // 느린 응답 경고 (2초 이상)
        if ($duration > 2000) {
            Log::channel('api')->warning('Slow API Request', [
                'request_id'  => $requestId,
                'url'         => $request->fullUrl(),
                'duration_ms' => $duration,
            ]);
        }
    }

    private function filterHeaders(array $headers): array
    {
        $sensitive = ['authorization', 'cookie', 'x-xsrf-token'];

        return collect($headers)
            ->reject(fn ($v, $k) => in_array(strtolower($k), $sensitive))
            ->toArray();
    }
}
