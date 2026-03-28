<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // 채용공고
            'job-postings.view',
            'job-postings.create',
            'job-postings.edit',
            'job-postings.delete',

            // 지원자
            'applicants.view',
            'applicants.create',
            'applicants.edit',
            'applicants.delete',

            // 단계 관리
            'stages.view',
            'stages.manage',

            // 면접
            'interviews.view',
            'interviews.create',
            'interviews.edit',
            'interviews.evaluate',

            // 사용자 관리
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $adminRole      = Role::firstOrCreate(['name' => 'admin']);
        $interviewerRole = Role::firstOrCreate(['name' => 'interviewer']);

        // admin: 모든 권한
        $adminRole->syncPermissions(Permission::all());

        // interviewer: 조회 + 면접 평가 입력만
        $interviewerRole->syncPermissions([
            'job-postings.view',
            'applicants.view',
            'stages.view',
            'interviews.view',
            'interviews.evaluate',
        ]);

        // admin 계정
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => 'HR 관리자',
                'password' => Hash::make('password123!'),
            ]
        );
        $admin->syncRoles(['admin']);

        // interviewer 계정 1
        $interviewer1 = User::firstOrCreate(
            ['email' => 'interviewer1@example.com'],
            [
                'name'     => '김면접',
                'password' => Hash::make('password123!'),
            ]
        );
        $interviewer1->syncRoles(['interviewer']);

        // interviewer 계정 2
        $interviewer2 = User::firstOrCreate(
            ['email' => 'interviewer2@example.com'],
            [
                'name'     => '이평가',
                'password' => Hash::make('password123!'),
            ]
        );
        $interviewer2->syncRoles(['interviewer']);

        $this->command->info('역할과 권한이 설정되었습니다.');
    }
}
