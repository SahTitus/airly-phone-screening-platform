"use client";

import {
  Check,
  Expand,
  FileText,
  Mic,
  MoreHorizontal,
  Pause,
  Play,
  Save,
  Star,
  Type,
} from "lucide-react";
import { useMemo, useState } from "react";

import { TextareaInput } from "@/components/inputs/textarea-input";
import { Badge } from "@/components/shared/badge";
import { CardSurface } from "@/components/shared/card-surface";
import { EmptyState } from "@/components/shared/empty-state";
import { LinkButton } from "@/components/shared/link-button";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import type { Job, Question, Submission } from "@/core/types";
import { mockAnalysis } from "@/data/mock-analysis";
import { useScreenings } from "@/hooks/useScreenings";
import { useSubmissions } from "@/hooks/useSubmissions";
import { getInitials } from "@/lib/jobs";
import { getSubmissionScore } from "@/lib/scores";
import { cn } from "@/utils/cn";

type ApplicantDetailClientProps = {
  job: Job;
  applicantId: string;
};

const scoreRows = [
  ["Technical Knowledge", 80],
  ["Problem Solving", 75],
  ["Communication", 70],
  ["Experience", 85],
  ["Culture Fit", 80],
] as const;

function Stars({ value }: { value: number }) {
  const filled = Math.round(value / 20);

  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= filled
              ? "fill-rating-gold text-rating-gold"
              : "text-border-strong",
          )}
        />
      ))}
    </span>
  );
}

