import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

function ScoreBadge({ score }) {
    if (score === null || score === undefined) return <span className="text-xs text-gray-400">분석 중</span>;
    const color = score >= 80 ? 'bg-green-100 text-green-800' : score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{score}점</span>;
}

const STAGE_COLORS = {
    '서류': 'bg-blue-100 text-blue-700',
    '1차면접': 'bg-yellow-100 text-yellow-700',
    '2차면접': 'bg-orange-100 text-orange-700',
    '최종합격': 'bg-green-100 text-green-700',
    '불합격': 'bg-red-100 text-red-700',
};

export default function Index({ applicants }) {
    const { auth } = usePage().props;
    const isAdmin = auth.roles?.includes('admin');

    const destroy = (id) => {
        if (confirm('지원자를 삭제하시겠습니까?')) {
            router.delete(route('applicants.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">지원자 관리</h2>
                {isAdmin && (
                    <Link href={route('applicants.create')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        + 지원자 등록
                    </Link>
                )}
            </div>
        }>
            <Head title="지원자 관리" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['이름', '채용공고', '연락처', 'AI 점수', '현재 단계', '지원일', ''].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {applicants.data.map((applicant) => (
                                    <tr key={applicant.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <Link href={route('applicants.show', applicant.id)} className="font-medium text-gray-900 hover:text-indigo-600">
                                                {applicant.name}
                                            </Link>
                                            <div className="text-xs text-gray-400">{applicant.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {applicant.job_posting?.title ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{applicant.phone ?? '-'}</td>
                                        <td className="px-6 py-4"><ScoreBadge score={applicant.ai_score} /></td>
                                        <td className="px-6 py-4">
                                            {applicant.latest_stage && (
                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_COLORS[applicant.latest_stage.stage] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {applicant.latest_stage.stage}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(applicant.created_at).toLocaleDateString('ko-KR')}</td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <Link href={route('applicants.show', applicant.id)} className="mr-3 text-indigo-600 hover:text-indigo-800">상세</Link>
                                            {isAdmin && (
                                                <>
                                                    <Link href={route('applicants.edit', applicant.id)} className="mr-3 text-gray-600 hover:text-gray-800">수정</Link>
                                                    <button onClick={() => destroy(applicant.id)} className="text-red-600 hover:text-red-800">삭제</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {applicants.data.length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">등록된 지원자가 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>

                        {applicants.links && (
                            <div className="flex justify-center gap-1 border-t border-gray-200 px-6 py-4">
                                {applicants.links.map((link, i) => (
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
