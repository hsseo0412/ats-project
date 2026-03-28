<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApplicantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('applicants.edit');
    }

    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'max:100'],
            'email'  => ['required', 'email', 'max:255'],
            'phone'  => ['nullable', 'string', 'max:20'],
            'resume' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ];
    }
}
