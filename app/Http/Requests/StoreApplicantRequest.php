<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('applicants.create');
    }

    public function rules(): array
    {
        return [
            'job_posting_id' => ['required', 'exists:job_postings,id'],
            'name'           => ['required', 'string', 'max:100'],
            'email'          => ['required', 'email', 'max:255'],
            'phone'          => ['nullable', 'string', 'max:20'],
            'resume'         => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ];
    }
}
