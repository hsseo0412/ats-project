<?php

namespace App\Http\Requests;

use App\Models\ApplicationStage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApplicationStageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('stages.manage');
    }

    public function rules(): array
    {
        return [
            'stage' => ['required', Rule::in(ApplicationStage::STAGES)],
            'note'  => ['nullable', 'string', 'max:1000'],
        ];
    }
}
