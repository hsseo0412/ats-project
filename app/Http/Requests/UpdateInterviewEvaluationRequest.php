<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInterviewEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('interviews.evaluate');
    }

    public function rules(): array
    {
        return [
            'evaluation' => ['required', 'string', 'max:3000'],
            'result'     => ['required', 'in:pass,fail,pending'],
        ];
    }
}
