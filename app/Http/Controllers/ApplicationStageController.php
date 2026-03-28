<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationStageRequest;
use App\Mail\StageChangedMail;
use App\Models\Applicant;
use App\Models\ApplicationStage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ApplicationStageController extends Controller
{
    public function store(StoreApplicationStageRequest $request, Applicant $applicant): RedirectResponse
    {
        $stage = ApplicationStage::create([
            'applicant_id' => $applicant->id,
            'stage'        => $request->stage,
            'changed_by'   => $request->user()->id,
            'note'         => $request->note,
        ]);

        // 이메일 알림 비동기 발송
        Mail::to($applicant->email)
            ->queue(new StageChangedMail($applicant, $stage));

        return redirect()->route('applicants.show', $applicant)
            ->with('success', "단계가 '{$stage->stage}'(으)로 변경되었습니다.");
    }
}
