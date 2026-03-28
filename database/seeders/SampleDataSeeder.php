<?php

namespace Database\Seeders;

use App\Models\Applicant;
use App\Models\ApplicationStage;
use App\Models\Interview;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Database\Seeder;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin       = User::where('email', 'admin@example.com')->first();
        $interviewer1 = User::where('email', 'interviewer1@example.com')->first();
        $interviewer2 = User::where('email', 'interviewer2@example.com')->first();

        // 채용공고 3개
        $postings = [
            JobPosting::firstOrCreate(
                ['title' => '백엔드 개발자'],
                [
                    'user_id'      => $admin->id,
                    'department'   => '개발팀',
                    'description'  => 'Laravel 기반 백엔드 API 개발 및 유지보수를 담당합니다.',
                    'requirements' => 'PHP/Laravel 3년 이상, MySQL, Redis 경험 필수',
                    'status'       => 'open',
                ]
            ),
            JobPosting::firstOrCreate(
                ['title' => '프론트엔드 개발자'],
                [
                    'user_id'      => $admin->id,
                    'department'   => '개발팀',
                    'description'  => 'React 기반 프론트엔드 개발을 담당합니다.',
                    'requirements' => 'React/TypeScript 2년 이상, Inertia.js 경험 우대',
                    'status'       => 'open',
                ]
            ),
            JobPosting::firstOrCreate(
                ['title' => 'HR 매니저'],
                [
                    'user_id'      => $admin->id,
                    'department'   => '인사팀',
                    'description'  => '채용 기획 및 임직원 HR 업무 전반을 담당합니다.',
                    'requirements' => 'HR 실무 경력 3년 이상, ATS 툴 사용 경험 우대',
                    'status'       => 'closed',
                ]
            ),
        ];

        // 지원자 샘플 데이터
        $applicantData = [
            // 백엔드 개발자 지원자
            [
                'job_posting_id' => $postings[0]->id,
                'name'           => '박지훈',
                'email'          => 'jihoon.park@gmail.com',
                'phone'          => '010-1234-5678',
                'ai_score'       => 88,
                'ai_summary'     => 'Laravel 5년 경력, AWS 배포 경험 보유. 대규모 트래픽 처리 프로젝트 경험이 있으며 코드 품질에 대한 높은 이해도를 보임.',
                'ai_analyzed_at' => now()->subDays(3),
                'stage'          => '1차면접',
            ],
            [
                'job_posting_id' => $postings[0]->id,
                'name'           => '이수민',
                'email'          => 'sumin.lee@naver.com',
                'phone'          => '010-2345-6789',
                'ai_score'       => 72,
                'ai_summary'     => 'PHP 3년 경력, Laravel 기본기 양호. Redis/Queue 경험 부족하나 학습 의지 높음.',
                'ai_analyzed_at' => now()->subDays(2),
                'stage'          => '서류',
            ],
            [
                'job_posting_id' => $postings[0]->id,
                'name'           => '최동현',
                'email'          => 'donghyun.choi@kakao.com',
                'phone'          => '010-3456-7890',
                'ai_score'       => 55,
                'ai_summary'     => '경력 1년의 주니어 개발자. 기본 PHP 가능하나 요구 스펙 대비 경험 부족.',
                'ai_analyzed_at' => now()->subDays(1),
                'stage'          => '불합격',
            ],
            // 프론트엔드 개발자 지원자
            [
                'job_posting_id' => $postings[1]->id,
                'name'           => '김나영',
                'email'          => 'nayoung.kim@gmail.com',
                'phone'          => '010-4567-8901',
                'ai_score'       => 91,
                'ai_summary'     => 'React/TypeScript 4년 경력, 디자인 시스템 구축 경험 우수. 협업 능력과 문서화 습관이 뛰어남.',
                'ai_analyzed_at' => now()->subDays(4),
                'stage'          => '2차면접',
            ],
            [
                'job_posting_id' => $postings[1]->id,
                'name'           => '정민준',
                'email'          => 'minjun.jung@naver.com',
                'phone'          => '010-5678-9012',
                'ai_score'       => 78,
                'ai_summary'     => 'React 2년, Vue 1년 경력. TypeScript 사용 경험 있으나 깊이 있는 활용은 부족.',
                'ai_analyzed_at' => now()->subDays(2),
                'stage'          => '1차면접',
            ],
            // HR 매니저 지원자
            [
                'job_posting_id' => $postings[2]->id,
                'name'           => '한소희',
                'email'          => 'sohee.han@gmail.com',
                'phone'          => '010-6789-0123',
                'ai_score'       => 85,
                'ai_summary'     => 'HR 경력 5년, 대기업 채용 프로세스 운영 경험. ATS 툴(그린하우스) 사용 경험 보유.',
                'ai_analyzed_at' => now()->subDays(10),
                'stage'          => '최종합격',
            ],
        ];

        foreach ($applicantData as $data) {
            $stage = $data['stage'];
            unset($data['stage']);

            $applicant = Applicant::firstOrCreate(
                ['email' => $data['email']],
                $data
            );

            // 단계 이력 생성 (서류부터 현재 단계까지)
            $stageFlow = ['서류', '1차면접', '2차면접', '최종합격'];
            $currentIdx = array_search($stage, $stageFlow);

            if ($stage === '불합격') {
                ApplicationStage::firstOrCreate(
                    ['applicant_id' => $applicant->id, 'stage' => '서류'],
                    ['changed_by' => $admin->id, 'note' => '서류 접수']
                );
                ApplicationStage::firstOrCreate(
                    ['applicant_id' => $applicant->id, 'stage' => '불합격'],
                    ['changed_by' => $admin->id, 'note' => '서류 검토 후 미통과']
                );
            } else {
                for ($i = 0; $i <= $currentIdx; $i++) {
                    ApplicationStage::firstOrCreate(
                        ['applicant_id' => $applicant->id, 'stage' => $stageFlow[$i]],
                        ['changed_by' => $admin->id, 'note' => $i === 0 ? '서류 접수' : $stageFlow[$i] . ' 단계 진행']
                    );
                }
            }
        }

        // 면접 일정 생성
        $applicantPark  = Applicant::where('email', 'jihoon.park@gmail.com')->first();
        $applicantKim   = Applicant::where('email', 'nayoung.kim@gmail.com')->first();
        $applicantJung  = Applicant::where('email', 'minjun.jung@naver.com')->first();

        Interview::firstOrCreate(
            ['applicant_id' => $applicantPark->id, 'interviewer_id' => $interviewer1->id],
            [
                'scheduled_at' => now()->addDays(2)->setTime(10, 0),
                'location'     => '본사 3층 회의실 A',
                'result'       => 'pending',
            ]
        );

        Interview::firstOrCreate(
            ['applicant_id' => $applicantKim->id, 'interviewer_id' => $interviewer1->id],
            [
                'scheduled_at' => now()->addDays(1)->setTime(14, 0),
                'location'     => '본사 3층 회의실 B',
                'evaluation'   => '기술 역량 우수. 팀 협업 능력 검증 필요.',
                'result'       => 'pass',
            ]
        );

        Interview::firstOrCreate(
            ['applicant_id' => $applicantKim->id, 'interviewer_id' => $interviewer2->id],
            [
                'scheduled_at' => now()->addDays(3)->setTime(15, 0),
                'location'     => '본사 5층 임원실',
                'result'       => 'pending',
            ]
        );

        Interview::firstOrCreate(
            ['applicant_id' => $applicantJung->id, 'interviewer_id' => $interviewer2->id],
            [
                'scheduled_at' => now()->addDays(4)->setTime(11, 0),
                'location'     => '본사 3층 회의실 A',
                'result'       => 'pending',
            ]
        );

        $this->command->info('샘플 데이터가 생성되었습니다.');
    }
}
