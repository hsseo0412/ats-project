<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // 캐시 초기화
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 권한 정의 — 프로젝트에 맞게 추가/수정
        $permissions = [
            // 사용자 관리
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            // 설정
            'settings.view',
            'settings.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 역할 정의
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole  = Role::firstOrCreate(['name' => 'user']);

        // admin은 모든 권한
        $adminRole->syncPermissions(Permission::all());

        // user는 기본 권한만
        $userRole->syncPermissions([]);

        // 기본 관리자 계정 생성
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => '관리자',
                'password' => Hash::make('password123!'),
            ]
        );
        $admin->assignRole('admin');

        // 테스트 일반 사용자
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name'     => '테스트 사용자',
                'password' => Hash::make('password123!'),
            ]
        );
        $user->assignRole('user');

        $this->command->info('역할과 권한이 설정되었습니다.');
    }
}
