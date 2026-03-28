import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass = 'block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';

export default function Create({ jobPostings }) {
    const { data, setData, post, processing, errors } = useForm({
        job_posting_id: '',
        name: '',
        email: '',
        phone: '',
        resume: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicants.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout header={
            <h1 className="text-base font-semibold text-slate-900">지원자 등록</h1>
        }>
            <Head title="지원자 등록" />

            <div className="p-6 lg:p-8">
                <div className="max-w-2xl">
                    <div className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="job_posting_id" className="block text-sm font-medium text-slate-700 mb-1.5">채용공고</label>
                                <select id="job_posting_id" className={inputClass} value={data.job_posting_id} onChange={(e) => setData('job_posting_id', e.target.value)} required>
                                    <option value="">채용공고 선택</option>
                                    {jobPostings.map((posting) => (
                                        <option key={posting.id} value={posting.id}>
                                            {posting.title} ({posting.department})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.job_posting_id} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">이름</label>
                                <input id="name" className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">이메일</label>
                                <input id="email" type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">연락처 <span className="text-slate-400 font-normal">(선택)</span></label>
                                <input id="phone" className={inputClass} placeholder="010-0000-0000" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                <InputError message={errors.phone} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="resume" className="block text-sm font-medium text-slate-700 mb-1.5">이력서 (PDF)</label>
                                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                                    <input
                                        id="resume"
                                        type="file"
                                        accept=".pdf"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700 file:cursor-pointer file:transition-colors"
                                        onChange={(e) => setData('resume', e.target.files[0])}
                                        required
                                    />
                                    <p className="mt-2 text-xs text-slate-400">PDF 파일만 가능, 최대 10MB. 업로드 후 AI 분석이 자동으로 시작됩니다.</p>
                                </div>
                                <InputError message={errors.resume} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                                <Link href={route('applicants.index')} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
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
