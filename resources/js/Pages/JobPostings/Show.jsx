import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function ScoreBadge({ score }) {
    if (score === null || score === undefined) return <span className="text-gray-400 text-xs">분석 중</span>;
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

export default function Show({ jobPosting }) {
    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">{jobPosting.title}</h2>
                <Link href={route('job-postings.edit', jobPosting.id)} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">수정</Link>
            </div>
        }>
            <Head title={jobPosting.title} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* 공고 정보 */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="text-sm text-gray-500">{jobPosting.department}</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${jobPosting.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {jobPosting.status === 'open' ? '진행 중' : '마감'}
                            </span>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-2 text-sm font-semibold text-gray-700">공고 내용</h3>
                                <p className="whitespace-pre-wrap text-sm text-gray-600">{jobPosting.description}</p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-sm font-semibold text-gray-700">자격 요건</h3>
                                <p className="whitespace-pre-wrap text-sm text-gray-600">{jobPosting.requirements}</p>
                            </div>
                        </div>
                    </div>

                    {/* 지원자 목록 */}
                    <div className="rounded-lg bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">지원자 목록 ({jobPosting.applicants?.length ?? 0}명)</h3>
                            <Link href={route('applicants.create')} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700">+ 지원자 등록</Link>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['이름', '이메일', 'AI 점수', '현재 단계', ''].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {jobPosting.applicants?.map((applicant) => (
                                    <tr key={applicant.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{applicant.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{applicant.email}</td>
                                        <td className="px-6 py-4"><ScoreBadge score={applicant.ai_score} /></td>
                                        <td className="px-6 py-4">
                                            {applicant.latest_stage && (
                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_COLORS[applicant.latest_stage.stage] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {applicant.latest_stage.stage}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={route('applicants.show', applicant.id)} className="text-sm text-indigo-600 hover:text-indigo-800">상세보기</Link>
                                        </td>
                                    </tr>
                                ))}
                                {(!jobPosting.applicants || jobPosting.applicants.length === 0) && (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">지원자가 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
