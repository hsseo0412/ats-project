<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInterviewRequest;
use App\Http\Requests\UpdateInterviewEvaluationRequest;
use App\Models\Interview;
use App\Models\Applicant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InterviewController extends Controller
{
    public function index(): Response
    {
        $interviews = Interview::with(['applicant.jobPosting', 'interviewer'])
            ->orderBy('scheduled_at')
            ->paginate(20);

        return Inertia::render('Interviews/Index', [
            'interviews' => $interviews,
        ]);
    }

    public function create(): Response
    {
        $applicants  = Applicant::with('jobPosting')->select('id', 'name', 'job_posting_id')->get();
        $interviewers = User::role('interviewer')->select('id', 'name')->get();

        return Inertia::render('Interviews/Create', [
            'applicants'   => $applicants,
            'interviewers' => $interviewers,
        ]);
    }

    public function store(StoreInterviewRequest $request): RedirectResponse
    {
        $interview = Interview::create($request->validated());

        return redirect()->route('interviews.index')
            ->with('success', '면접 일정이 등록되었습니다.');
    }

    public function show(Interview $interview): Response
    {
        $interview->load(['applicant.jobPosting', 'interviewer']);

        return Inertia::render('Interviews/Show', [
            'interview' => $interview,
        ]);
    }

    public function evaluate(Interview $interview): Response
    {
        $this->authorize('interviews.evaluate');

        $interview->load(['applicant.jobPosting', 'interviewer']);

        return Inertia::render('Interviews/Evaluate', [
            'interview' => $interview,
        ]);
    }

    public function updateEvaluation(UpdateInterviewEvaluationRequest $request, Interview $interview): RedirectResponse
    {
        // 본인 면접만 평가 가능
        if ($interview->interviewer_id !== $request->user()->id && !$request->user()->hasRole('admin')) {
            abort(403);
        }

        $interview->update($request->validated());

        return redirect()->route('interviews.show', $interview)
            ->with('success', '면접 평가가 저장되었습니다.');
    }
}
