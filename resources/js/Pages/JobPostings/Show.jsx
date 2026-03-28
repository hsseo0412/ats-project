import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const STAGE_STYLES = {
    '서류':   'bg-blue-50 text-blue-700 ring-blue-200',
    '1차면접': 'bg-amber-50 text-amber-700 ring-amber-200',
    '2차면접': 'bg-orange-50 text-orange-700 ring-orange-200',
    '최종합격': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    '불합격':  'bg-red-50 text-red-700 ring-red-200',
};

function ScoreBadge({ score }) {
    if (score === null || score === undefined) return <span className="text-xs text-slate-400">분석 중</span>;
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

export default function Show({ jobPosting }) {
    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-slate-900">{jobPosting.title}</h1>
                    <p className="text-xs text-slate-500 mt-0.5">{jobPosting.department}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${jobPosting.status === 'open' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
                        {jobPosting.status === 'open' ? '진행 중' : '마감'}
                    </span>
                    <Link href={route('job-postings.edit', jobPosting.id)} className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        수정
                    </Link>
                </div>
            </div>
        }>
            <Head title={jobPosting.title} />

            <div className="p-6 lg:p-8 space-y-5">
                {/* 공고 내용 */}
                <div className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">공고 내용</h2>
                            <p className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">{jobPosting.description}</p>
                        </div>
                        <div>
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">자격 요건</h2>
                            <p className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">{jobPosting.requirements}</p>
                        </div>
                    </div>
                </div>

                {/* 지원자 목록 */}
                <div className="rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h2 className="text-sm font-semibold text-slate-900">지원자 ({jobPosting.applicants?.length ?? 0}명)</h2>
                        <Link href={route('applicants.create')} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            지원자 등록
                        </Link>
                    </div>
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-50">
                                {['이름', '이메일', 'AI 점수', '현재 단계', ''].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {jobPosting.applicants?.map((applicant) => (
                                <tr key={applicant.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4 text-sm font-medium text-slate-900">{applicant.name}</td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{applicant.email}</td>
                                    <td className="px-5 py-4"><ScoreBadge score={applicant.ai_score} /></td>
                                    <td className="px-5 py-4">
                                        {applicant.latest_stage && (
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STAGE_STYLES[applicant.latest_stage.stage] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
                                                {applicant.latest_stage.stage}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <Link href={route('applicants.show', applicant.id)} className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">상세보기</Link>
                                    </td>
                                </tr>
                            ))}
                            {(!jobPosting.applicants || jobPosting.applicants.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">지원자가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
