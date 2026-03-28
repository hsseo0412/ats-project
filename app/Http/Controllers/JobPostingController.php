<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobPostingRequest;
use App\Http\Requests\UpdateJobPostingRequest;
use App\Models\JobPosting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class JobPostingController extends Controller
{
    public function index(): Response
    {
        $postings = JobPosting::with('user')
            ->withCount('applicants')
            ->latest()
            ->paginate(15);

        return Inertia::render('JobPostings/Index', [
            'postings' => $postings,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('JobPostings/Create');
    }

    public function store(StoreJobPostingRequest $request): RedirectResponse
    {
        $request->user()->jobPostings()->create($request->validated());

        return redirect()->route('job-postings.index')
            ->with('success', '채용공고가 등록되었습니다.');
    }

    public function show(JobPosting $jobPosting): Response
    {
        $jobPosting->load(['user', 'applicants' => function ($query) {
            $query->with('latestStage')->orderByDesc('ai_score');
        }]);

        return Inertia::render('JobPostings/Show', [
            'jobPosting' => $jobPosting,
        ]);
    }

    public function edit(JobPosting $jobPosting): Response
    {
        return Inertia::render('JobPostings/Edit', [
            'jobPosting' => $jobPosting,
        ]);
    }

    public function update(UpdateJobPostingRequest $request, JobPosting $jobPosting): RedirectResponse
    {
        $jobPosting->update($request->validated());

        return redirect()->route('job-postings.index')
            ->with('success', '채용공고가 수정되었습니다.');
    }

    public function destroy(JobPosting $jobPosting): RedirectResponse
    {
        $this->authorize('job-postings.delete');

        $jobPosting->delete();

        return redirect()->route('job-postings.index')
            ->with('success', '채용공고가 삭제되었습니다.');
    }
}
