import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass = 'block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        department: '',
        description: '',
        requirements: '',
        status: 'open',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('job-postings.store'));
    };

    return (
        <AuthenticatedLayout header={
            <h1 className="text-base font-semibold text-slate-900">채용공고 등록</h1>
        }>
            <Head title="채용공고 등록" />

            <div className="p-6 lg:p-8">
                <div className="max-w-2xl">
                    <div className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">공고 제목</label>
                                <input id="title" className={inputClass} value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1.5">부서</label>
                                <input id="department" className={inputClass} value={data.department} onChange={(e) => setData('department', e.target.value)} required />
                                <InputError message={errors.department} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">공고 내용</label>
                                <textarea
                                    id="description"
                                    rows={5}
                                    className={inputClass}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="requirements" className="block text-sm font-medium text-slate-700 mb-1.5">자격 요건</label>
                                <textarea
                                    id="requirements"
                                    rows={4}
                                    className={inputClass}
                                    value={data.requirements}
                                    onChange={(e) => setData('requirements', e.target.value)}
                                    required
                                />
                                <InputError message={errors.requirements} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1.5">상태</label>
                                <select id="status" className={inputClass} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                    <option value="open">진행 중</option>
                                    <option value="closed">마감</option>
                                </select>
                                <InputError message={errors.status} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                                <Link href={route('job-postings.index')} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                    취소
                                </Link>
                                <button type="submit" disabled={processing} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors">
                                    {processing ? '등록 중...' : '등록하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
