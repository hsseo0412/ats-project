# Laravel 11 Boilerplate

Laravel 11 + Inertia.js + React + Docker 범용 보일러플레이트

## 기술 스택

| 분류 | 기술 |
|------|------|
| Backend | Laravel 11, PHP 8.4-FPM |
| Frontend | React, Inertia.js, Vite |
| 인증 | Laravel Breeze + Sanctum |
| 권한 | Spatie Laravel Permission |
| 캐시/큐 | Redis |
| DB | MySQL 8.0 |
| 웹서버 | Nginx |
| 디버깅 | Laravel Telescope |
| 큐 모니터링 | Laravel Horizon |
| API 문서 | L5-Swagger |
| 테스트 | Pest |

## 빠른 시작

### 1. 저장소 클론 후 최초 설치

```bash
git clone <repo-url>
cd laravel-boilerplate

# .env 복사
cp .env.example .env

# Docker 빌드 + 실행
make build
make up

# 최초 설치 (composer install + migrate + seed)
make setup
```

### 2. Breeze (Inertia + React) 설치

```bash
make artisan CMD='breeze:install react --inertia'
make dev
```

### 접속 URL

| 서비스 | URL |
|--------|-----|
| 앱 | http://localhost:8000 |
| phpMyAdmin | http://localhost:8080 |
| Telescope | http://localhost:8000/telescope |
| Horizon | http://localhost:8000/horizon |
| Swagger | http://localhost:8000/api/documentation |

## 자주 쓰는 명령어

```bash
make up                              # 컨테이너 시작
make down                            # 컨테이너 종료
make shell                           # PHP 컨테이너 접속
make dev                             # Hot Reload 개발 서버

make artisan CMD='make:model Post -mcr'   # Artisan
make migrate                         # 마이그레이션
make fresh                           # DB 초기화 + 재마이그레이션
make test                            # 테스트 실행
make pint                            # 코드 스타일 정리
make clear                           # 캐시 클리어
```

## 디렉토리 구조

```
laravel-boilerplate/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/               # API 컨트롤러
│   │   ├── Middleware/
│   │   │   └── ApiLogger.php      # API 자동 로깅
│   │   └── Requests/
│   │       └── Auth/              # Form Request
│   ├── Models/
│   │   ├── User.php
│   │   └── AuditLog.php           # 변경이력 모델
│   ├── Repositories/
│   │   └── BaseRepository.php     # Repository 기본 클래스
│   ├── Services/
│   │   └── BaseService.php        # Service 기본 클래스
│   └── Traits/
│       ├── ApiResponse.php        # JSON 응답 헬퍼
│       └── Auditable.php          # 모델 변경이력 자동 기록
├── bootstrap/
│   └── app.php                    # 미들웨어 등록 (Laravel 11 방식)
├── config/
│   └── logging.php                # 레벨별 로그 채널 설정
├── docker/
│   ├── nginx/default.conf
│   ├── php/
│   │   ├── Dockerfile             # PHP 8.4-FPM
│   │   └── php.ini
│   └── mysql/my.cnf
├── routes/
│   ├── api.php                    # API 라우트
│   └── web.php                    # Inertia 라우트
├── .env.example
├── composer.json
├── docker-compose.yml
└── Makefile
```

## 로그 구조

```
storage/logs/
├── laravel-YYYY-MM-DD.log         # 전체 (90일)
├── error/
│   └── error-YYYY-MM-DD.log      # ERROR 이상 (180일)
├── info/
│   └── info-YYYY-MM-DD.log       # INFO ~ WARNING (30일)
└── api/
    └── api-YYYY-MM-DD.log        # API 요청/응답 자동 기록 (30일)
```

### 로그 사용법

```php
// 기본 (stack → 전체 + 레벨별 동시 기록)
Log::info('주문 생성', ['order_id' => $id]);
Log::error('결제 실패', ['reason' => $msg]);

// 특정 채널 직접 지정
Log::channel('api')->info('외부 API 호출', ['url' => $url]);
```

### ApiLogger 자동 기록 항목
- 모든 `/api/*` 요청의 method, url, user_id, body
- 응답 status_code, 처리시간(ms)
- `password`, `Authorization` 등 민감 정보 자동 제외
- 2초 이상 응답 → `warning` 자동 기록
- 4xx/5xx → 응답 바디 포함 기록

## 포함된 기본 클래스

### ApiResponse Trait

```php
class PostController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->paginated(Post::paginate(15));
    }

    public function store(): JsonResponse
    {
        return $this->created($post, '게시글이 생성되었습니다.');
    }
}
```

### BaseRepository / BaseService

```php
// Repository 생성
class PostRepository extends BaseRepository
{
    public function __construct(Post $model)
    {
        parent::__construct($model);
    }
}

// Service 생성
class PostService extends BaseService
{
    public function __construct(private PostRepository $repo) {}

    public function getList(): LengthAwarePaginator
    {
        return $this->repo->paginate(15);
    }
}
```

### Auditable Trait (변경이력 자동 기록)

```php
class Post extends Model
{
    use Auditable;

    // 로그에서 제외할 필드
    protected array $auditExclude = ['views'];
}
```

## 권한 관리 (Spatie)

```php
// 기본 역할/권한은 RolesAndPermissionsSeeder에 정의
// admin@example.com / password123!
// user@example.com  / password123!

$user->assignRole('admin');
$user->hasRole('admin');
$user->can('users.edit');
```

## API 인증 (Sanctum)

```php
// 토큰 발급
$token = $user->createToken('api-token')->plainTextToken;

// 요청 시 헤더에 포함
// Authorization: Bearer {token}
```

## Swagger 문서

```php
/**
 * @OA\Get(
 *     path="/api/posts",
 *     summary="게시글 목록",
 *     tags={"Posts"},
 *     security={{"sanctum":{}}},
 *     @OA\Response(response=200, description="성공")
 * )
 */
```

문서 생성: `make artisan CMD='l5-swagger:generate'`
