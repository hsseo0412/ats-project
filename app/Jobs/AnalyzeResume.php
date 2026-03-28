<?php

namespace App\Jobs;

use App\Models\Applicant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;

class AnalyzeResume implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60; // 재시도 전 60초 대기

    public function __construct(
        private readonly Applicant $applicant
    ) {}

    public function handle(): void
    {
        // 1. PDF 텍스트 추출
        $resumeText = $this->extractTextFromPdf();

        if (empty($resumeText)) {
            Log::warning("AnalyzeResume: PDF 텍스트 추출 실패", ['applicant_id' => $this->applicant->id]);
            return;
        }

        // resume_text 저장
        $this->applicant->update(['resume_text' => $resumeText]);

        // 2. Claude API 호출
        [$summary, $score] = $this->analyzeWithClaude($resumeText);

        // 3. 결과 저장
        $this->applicant->update([
            'ai_summary'     => $summary,
            'ai_score'       => $score,
            'ai_analyzed_at' => now(),
        ]);

        Log::info("AnalyzeResume: 분석 완료", [
            'applicant_id' => $this->applicant->id,
            'ai_score'     => $score,
        ]);
    }

    private function extractTextFromPdf(): string
    {
        $path = Storage::disk('private')->path($this->applicant->resume_path);

        if (!file_exists($path)) {
            Log::error("AnalyzeResume: 파일 없음", ['path' => $path]);
            return '';
        }

        try {
            $parser = new Parser();
            $pdf    = $parser->parseFile($path);
            return trim($pdf->getText());
        } catch (\Exception $e) {
            Log::error("AnalyzeResume: PDF 파싱 오류", [
                'applicant_id' => $this->applicant->id,
                'error'        => $e->getMessage(),
            ]);
            return '';
        }
    }

    private function analyzeWithClaude(string $resumeText): array
    {
        $jobPosting = $this->applicant->jobPosting;

        $prompt = <<<PROMPT
당신은 경력 10년의 전문 HR 컨설턴트입니다. 아래 채용공고와 이력서를 분석하여 지원자의 적합도를 평가해주세요.

## 채용공고
- 직무: {$jobPosting->title}
- 부서: {$jobPosting->department}
- 공고 내용: {$jobPosting->description}
- 자격 요건: {$jobPosting->requirements}

## 지원자 이력서
{$resumeText}

## 요청 사항
다음 JSON 형식으로만 응답해주세요. 마크다운이나 추가 텍스트 없이 순수 JSON만 반환합니다.

{
  "summary": "지원자에 대한 2~4문장의 한국어 요약. 핵심 경력, 강점, 채용공고 적합성을 포함할 것.",
  "score": 0에서 100 사이의 정수 (채용공고 자격 요건 부합도 기준)
}
PROMPT;

        $response = Http::withHeaders([
            'x-api-key'         => config('services.anthropic.api_key'),
            'anthropic-version' => config('services.anthropic.version'),
            'content-type'      => 'application/json',
        ])->timeout(60)->post('https://api.anthropic.com/v1/messages', [
            'model'      => config('services.anthropic.model'),
            'max_tokens' => 512,
            'messages'   => [
                ['role' => 'user', 'content' => $prompt],
            ],
        ]);

        if ($response->failed()) {
            Log::error("AnalyzeResume: Claude API 오류", [
                'applicant_id' => $this->applicant->id,
                'status'       => $response->status(),
                'body'         => $response->body(),
            ]);
            throw new \RuntimeException("Claude API 호출 실패: HTTP {$response->status()}");
        }

        $content = $response->json('content.0.text', '');

        return $this->parseClaudeResponse($content);
    }

    private function parseClaudeResponse(string $content): array
    {
        // JSON 블록이 있을 경우 추출
        if (preg_match('/\{.*\}/s', $content, $matches)) {
            $content = $matches[0];
        }

        $data = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE || !isset($data['summary'], $data['score'])) {
            Log::warning("AnalyzeResume: JSON 파싱 실패, 원본 응답 저장", [
                'applicant_id' => $this->applicant->id,
                'content'      => $content,
            ]);
            return [$content, 0];
        }

        $score = max(0, min(100, (int) $data['score']));

        return [$data['summary'], $score];
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("AnalyzeResume: Job 최종 실패", [
            'applicant_id' => $this->applicant->id,
            'error'        => $exception->getMessage(),
        ]);
    }
}
