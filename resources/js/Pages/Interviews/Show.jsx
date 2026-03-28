import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const RESULT_LABELS = { pass: '합격', fail: '불합격', pending: '평가 중' };
const RESULT_COLORS = { pass: 'text-green-600', fail: 'text-red-600', pending: 'text-gray-500' };

export default function Show({ interview }) {
    const { auth } = usePage().props;
    const canEvaluate =
        interview.result === 'pending' &&
        (auth.roles?.includes('admin') || auth.user?.id === interview.interviewer_id);

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">면접 상세</h2>
                <div className="flex gap-2">
                    {canEvaluate && (
                        <Link href={route('interviews.evaluate', interview.id)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700">
                            평가 입력
                        </Link>
                    )}
                    <Link href={route('interviews.index')} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">목록</Link>
                </div>
            </div>
        }>
            <Head title="면접 상세" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <dl className="space-y-4">
                            {[
                                ['지원자', <Link href={route('applicants.show', interview.applicant?.id)} className="text-indigo-600 hover:text-indigo-800">{interview.applicant?.name}</Link>],
                                ['채용공고', interview.applicant?.job_posting?.title ?? '-'],
                                ['면접관', interview.interviewer?.name],
                                ['면접 일시', new Date(interview.scheduled_at).toLocaleString('ko-KR')],
                                ['장소', interview.location ?? '-'],
                            ].map(([label, value]) => (
                                <div key={label} className="flex gap-4">
                                    <dt className="w-24 shrink-0 text-sm text-gray-500">{label}</dt>
                                    <dd className="text-sm font-medium text-gray-900">{value}</dd>
                                </div>
                            ))}

                            <div className="flex gap-4">
                                <dt className="w-24 shrink-0 text-sm text-gray-500">결과</dt>
                                <dd className={`text-sm font-semibold ${RESULT_COLORS[interview.result]}`}>{RESULT_LABELS[interview.result]}</dd>
                            </div>

                            {interview.evaluation && (
                                <div className="border-t border-gray-100 pt-4">
                                    <dt className="mb-2 text-sm text-gray-500">평가 내용</dt>
                                    <dd className="whitespace-pre-wrap text-sm text-gray-700">{interview.evaluation}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
