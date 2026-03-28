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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">채용공고 관리</h2>
                <Link href={route('job-postings.create')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    + 새 공고 등록
                </Link>
            </div>
        }>
            <Head title="채용공고" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['공고 제목', '부서', '지원자', '상태', '등록일', ''].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {postings.data.map((posting) => (
                                    <tr key={posting.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <Link href={route('job-postings.show', posting.id)} className="font-medium text-gray-900 hover:text-indigo-600">
                                                {posting.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{posting.department}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{posting.applicants_count}명</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${posting.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {posting.status === 'open' ? '진행 중' : '마감'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(posting.created_at).toLocaleDateString('ko-KR')}</td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <Link href={route('job-postings.edit', posting.id)} className="mr-3 text-indigo-600 hover:text-indigo-800">수정</Link>
                                            <button onClick={() => destroy(posting.id)} className="text-red-600 hover:text-red-800">삭제</button>
                                        </td>
                                    </tr>
                                ))}
                                {postings.data.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">등록된 채용공고가 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>

                        {/* 페이지네이션 */}
                        {postings.links && (
                            <div className="flex justify-center gap-1 border-t border-gray-200 px-6 py-4">
                                {postings.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'} ${!link.url ? 'cursor-default opacity-40' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
