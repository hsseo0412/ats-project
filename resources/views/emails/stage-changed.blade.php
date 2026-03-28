<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>전형 단계 안내</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .header { background-color: #4f46e5; padding: 32px 40px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; }
        .body { padding: 40px; }
        .greeting { font-size: 16px; color: #111827; margin-bottom: 24px; }
        .stage-box { background-color: #f5f3ff; border-left: 4px solid #4f46e5; border-radius: 4px; padding: 16px 20px; margin: 24px 0; }
        .stage-box .label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
        .stage-box .value { font-size: 20px; font-weight: 700; color: #4f46e5; }
        .stage-box.pass { background-color: #f0fdf4; border-left-color: #16a34a; }
        .stage-box.pass .value { color: #16a34a; }
        .stage-box.fail { background-color: #fef2f2; border-left-color: #dc2626; }
        .stage-box.fail .value { color: #dc2626; }
        .info-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .info-table td { padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        .info-table td:first-child { color: #6b7280; width: 100px; }
        .info-table td:last-child { color: #111827; font-weight: 500; }
        .note-box { background-color: #f9fafb; border-radius: 6px; padding: 14px 16px; margin: 16px 0; font-size: 14px; color: #374151; }
        .message { font-size: 14px; color: #6b7280; line-height: 1.7; margin: 24px 0; }
        .footer { background-color: #f9fafb; padding: 24px 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>{{ config('app.name') }} 채용 안내</h1>
        </div>

        <div class="body">
            <p class="greeting">안녕하세요, <strong>{{ $applicant->name }}</strong>님.</p>

            @php
                $stageClass = match($stage->stage) {
                    '최종합격' => 'pass',
                    '불합격'   => 'fail',
                    default    => '',
                };
            @endphp

            <div class="stage-box {{ $stageClass }}">
                <div class="label">현재 전형 단계</div>
                <div class="value">{{ $stage->stage }}</div>
            </div>

            <table class="info-table">
                <tr>
                    <td>지원 공고</td>
                    <td>{{ $applicant->jobPosting->title }}</td>
                </tr>
                <tr>
                    <td>부서</td>
                    <td>{{ $applicant->jobPosting->department }}</td>
                </tr>
                <tr>
                    <td>안내 일시</td>
                    <td>{{ now()->format('Y년 m월 d일 H:i') }}</td>
                </tr>
            </table>

            @if($stage->note)
                <div class="note-box">
                    <strong>메모:</strong> {{ $stage->note }}
                </div>
            @endif

            @if($stage->stage === '최종합격')
                <p class="message">
                    축하드립니다! 최종 합격을 진심으로 축하드립니다.<br>
                    입사 관련 세부 안내는 별도로 연락드릴 예정입니다.
                </p>
            @elseif($stage->stage === '불합격')
                <p class="message">
                    귀하의 지원에 감사드립니다.<br>
                    아쉽게도 이번 채용에서는 함께하지 못하게 되었습니다.<br>
                    귀하의 앞날에 좋은 일이 가득하시길 바랍니다.
                </p>
            @else
                <p class="message">
                    전형이 다음 단계로 진행되었습니다.<br>
                    일정 및 세부 사항은 별도로 안내드릴 예정입니다.
                </p>
            @endif
        </div>

        <div class="footer">
            <p>본 메일은 발신 전용입니다. 문의사항은 채용 담당자에게 연락해 주세요.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
