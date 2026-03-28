import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Evaluate({ interview }) {
    const { data, setData, patch, processing, errors } = useForm({
        evaluation: interview.evaluation ?? '',
        result: interview.result ?? 'pending',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('interviews.update-evaluation', interview.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">면접 평가 입력</h2>}>
            <Head title="면접 평가 입력" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    {/* 면접 정보 요약 */}
                    <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                        <strong>{interview.applicant?.name}</strong> ({interview.applicant?.job_posting?.title}) ·&nbsp;
                        {new Date(interview.scheduled_at).toLocaleString('ko-KR')} · {interview.location ?? '-'}
                    </div>

                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="evaluation" value="평가 내용" />
                                <textarea
                                    id="evaluation"
                                    rows={8}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="지원자의 기술 역량, 커뮤니케이션, 문제 해결 능력 등을 자유롭게 작성해주세요."
                                    value={data.evaluation}
                                    onChange={(e) => setData('evaluation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.evaluation} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel value="최종 결과" />
                                <div className="mt-2 flex gap-4">
                                    {[
                                        { value: 'pass', label: '합격', color: 'border-green-500 bg-green-50 text-green-700' },
                                        { value: 'fail', label: '불합격', color: 'border-red-500 bg-red-50 text-red-700' },
                                        { value: 'pending', label: '보류', color: 'border-gray-400 bg-gray-50 text-gray-700' },
                                    ].map((option) => (
                                        <label key={option.value} className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${data.result === option.value ? option.color : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="result"
                                                value={option.value}
                                                checked={data.result === option.value}
                                                onChange={() => setData('result', option.value)}
                                                className="sr-only"
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.result} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <Link href={route('interviews.show', interview.id)} className="text-sm text-gray-600 hover:text-gray-800">취소</Link>
                                <PrimaryButton disabled={processing}>평가 저장</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
