import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const RESULT_LABELS = { pass: '합격', fail: '불합격', pending: '평가 중' };
const RESULT_STYLES = {
    pass: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    fail: 'bg-red-50 text-red-700 ring-red-200',
    pending: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export default function Index({ interviews }) {
    const { auth } = usePage().props;
    const isAdmin = auth.roles?.includes('admin');

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h1 className="text-base font-semibold text-slate-900">면접 일정</h1>
                {isAdmin && (
                    <Link href={route('interviews.create')} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        면접 등록
                    </Link>
                )}
            </div>
        }>
            <Head title="면접 일정" />

            <div className="p-6 lg:p-8">
                <div className="rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                {['지원자', '채용공고', '면접관', '일정', '장소', '결과', ''].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {interviews.data.map((interview) => (
                                <tr key={interview.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <Link href={route('applicants.show', interview.applicant?.id)} className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors">
                                            {interview.applicant?.name}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{interview.applicant?.job_posting?.title ?? '-'}</td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{interview.interviewer?.name}</td>
                                    <td className="px-5 py-4 text-sm text-slate-500">
                                        {new Date(interview.scheduled_at).toLocaleString('ko-KR')}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{interview.location ?? '-'}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${RESULT_STYLES[interview.result]}`}>
                                            {RESULT_LABELS[interview.result]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={route('interviews.show', interview.id)} className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">상세</Link>
                                            {interview.result === 'pending' && (
                                                <Link href={route('interviews.evaluate', interview.id)} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">평가 입력</Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {interviews.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-16 text-center text-sm text-slate-400">
                                        등록된 면접이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {interviews.links && interviews.links.length > 3 && (
                        <div className="flex justify-center gap-1 border-t border-slate-100 px-5 py-4">
                            {interviews.links.map((link, i) => (
                                <Link key={i} href={link.url ?? '#'} className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${link.active ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'} ${!link.url ? 'cursor-default opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
