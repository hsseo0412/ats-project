import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const STAGE_COLORS = {
    '서류': 'bg-blue-100 text-blue-700',
    '1차면접': 'bg-yellow-100 text-yellow-700',
    '2차면접': 'bg-orange-100 text-orange-700',
    '최종합격': 'bg-green-100 text-green-700',
    '불합격': 'bg-red-100 text-red-700',
};

const STAGES = ['서류', '1차면접', '2차면접', '최종합격', '불합격'];

const RESULT_LABELS = { pass: '합격', fail: '불합격', pending: '평가 중' };
const RESULT_COLORS = { pass: 'text-green-600', fail: 'text-red-600', pending: 'text-gray-500' };

function StageForm({ applicant }) {
    const { data, setData, post, processing, errors, reset } = useForm({ stage: '', note: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicants.stages.store', applicant.id), { onSuccess: () => reset() });
    };

    return (
        <form onSubmit={submit} className="mt-4 flex flex-wrap items-end gap-3 border-t border-gray-100 pt-4">
            <div>
                <label className="block text-xs font-medium text-gray-600">단계 변경</label>
                <select
                    className="mt-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                <label className="block text-xs font-medium text-gray-600">메모 (선택)</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="단계 변경 사유"
                    value={data.note}
                    onChange={(e) => setData('note', e.target.value)}
                />
            </div>
            <PrimaryButton disabled={processing} className="text-sm">변경</PrimaryButton>
        </form>
    );
}

export default function Show({ applicant }) {
    const { auth } = usePage().props;
    const isAdmin = auth.roles?.includes('admin');
    const latestStage = applicant.stages?.[applicant.stages.length - 1];

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">{applicant.name}</h2>
                    <p className="text-sm text-gray-500">{applicant.job_posting?.title}</p>
                </div>
                <div className="flex gap-2">
                    {isAdmin && <Link href={route('applicants.edit', applicant.id)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">수정</Link>}
                    <Link href={route('applicants.index')} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">목록</Link>
                </div>
            </div>
        }>
            <Head title={applicant.name} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* 기본 정보 */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold text-gray-700">기본 정보</h3>
                            <dl className="space-y-3">
                                {[
                                    ['이름', applicant.name],
                                    ['이메일', applicant.email],
                                    ['연락처', applicant.phone ?? '-'],
                                    ['지원 공고', applicant.job_posting?.title ?? '-'],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <dt className="text-xs text-gray-500">{label}</dt>
                                        <dd className="text-sm font-medium text-gray-900">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                            {latestStage && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <dt className="text-xs text-gray-500">현재 단계</dt>
                                    <dd className="mt-1">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STAGE_COLORS[latestStage.stage] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {latestStage.stage}
                                        </span>
                                    </dd>
                                </div>
                            )}
                        </div>

                        {/* AI 분석 결과 */}
                        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
                            <h3 className="mb-4 text-sm font-semibold text-gray-700">AI 분석 결과</h3>
                            {applicant.ai_analyzed_at ? (
                                <>
                                    <div className="mb-4 flex items-center gap-4">
                                        <div className="text-center">
                                            <div className={`text-3xl font-bold ${applicant.ai_score >= 80 ? 'text-green-600' : applicant.ai_score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {applicant.ai_score}
                                            </div>
                                            <div className="text-xs text-gray-500">/ 100점</div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-2 rounded-full bg-gray-200">
                                                <div
                                                    className={`h-2 rounded-full ${applicant.ai_score >= 80 ? 'bg-green-500' : applicant.ai_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${applicant.ai_score}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{applicant.ai_summary}</p>
                                    <p className="mt-2 text-xs text-gray-400">분석일시: {new Date(applicant.ai_analyzed_at).toLocaleString('ko-KR')}</p>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    AI 분석이 진행 중입니다...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 단계 이력 */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-gray-700">단계 이력</h3>
                        <ol className="space-y-3">
                            {applicant.stages?.map((stage) => (
                                <li key={stage.id} className="flex items-start gap-3">
                                    <span className={`mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_COLORS[stage.stage] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {stage.stage}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">{stage.note}</p>
                                        <p className="text-xs text-gray-400">{stage.changed_by?.name} · {new Date(stage.created_at).toLocaleString('ko-KR')}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        {isAdmin && <StageForm applicant={applicant} />}
                    </div>

                    {/* 면접 이력 */}
                    {applicant.interviews?.length > 0 && (
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold text-gray-700">면접 이력</h3>
                            <div className="space-y-3">
                                {applicant.interviews.map((interview) => (
                                    <div key={interview.id} className="flex items-start justify-between rounded-lg border border-gray-100 p-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{interview.interviewer?.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(interview.scheduled_at).toLocaleString('ko-KR')} · {interview.location ?? '-'}</p>
                                            {interview.evaluation && <p className="mt-1 text-sm text-gray-600">{interview.evaluation}</p>}
                                        </div>
                                        <span className={`text-sm font-medium ${RESULT_COLORS[interview.result]}`}>{RESULT_LABELS[interview.result]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
