<?php

namespace App\Mail;

use App\Models\Applicant;
use App\Models\ApplicationStage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StageChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Applicant $applicant,
        public readonly ApplicationStage $stage,
    ) {}

    public function envelope(): Envelope
    {
        $subject = match ($this->stage->stage) {
            '최종합격' => '[축하합니다] 최종 합격을 알려드립니다',
            '불합격'   => '[안내] 전형 결과를 알려드립니다',
            default    => "[{$this->stage->stage}] 지원 전형 단계 안내",
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.stage-changed',
        );
    }
}
