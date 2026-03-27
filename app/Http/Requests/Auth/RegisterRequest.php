<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:50'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'      => '이름을 입력해주세요.',
            'name.max'           => '이름은 50자를 초과할 수 없습니다.',
            'email.required'     => '이메일을 입력해주세요.',
            'email.email'        => '올바른 이메일 형식이 아닙니다.',
            'email.unique'       => '이미 사용 중인 이메일입니다.',
            'password.required'  => '비밀번호를 입력해주세요.',
            'password.min'       => '비밀번호는 최소 8자 이상이어야 합니다.',
            'password.confirmed' => '비밀번호 확인이 일치하지 않습니다.',
        ];
    }
}
