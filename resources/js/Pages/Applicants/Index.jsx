import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const STAGE_STYLES = {
    '서류':   'bg-blue-50 text-blue-700 ring-blue-200',
    '1차면접': 'bg-amber-50 text-amber-700 ring-amber-200',
    '2차면접': 'bg-orange-50 text-orange-700 ring-orange-200',
    '최종합격': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    '불합격':  'bg-red-50 text-red-700 ring-red-200',
};

function ScoreBadge({ score }) {
    if (score === null || score === undefined) {
        return <span className="text-xs text-slate-400">분석 중</span>;
    }
    const style = score >= 80
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
        : score >= 60
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : 'bg-red-50 text-red-700 ring-red-200';
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${style}`}>
            {score}점
        </span>
    );
}

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
                <h1 className="text-base font-semibold text-slate-900">지원자 관리</h1>
                {isAdmin && (
                    <Link href={route('applicants.create')} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        지원자 등록
                    </Link>
                )}
            </div>
        }>
            <Head title="지원자 관리" />

            <div className="p-6 lg:p-8">
                <div className="rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                {['이름', '채용공고', '연락처', 'AI 점수', '현재 단계', '지원일', ''].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {applicants.data.map((applicant) => (
                                <tr key={applicant.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <Link href={route('applicants.show', applicant.id)} className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors">
                                            {applicant.name}
                                        </Link>
                                        <div className="text-xs text-slate-400 mt-0.5">{applicant.email}</div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{applicant.job_posting?.title ?? '-'}</td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{applicant.phone ?? '-'}</td>
                                    <td className="px-5 py-4"><ScoreBadge score={applicant.ai_score} /></td>
                                    <td className="px-5 py-4">
                                        {applicant.latest_stage && (
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STAGE_STYLES[applicant.latest_stage.stage] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
                                                {applicant.latest_stage.stage}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-500">
                                        {new Date(applicant.created_at).toLocaleDateString('ko-KR')}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={route('applicants.show', applicant.id)} className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">상세</Link>
                                            {isAdmin && (
                                                <>
                                                    <Link href={route('applicants.edit', applicant.id)} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">수정</Link>
                                                    <button onClick={() => destroy(applicant.id)} className="text-sm text-red-500 hover:text-red-700 transition-colors">삭제</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {applicants.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-16 text-center text-sm text-slate-400">
                                        등록된 지원자가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {applicants.links && applicants.links.length > 3 && (
                        <div className="flex justify-center gap-1 border-t border-slate-100 px-5 py-4">
                            {applicants.links.map((link, i) => (
                                <Link key={i} href={link.url ?? '#'} className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${link.active ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'} ${!link.url ? 'cursor-default opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
