<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobPostingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('job-postings.edit');
    }

    public function rules(): array
    {
        return [
            'title'        => ['required', 'string', 'max:255'],
            'department'   => ['required', 'string', 'max:100'],
            'description'  => ['required', 'string'],
            'requirements' => ['required', 'string'],
            'status'       => ['required', 'in:open,closed'],
        ];
    }
}
