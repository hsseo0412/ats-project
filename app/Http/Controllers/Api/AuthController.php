<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * 회원가입
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('user'); // 기본 역할 부여

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->created([
            'user'  => $user,
            'token' => $token,
        ], '회원가입이 완료되었습니다.');
    }

    /**
     * 로그인
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->error('이메일 또는 비밀번호가 올바르지 않습니다.', 401);
        }

        // 기존 토큰 삭제 (선택사항 — 한 기기만 허용할 경우)
        // $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user'  => $user,
            'token' => $token,
        ], '로그인되었습니다.');
    }

    /**
     * 로그아웃
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, '로그아웃되었습니다.');
    }

    /**
     * 내 정보 조회
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            $request->user()->load('roles')
        );
    }
}
