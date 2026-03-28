<?php

use App\Http\Controllers\ApplicationStageController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // 대시보드
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 프로필
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 채용공고 (admin)
    Route::resource('job-postings', JobPostingController::class);

    // 지원자 (admin)
    Route::resource('applicants', ApplicantController::class);

    // 지원 단계 변경 (admin)
    Route::post('applicants/{applicant}/stages', [ApplicationStageController::class, 'store'])
        ->name('applicants.stages.store');

    // 면접 일정 (admin: index/create/store/show, interviewer: evaluate)
    Route::resource('interviews', InterviewController::class)->only(['index', 'create', 'store', 'show']);

    // 면접 평가 (interviewer)
    Route::get('interviews/{interview}/evaluate', [InterviewController::class, 'evaluate'])
        ->name('interviews.evaluate');
    Route::patch('interviews/{interview}/evaluate', [InterviewController::class, 'updateEvaluation'])
        ->name('interviews.update-evaluation');
});

require __DIR__.'/auth.php';
