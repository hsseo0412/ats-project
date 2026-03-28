import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">지원자 등록</h2>}>
            <Head title="지원자 등록" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="job_posting_id" value="채용공고" />
                                <select
                                    id="job_posting_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.job_posting_id}
                                    onChange={(e) => setData('job_posting_id', e.target.value)}
                                    required
                                >
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
                                <InputLabel htmlFor="name" value="이름" />
                                <TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="이메일" />
                                <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="연락처 (선택)" />
                                <TextInput id="phone" className="mt-1 block w-full" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                <InputError message={errors.phone} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="resume" value="이력서 (PDF)" />
                                <input
                                    id="resume"
                                    type="file"
                                    accept=".pdf"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setData('resume', e.target.files[0])}
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-400">PDF 파일만 가능, 최대 10MB. 업로드 후 AI 분석이 자동으로 시작됩니다.</p>
                                <InputError message={errors.resume} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <Link href={route('applicants.index')} className="text-sm text-gray-600 hover:text-gray-800">취소</Link>
                                <PrimaryButton disabled={processing}>등록하기</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
