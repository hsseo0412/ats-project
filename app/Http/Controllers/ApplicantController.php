<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicantRequest;
use App\Http\Requests\UpdateApplicantRequest;
use App\Jobs\AnalyzeResume;
use App\Models\Applicant;
use App\Models\ApplicationStage;
use App\Models\JobPosting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ApplicantController extends Controller
{
    public function index(): Response
    {
        $applicants = Applicant::with(['jobPosting', 'latestStage'])
            ->orderByDesc('ai_score')
            ->paginate(20);

        $jobPostings = JobPosting::where('status', 'open')
            ->select('id', 'title', 'department')
            ->get();

        return Inertia::render('Applicants/Index', [
            'applicants'  => $applicants,
            'jobPostings' => $jobPostings,
        ]);
    }

    public function create(): Response
    {
        $jobPostings = JobPosting::where('status', 'open')
            ->select('id', 'title', 'department')
            ->get();

        return Inertia::render('Applicants/Create', [
            'jobPostings' => $jobPostings,
        ]);
    }

    public function store(StoreApplicantRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $path = $request->file('resume')->store('resumes', 'private');
        $data['resume_path'] = $path;
        unset($data['resume']);

        $applicant = Applicant::create($data);

        // 서류 단계로 초기화
        ApplicationStage::create([
            'applicant_id' => $applicant->id,
            'stage'        => '서류',
            'changed_by'   => $request->user()->id,
            'note'         => '지원서 접수',
        ]);

        // AI 분석 비동기 실행
        AnalyzeResume::dispatch($applicant);

        return redirect()->route('applicants.show', $applicant)
            ->with('success', '지원자가 등록되었습니다. AI 분석이 진행 중입니다.');
    }

    public function show(Applicant $applicant): Response
    {
        $applicant->load([
            'jobPosting',
            'stages.changedBy',
            'interviews.interviewer',
        ]);

        return Inertia::render('Applicants/Show', [
            'applicant' => $applicant,
        ]);
    }

    public function edit(Applicant $applicant): Response
    {
        return Inertia::render('Applicants/Edit', [
            'applicant' => $applicant,
        ]);
    }

    public function update(UpdateApplicantRequest $request, Applicant $applicant): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('resume')) {
            // 기존 파일 삭제
            if ($applicant->resume_path) {
                Storage::disk('private')->delete($applicant->resume_path);
            }
            $data['resume_path'] = $request->file('resume')->store('resumes', 'private');

            // AI 재분석
            $applicant->update([
                'ai_summary'     => null,
                'ai_score'       => null,
                'ai_analyzed_at' => null,
            ]);
            AnalyzeResume::dispatch($applicant);
        }

        unset($data['resume']);
        $applicant->update($data);

        return redirect()->route('applicants.show', $applicant)
            ->with('success', '지원자 정보가 수정되었습니다.');
    }

    public function destroy(Applicant $applicant): RedirectResponse
    {
        $this->authorize('applicants.delete');

        if ($applicant->resume_path) {
            Storage::disk('private')->delete($applicant->resume_path);
        }

        $applicant->delete();

        return redirect()->route('applicants.index')
            ->with('success', '지원자가 삭제되었습니다.');
    }
}
