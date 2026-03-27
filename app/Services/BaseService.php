<?php

namespace App\Services;

/**
 * 모든 Service 클래스의 기본 클래스
 *
 * 사용 예시:
 *
 * class UserService extends BaseService
 * {
 *     public function __construct(private UserRepository $userRepository) {}
 *
 *     public function getList(array $filters): LengthAwarePaginator
 *     {
 *         return $this->userRepository->paginate($filters);
 *     }
 * }
 */
abstract class BaseService
{
    //
}
