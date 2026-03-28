import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const STAGE_STYLES = {
    '서류':   'bg-blue-50 text-blue-700 ring-blue-200',
    '1차면접': 'bg-amber-50 text-amber-700 ring-amber-200',
    '2차면접': 'bg-orange-50 text-orange-700 ring-orange-200',
    '최종합격': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    '불합격':  'bg-red-50 text-red-700 ring-red-200',
};

const STAGES = ['서류', '1차면접', '2차면접', '최종합격', '불합격'];
const RESULT_LABELS = { pass: '합격', fail: '불합격', pending: '평가 중' };
const RESULT_STYLES = {
    pass: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    fail: 'bg-red-50 text-red-700 ring-red-200',
    pending: 'bg-slate-100 text-slate-600 ring-slate-200',
};

function StageBadge({ stage }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STAGE_STYLES[stage] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
            {stage}
        </span>
    );
}

function StageForm({ applicant }) {
    const { data, setData, post, processing, errors, reset } = useForm({ stage: '', note: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicants.stages.store', applicant.id), { onSuccess: () => reset() });
    };

    return (
        <form onSubmit={submit} className="mt-5 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-5">
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">단계 변경</label>
                <select
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={data.stage}
                    onChange={(e) => setData('stage', e.target.value)}
                    required
                >
                    <option value="">선택</option>
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <InputError message={errors.stage} className="mt-1" />
            </div>
            <div className="flex-1 min-w-48">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">메모 (선택)</label>
                <input
                    type="text"
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="단계 변경 사유"
                    value={data.note}
                    onChange={(e) => setData('note', e.target.value)}
                />
            </div>
            <button
                type="submit"
                disabled={processing}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
                변경
            </button>
        </form>
    );
}

export default function Show({ applicant }) {
    const { auth } = usePage().props;
    const isAdmin = auth.roles?.includes('admin');
    const latestStage = applicant.stages?.[applicant.stages.length - 1];

    const scoreColor = applicant.ai_score >= 80
        ? 'text-emerald-600'
        : applicant.ai_score >= 60
        ? 'text-amber-600'
        : 'text-red-600';

    const scoreBarColor = applicant.ai_score >= 80
        ? 'bg-emerald-500'
        : applicant.ai_score >= 60
        ? 'bg-amber-500'
        : 'bg-red-500';

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-slate-900">{applicant.name}</h1>
                    <p className="text-xs text-slate-500 mt-0.5">{applicant.job_posting?.title}</p>
                </div>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <Link href={route('applicants.edit', applicant.id)} className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            수정
                        </Link>
                    )}
                    <Link href={route('applicants.index')} className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        목록
                    </Link>
                </div>
            </div>
        }>
            <Head title={applicant.name} />

            <div className="p-6 lg:p-8 space-y-5">
                <div className="grid gap-5 lg:grid-cols-3">
                    {/* 기본 정보 */}
                    <div className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">기본 정보</h2>
                        <dl className="space-y-4">
                            {[
                                ['이름', applicant.name],
                                ['이메일', applicant.email],
                                ['연락처', applicant.phone ?? '-'],
                                ['지원 공고', applicant.job_posting?.title ?? '-'],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-xs text-slate-400">{label}</dt>
                                    <dd className="text-sm font-medium text-slate-900 mt-0.5">{value}</dd>
                                </div>
                            ))}
                        </dl>
                        {latestStage && (
                            <div className="mt-5 pt-4 border-t border-slate-100">
                                <dt className="text-xs text-slate-400 mb-1.5">현재 단계</dt>
                                <StageBadge stage={latestStage.stage} />
                            </div>
                        )}
                    </div>

                    {/* AI 분석 결과 */}
                    <div className="rounded-xl bg-white p-6 ring-1 ring-slate-200 lg:col-span-2">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">AI 분석 결과</h2>
                        {applicant.ai_analyzed_at ? (
                            <>
                                <div className="mb-5 flex items-center gap-5">
                                    <div className="text-center shrink-0">
                                        <div className={`text-4xl font-bold ${scoreColor}`}>{applicant.ai_score}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">/ 100</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 rounded-full bg-slate-100">
                                            <div
                                                className={`h-2 rounded-full transition-all ${scoreBarColor}`}
                                                style={{ width: `${applicant.ai_score}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1.5">채용공고 적합도 점수</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{applicant.ai_summary}</p>
                                <p className="mt-3 text-xs text-slate-400">
                                    분석일시: {new Date(applicant.ai_analyzed_at).toLocaleString('ko-KR')}
                                </p>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 text-sm text-slate-400 py-4">
                                <svg className="h-5 w-5 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                AI 분석이 진행 중입니다...
                            </div>
                        )}
                    </div>
                </div>

                {/* 단계 이력 */}
                <div className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">단계 이력</h2>
                    <ol className="relative border-l border-slate-200 ml-2 space-y-4">
                        {applicant.stages?.map((stage) => (
                            <li key={stage.id} className="pl-5">
                                <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-slate-300" />
                                <div className="flex items-center gap-2 mb-0.5">
                                    <StageBadge stage={stage.stage} />
                                </div>
                                <p className="text-xs text-slate-500">{stage.note}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {stage.changed_by?.name} · {new Date(stage.created_at).toLocaleString('ko-KR')}
                                </p>
                            </li>
                        ))}
                    </ol>
                    {isAdmin && <StageForm applicant={applicant} />}
                </div>

                {/* 면접 이력 */}
                {applicant.interviews?.length > 0 && (
                    <div className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">면접 이력</h2>
                        <div className="space-y-3">
                            {applicant.interviews.map((interview) => (
                                <div key={interview.id} className="flex items-start justify-between rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{interview.interviewer?.name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {new Date(interview.scheduled_at).toLocaleString('ko-KR')} · {interview.location ?? '-'}
                                        </p>
                                        {interview.evaluation && (
                                            <p className="mt-2 text-sm text-slate-600">{interview.evaluation}</p>
                                        )}
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${RESULT_STYLES[interview.result]}`}>
                                        {RESULT_LABELS[interview.result]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
