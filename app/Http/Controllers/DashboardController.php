<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\JobPosting;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_postings'    => JobPosting::count(),
            'open_postings'     => JobPosting::where('status', 'open')->count(),
            'total_applicants'  => Applicant::count(),
            'analyzed_applicants' => Applicant::whereNotNull('ai_analyzed_at')->count(),
        ];

        $postingsWithCounts = JobPosting::withCount('applicants')
            ->with(['applicants' => function ($query) {
                $query->orderByDesc('ai_score')->limit(5);
            }])
            ->latest()
            ->get();

        $topApplicants = Applicant::with('jobPosting')
            ->whereNotNull('ai_score')
            ->orderByDesc('ai_score')
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard', [
            'stats'              => $stats,
            'postingsWithCounts' => $postingsWithCounts,
            'topApplicants'      => $topApplicants,
        ]);
    }
}
