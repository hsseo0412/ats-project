import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ postings }) {
    const destroy = (id) => {
        if (confirm('채용공고를 삭제하시겠습니까?')) {
            router.delete(route('job-postings.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h1 className="text-base font-semibold text-slate-900">채용공고 관리</h1>
                <Link href={route('job-postings.create')} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    새 공고 등록
                </Link>
            </div>
        }>
            <Head title="채용공고" />

            <div className="p-6 lg:p-8">
                <div className="rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                {['공고 제목', '부서', '지원자', '상태', '등록일', ''].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {postings.data.map((posting) => (
                                <tr key={posting.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <Link href={route('job-postings.show', posting.id)} className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors">
                                            {posting.title}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{posting.department}</td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{posting.applicants_count}명</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                                            posting.status === 'open'
                                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                                : 'bg-slate-100 text-slate-600 ring-slate-200'
                                        }`}>
                                            {posting.status === 'open' ? '진행 중' : '마감'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-500">
                                        {new Date(posting.created_at).toLocaleDateString('ko-KR')}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={route('job-postings.edit', posting.id)} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">수정</Link>
                                            <button onClick={() => destroy(posting.id)} className="text-sm text-red-500 hover:text-red-700 transition-colors">삭제</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {postings.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-16 text-center text-sm text-slate-400">
                                        등록된 채용공고가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {postings.links && postings.links.length > 3 && (
                        <div className="flex justify-center gap-1 border-t border-slate-100 px-5 py-4">
                            {postings.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                        link.active ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                                    } ${!link.url ? 'cursor-default opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
