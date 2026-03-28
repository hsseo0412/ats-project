import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const RESULT_LABELS = { pass: '합격', fail: '불합격', pending: '평가 중' };
const RESULT_STYLES = {
    pass: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    fail: 'bg-red-50 text-red-700 ring-red-200',
    pending: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export default function Show({ interview }) {
    const { auth } = usePage().props;
    const canEvaluate =
        interview.result === 'pending' &&
        (auth.roles?.includes('admin') || auth.user?.id === interview.interviewer_id);

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h1 className="text-base font-semibold text-slate-900">면접 상세</h1>
                <div className="flex items-center gap-2">
                    {canEvaluate && (
                        <Link href={route('interviews.evaluate', interview.id)} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                            평가 입력
                        </Link>
                    )}
                    <Link href={route('interviews.index')} className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        목록
                    </Link>
                </div>
            </div>
        }>
            <Head title="면접 상세" />

            <div className="p-6 lg:p-8">
                <div className="max-w-2xl rounded-xl bg-white p-6 ring-1 ring-slate-200">
                    <dl className="space-y-4">
                        {[
                            ['지원자', (
                                <Link href={route('applicants.show', interview.applicant?.id)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                                    {interview.applicant?.name}
                                </Link>
                            )],
                            ['채용공고', interview.applicant?.job_posting?.title ?? '-'],
                            ['면접관', interview.interviewer?.name],
                            ['면접 일시', new Date(interview.scheduled_at).toLocaleString('ko-KR')],
                            ['장소', interview.location ?? '-'],
                        ].map(([label, value]) => (
                            <div key={label} className="flex gap-6">
                                <dt className="w-20 shrink-0 text-xs font-medium text-slate-400 mt-0.5">{label}</dt>
                                <dd className="text-sm text-slate-900">{value}</dd>
                            </div>
                        ))}

                        <div className="flex gap-6">
                            <dt className="w-20 shrink-0 text-xs font-medium text-slate-400 mt-0.5">결과</dt>
                            <dd>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${RESULT_STYLES[interview.result]}`}>
                                    {RESULT_LABELS[interview.result]}
                                </span>
                            </dd>
                        </div>

                        {interview.evaluation && (
                            <div className="border-t border-slate-100 pt-4">
                                <dt className="text-xs font-medium text-slate-400 mb-2">평가 내용</dt>
                                <dd className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-4">
                                    {interview.evaluation}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
