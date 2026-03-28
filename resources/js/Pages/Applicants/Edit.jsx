import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ applicant }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone ?? '',
        resume: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicants.update', applicant.id), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">지원자 정보 수정</h2>}>
            <Head title="지원자 수정" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <form onSubmit={submit} className="space-y-6">
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
                                <InputLabel htmlFor="phone" value="연락처" />
                                <TextInput id="phone" className="mt-1 block w-full" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                <InputError message={errors.phone} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="resume" value="이력서 교체 (PDF, 선택)" />
                                {applicant.resume_path && (
                                    <p className="mb-2 text-xs text-gray-500">현재 이력서가 있습니다. 새 파일을 선택하면 교체되고 AI 재분석이 시작됩니다.</p>
                                )}
                                <input
                                    id="resume"
                                    type="file"
                                    accept=".pdf"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setData('resume', e.target.files[0])}
                                />
                                <InputError message={errors.resume} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <Link href={route('applicants.show', applicant.id)} className="text-sm text-gray-600 hover:text-gray-800">취소</Link>
                                <PrimaryButton disabled={processing}>저장하기</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
