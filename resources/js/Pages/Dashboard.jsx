import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function ScoreBadge({ score }) {
    if (score === null || score === undefined) return <span className="text-slate-400 text-sm">-</span>;
    const style = score >= 80
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
        : score >= 60
        ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
        : 'bg-red-50 text-red-700 ring-1 ring-red-200';
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
            {score}점
        </span>
    );
}

const statCards = (stats) => [
    {
        label: '전체 채용공고',
        value: stats.total_postings,
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        color: 'text-blue-600 bg-blue-50',
    },
    {
        label: '진행 중 공고',
        value: stats.open_postings,
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        label: '전체 지원자',
        value: stats.total_applicants,
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: 'text-violet-600 bg-violet-50',
    },
    {
        label: 'AI 분석 완료',
        value: stats.analyzed_applicants,
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            </svg>
        ),
        color: 'text-orange-600 bg-orange-50',
    },
];

export default function Dashboard({ stats, postingsWithCounts, topApplicants }) {
    return (
        <AuthenticatedLayout header="대시보드">
            <Head title="대시보드" />

            <div className="p-6 lg:p-8 space-y-6">
                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {statCards(stats).map((card) => (
                        <div key={card.label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500">{card.label}</p>
                                <span className={`rounded-lg p-2 ${card.color}`}>{card.icon}</span>
                            </div>
                            <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* 채용공고별 지원 현황 */}
                    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h3 className="text-sm font-semibold text-slate-900">채용공고별 지원 현황</h3>
                            <Link href={route('job-postings.index')} className="text-xs text-indigo-600 hover:text-indigo-700">
                                전체 보기
                            </Link>
                        </div>
                        <ul className="divide-y divide-slate-50">
                            {postingsWithCounts.map((posting) => (
                                <li key={posting.id} className="flex items-center justify-between px-6 py-3.5">
                                    <div>
                                        <Link
                                            href={route('job-postings.show', posting.id)}
                                            className="text-sm font-medium text-slate-800 hover:text-indigo-600"
                                        >
                                            {posting.title}
                                        </Link>
                                        <p className="text-xs text-slate-400 mt-0.5">{posting.department}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-slate-700">{posting.applicants_count}명</span>
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            posting.status === 'open'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {posting.status === 'open' ? '진행 중' : '마감'}
                                        </span>
                                    </div>
                                </li>
                            ))}
                            {postingsWithCounts.length === 0 && (
                                <li className="px-6 py-10 text-center text-sm text-slate-400">채용공고가 없습니다.</li>
                            )}
                        </ul>
                    </div>

                    {/* AI 점수 상위 지원자 */}
                    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h3 className="text-sm font-semibold text-slate-900">AI 점수 상위 지원자</h3>
                            <Link href={route('applicants.index')} className="text-xs text-indigo-600 hover:text-indigo-700">
                                전체 보기
                            </Link>
                        </div>
                        <ul className="divide-y divide-slate-50">
                            {topApplicants.map((applicant, idx) => (
                                <li key={applicant.id} className="flex items-center gap-4 px-6 py-3.5">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={route('applicants.show', applicant.id)}
                                            className="text-sm font-medium text-slate-800 hover:text-indigo-600 truncate block"
                                        >
                                            {applicant.name}
                                        </Link>
                                        <p className="text-xs text-slate-400 truncate mt-0.5">{applicant.job_posting?.title}</p>
                                    </div>
                                    <ScoreBadge score={applicant.ai_score} />
                                </li>
                            ))}
                            {topApplicants.length === 0 && (
                                <li className="px-6 py-10 text-center text-sm text-slate-400">AI 분석 완료된 지원자가 없습니다.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
