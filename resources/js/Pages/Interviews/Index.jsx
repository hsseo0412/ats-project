import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const RESULT_LABELS = { pass: '합격', fail: '불합격', pending: '평가 중' };
const RESULT_COLORS = { pass: 'bg-green-100 text-green-700', fail: 'bg-red-100 text-red-700', pending: 'bg-gray-100 text-gray-600' };

export default function Index({ interviews }) {
    const { auth } = usePage().props;
    const isAdmin = auth.roles?.includes('admin');

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">면접 일정</h2>
                {isAdmin && (
                    <Link href={route('interviews.create')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        + 면접 등록
                    </Link>
                )}
            </div>
        }>
            <Head title="면접 일정" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['지원자', '채용공고', '면접관', '일정', '장소', '결과', ''].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {interviews.data.map((interview) => (
                                    <tr key={interview.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <Link href={route('applicants.show', interview.applicant?.id)} className="font-medium text-gray-900 hover:text-indigo-600">
                                                {interview.applicant?.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{interview.applicant?.job_posting?.title ?? '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{interview.interviewer?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(interview.scheduled_at).toLocaleString('ko-KR')}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{interview.location ?? '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${RESULT_COLORS[interview.result]}`}>
                                                {RESULT_LABELS[interview.result]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <Link href={route('interviews.show', interview.id)} className="mr-3 text-indigo-600 hover:text-indigo-800">상세</Link>
                                            {interview.result === 'pending' && (
                                                <Link href={route('interviews.evaluate', interview.id)} className="text-gray-600 hover:text-gray-800">평가 입력</Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {interviews.data.length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">등록된 면접이 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>

                        {interviews.links && (
                            <div className="flex justify-center gap-1 border-t border-gray-200 px-6 py-4">
                                {interviews.links.map((link, i) => (
                                    <Link key={i} href={link.url ?? '#'} className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'} ${!link.url ? 'cursor-default opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
