import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">채용공고 등록</h2>}>
            <Head title="채용공고 등록" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="title" value="공고 제목" />
                                <TextInput id="title" className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="department" value="부서" />
                                <TextInput id="department" className="mt-1 block w-full" value={data.department} onChange={(e) => setData('department', e.target.value)} required />
                                <InputError message={errors.department} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="공고 내용" />
                                <textarea
                                    id="description"
                                    rows={5}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="requirements" value="자격 요건" />
                                <textarea
                                    id="requirements"
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.requirements}
                                    onChange={(e) => setData('requirements', e.target.value)}
                                    required
                                />
                                <InputError message={errors.requirements} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="상태" />
                                <select
                                    id="status"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <option value="open">진행 중</option>
                                    <option value="closed">마감</option>
                                </select>
                                <InputError message={errors.status} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <Link href={route('job-postings.index')} className="text-sm text-gray-600 hover:text-gray-800">취소</Link>
                                <PrimaryButton disabled={processing}>등록하기</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
