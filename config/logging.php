<?php

use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Processor\PsrLogMessageProcessor;

return [

    'default' => env('LOG_CHANNEL', 'stack'),

    'deprecations' => [
        'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
        'trace'   => env('LOG_DEPRECATIONS_TRACE', false),
    ],

    'channels' => [

        // 기본 스택: 전체 + 레벨별 동시 기록
        'stack' => [
            'driver'            => 'stack',
            'channels'          => ['daily', 'error', 'info'],
            'ignore_exceptions' => false,
        ],

        // 날짜별 전체 로그 — storage/logs/laravel-YYYY-MM-DD.log (90일)
        'daily' => [
            'driver'               => 'daily',
            'path'                 => storage_path('logs/laravel.log'),
            'level'                => env('LOG_LEVEL', 'debug'),
            'days'                 => env('LOG_DAILY_DAYS', 90),
            'replace_placeholders' => true,
        ],

        // ERROR 이상 전용 — storage/logs/error/error-YYYY-MM-DD.log (180일)
        'error' => [
            'driver'               => 'daily',
            'path'                 => storage_path('logs/error/error.log'),
            'level'                => 'error',
            'days'                 => env('LOG_ERROR_DAYS', 180),
            'replace_placeholders' => true,
        ],

        // INFO ~ WARNING 전용 — storage/logs/info/info-YYYY-MM-DD.log (30일)
        'info' => [
            'driver'               => 'daily',
            'path'                 => storage_path('logs/info/info.log'),
            'level'                => 'info',
            'days'                 => env('LOG_INFO_DAYS', 30),
            'replace_placeholders' => true,
        ],

        // API 요청/응답 전용 — storage/logs/api/api-YYYY-MM-DD.log (30일)
        'api' => [
            'driver'               => 'daily',
            'path'                 => storage_path('logs/api/api.log'),
            'level'                => 'info',
            'days'                 => env('LOG_API_DAYS', 30),
            'replace_placeholders' => true,
        ],

        'stderr' => [
            'driver'    => 'monolog',
            'level'     => env('LOG_LEVEL', 'debug'),
            'handler'   => StreamHandler::class,
            'formatter' => env('LOG_STDERR_FORMATTER'),
            'with'      => ['stream' => 'php://stderr'],
            'processors' => [PsrLogMessageProcessor::class],
        ],

        'null' => [
            'driver'  => 'monolog',
            'handler' => NullHandler::class,
        ],
    ],
];