function AudioResponse({ value }: { value: string }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border-default p-4">
        <div className="h-24 rounded-md bg-bg-subtle">
          <div className="flex h-full items-center justify-center gap-1 px-4 text-brand-primary">
            {Array.from({ length: 42 }).map((_, index) => (
              <span
                key={index}
                className="w-0.5 rounded-full bg-brand-primary"
                style={{ height: `${14 + ((index * 7) % 42)}px` }}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button
            type="button"
            aria-label="Play audio"
            className="h-11 w-11 rounded-full p-0"
          >
            <Play className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" aria-label="Pause audio">
            <Pause className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm">
            1x
          </Button>
          <Button type="button" variant="outline" size="sm" aria-label="Expand audio">
            <Expand className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-semibold text-text-primary">Transcription</h3>
        <p className="text-sm leading-7 text-text-secondary">{value}</p>
      </div>
    </div>
  );
}

function AnswerBody({
  submission,
  questions,
  activeIndex,
}: {
  submission: Submission;
  questions: Question[];
  activeIndex: number;
}) {
  const answer = submission.answers[activeIndex];
  const question = questions[activeIndex];

  if (!answer) {
    return null;
  }

  return (
    <CardSurface padding="panel" className="min-h-130 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-base font-semibold text-text-primary">
          {activeIndex + 1}. {question?.text ?? `Question ${activeIndex + 1}`}
        </h2>
        <span className="inline-flex items-center gap-2 text-[12px] text-text-muted">
          {answer.responseType === "audio" ? (
            <Mic className="h-4 w-4" />
          ) : (
            <Type className="h-4 w-4" />
          )}
          {answer.responseType === "audio" ? "Audio" : "Text"}
        </span>
      </div>
      {answer.responseType === "audio" ? (
        <AudioResponse value={answer.value} />
      ) : (
        <div>
          <h3 className="mb-3 font-semibold text-text-primary">Response</h3>
          <p className="text-sm leading-7 text-text-secondary">{answer.value}</p>
        </div>
      )}
    </CardSurface>
  );
}

export function ApplicantDetailClient({
  job,
  applicantId,
}: ApplicantDetailClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [savingEvaluation, setSavingEvaluation] = useState(false);
  const [evaluationSaved, setEvaluationSaved] = useState(false);
  const [notes, setNotes] = useState("");
  const { submissions } = useSubmissions();
  const { screenings } = useScreenings();

  const submission = useMemo(
    () => submissions.find((item) => item.id === applicantId) ?? null,
    [applicantId, submissions],
  );

  const screening = useMemo(() => {
    if (!submission) {
      return null;
    }

    return (
      screenings.find((item) => item.id === submission.screeningId) ??
      screenings.find((item) => item.jobId === job.id) ??
      null
    );
  }, [job.id, screenings, submission]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    setAnalysisVisible(true);
    setAnalyzing(false);
  };

  const handleSaveEvaluation = async () => {
    setSavingEvaluation(true);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    setEvaluationSaved(true);
    setSavingEvaluation(false);
  };

  if (!submission) {
    return (
      <EmptyState
        icon={<FileText className="h-5 w-5" />}
        title="Applicant not found"
        description="The response may have been removed from this browser."
        action={
          <LinkButton href={routes.jobs()} variant="outline">
            Back to jobs
          </LinkButton>
        }
      />
    );
  }

  const questions = screening?.questions ?? [];
  const score = getSubmissionScore(submission.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <LinkButton
            href={routes.job(job.id)}
            variant="ghost"
            className="-ml-3 mb-5"
          >
            Back to Applicants
          </LinkButton>
          <div className="flex items-center gap-5">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-brand-primary-soft text-xl font-semibold text-brand-primary">
              {getInitials(submission.candidateName)}
            </div>
            <div>
              <h1 className="text-[30px] font-semibold leading-tight text-text-primary">
                {submission.candidateName}
              </h1>
              <p className="mt-1 text-base text-text-secondary">
                {submission.candidateEmail}
              </p>
              <p className="mt-2 text-lg text-text-secondary">
                Applied for {job.title}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge label="Completed" variant="success" className="px-4 py-2 text-sm" />
          <Button type="button" variant="outline" size="lg" endIcon={<MoreHorizontal className="h-4 w-4" />}>
            Actions
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_260px_340px]">
        <CardSurface padding="panel" className="space-y-4">
          <h2 className="font-semibold text-text-primary">Questions</h2>
          <div className="space-y-3">
            {submission.answers.map((answer, index) => (
              <Button
                key={answer.questionId}
                type="button"
                variant={activeIndex === index ? "outline" : "ghost"}
                className={cn(
                  "h-auto w-full justify-start gap-3 px-3 py-4 text-left",
                  activeIndex === index &&
                    "border-brand-primary bg-brand-primary-soft text-brand-primary",
                )}
                onClick={() => setActiveIndex(index)}
              >
                <span className="text-lg font-semibold">{index + 1}</span>
                <span className="line-clamp-2 text-[12px]">
                  {questions[index]?.text ?? `Question ${index + 1}`}
                </span>
              </Button>
            ))}
          </div>
        </CardSurface>

        <AnswerBody
          submission={submission}
          questions={questions}
          activeIndex={activeIndex}
        />

        <CardSurface padding="panel" className="space-y-5">
          <h2 className="font-semibold text-text-primary">Your Evaluation</h2>
          <div className="space-y-4">
            {scoreRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-border-default pb-3"
              >
                <span className="text-[12px] text-text-secondary">{label}</span>
                <Stars value={value} />
              </div>
            ))}
          </div>
          <label className="block">
            <span className="mb-2 block text-[12px] font-medium text-text-secondary">
              Comments
            </span>
            <TextareaInput
              value={notes}
              rows={7}
              placeholder="Add feedback"
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
          <Button
            type="button"
            className="w-full"
            startIcon={<Save className="h-4 w-4" />}
            onClick={handleSaveEvaluation}
            loading={savingEvaluation}
            disabled={savingEvaluation}
          >
            {evaluationSaved ? "Evaluation Saved" : "Save Evaluation"}
          </Button>
        </CardSurface>

        <div className="space-y-5">
          <CardSurface padding="panel">
            <h2 className="font-semibold text-text-primary">Overall Score</h2>
            <p className="mt-6 text-[44px] font-semibold leading-none text-text-primary">
              {score}%
            </p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span
                className={cn(
                  "text-lg font-semibold",
                  score >= 70 ? "text-status-success" : "text-status-warning",
                )}
              >
                {score >= 70 ? "Good" : "Review"}
              </span>
              <Stars value={score} />
            </div>
          </CardSurface>

          <CardSurface padding="panel" className="space-y-4">
            <h2 className="font-semibold text-text-primary">Score Breakdown</h2>
            {scoreRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 border-b border-border-default pb-3 last:border-0 last:pb-0"
              >
                <span className="text-[12px] text-text-secondary">{label}</span>
                <span className="font-medium text-text-primary">{value}%</span>
                <Stars value={value} />
              </div>
            ))}
          </CardSurface>

          <CardSurface padding="panel" className="space-y-3">
            <h2 className="font-semibold text-text-primary">
              Final Recommendation
            </h2>
            {analysisVisible ? (
              <>
                <p className="text-2xl font-semibold capitalize text-status-success">
                  {mockAnalysis.recommendation === "advance"
                    ? "Strong Hire"
                    : mockAnalysis.recommendation}
                </p>
                <p className="text-sm leading-6 text-text-secondary">
                  {mockAnalysis.summary}
                </p>
              </>
            ) : analyzing ? (
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Spinner size="sm" />
                Analyzing
              </div>
            ) : (
              <Button
                type="button"
                className="w-full"
                onClick={handleAnalyze}
                loading={analyzing}
                disabled={analyzing}
              >
                Analyze Response
              </Button>
            )}
            {analysisVisible && (
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-status-success-soft text-status-success">
                <Check className="h-7 w-7" />
              </div>
            )}
          </CardSurface>
        </div>
      </div>
    </div>
  );
}
