<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInterviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('interviews.create');
    }

    public function rules(): array
    {
        return [
            'applicant_id'   => ['required', 'exists:applicants,id'],
            'interviewer_id' => ['required', 'exists:users,id'],
            'scheduled_at'   => ['required', 'date', 'after:now'],
            'location'       => ['nullable', 'string', 'max:255'],
        ];
    }
}
