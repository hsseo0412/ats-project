import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ applicants, interviewers }) {
    const { data, setData, post, processing, errors } = useForm({
        applicant_id: '',
        interviewer_id: '',
        scheduled_at: '',
        location: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('interviews.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">면접 일정 등록</h2>}>
            <Head title="면접 일정 등록" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="applicant_id" value="지원자" />
                                <select
                                    id="applicant_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.applicant_id}
                                    onChange={(e) => setData('applicant_id', e.target.value)}
                                    required
                                >
                                    <option value="">지원자 선택</option>
                                    {applicants.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} ({a.job_posting?.title})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.applicant_id} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="interviewer_id" value="면접관" />
                                <select
                                    id="interviewer_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.interviewer_id}
                                    onChange={(e) => setData('interviewer_id', e.target.value)}
                                    required
                                >
                                    <option value="">면접관 선택</option>
                                    {interviewers.map((i) => (
                                        <option key={i.id} value={i.id}>{i.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.interviewer_id} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="scheduled_at" value="면접 일시" />
                                <input
                                    id="scheduled_at"
                                    type="datetime-local"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.scheduled_at}
                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                    required
                                />
                                <InputError message={errors.scheduled_at} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="location" value="장소 (선택)" />
                                <input
                                    id="location"
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="예: 본사 3층 회의실 A"
                                />
                                <InputError message={errors.location} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <Link href={route('interviews.index')} className="text-sm text-gray-600 hover:text-gray-800">취소</Link>
                                <PrimaryButton disabled={processing}>등록하기</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
