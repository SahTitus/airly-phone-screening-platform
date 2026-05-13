"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Clock3,
  Info,
  Lock,
  Mic,
  Type,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { TextareaInput } from "@/components/inputs/textarea-input";
import { TextInput } from "@/components/inputs/text-input";
import { CardSurface } from "@/components/shared/card-surface";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { storageKeys } from "@/config/storage";
import { routes } from "@/config/routes";
import type { Answer, Job, Question } from "@/core/types";
import { generateQuestions } from "@/data/question-bank";
import { useScreenings } from "@/hooks/useScreenings";
import { useSubmissions } from "@/hooks/useSubmissions";
import { isValidEmail } from "@/lib/validation";

type CandidateScreeningClientProps = {
  job: Job;
};

type CandidateForm = {
  name: string;
  email: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  answer?: string;
};

const transition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.22 },
};

function Progress({ current, total }: { current: number; total: number }) {
  const value = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-text-secondary">
        Question {current} of {total}
      </p>
      <div className="h-2 w-full rounded-full bg-border-default">
        <div
          className="h-2 rounded-full bg-brand-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-md border border-brand-primary/30 bg-brand-primary-soft px-3 py-2 text-sm font-semibold text-brand-primary">
        {question.responseType === "audio" ? (
          <Mic className="h-4 w-4" />
        ) : (
          <Type className="h-4 w-4" />
        )}
        {question.responseType === "audio" ? "Audio Response" : "Text Response"}
      </div>

      {question.responseType === "audio" && (
        <div className="rounded-lg border border-border-default bg-bg-muted p-4">
          <Button type="button" variant="outline" disabled startIcon={<Mic className="h-4 w-4" />}>
            Record
          </Button>
          <p className="mt-3 text-sm text-text-secondary">
            For this demo, please use a text response below.
          </p>
        </div>
      )}

      <TextareaInput
        value={value}
        rows={8}
        maxLength={2000}
        placeholder="Type your answer"
        aria-label="Answer"
        onChange={(event) => onChange(event.target.value)}
        inputClassName="text-base leading-7"
      />
      <div className="flex items-center justify-between gap-4 text-[12px] text-text-muted">
        <span className="inline-flex items-center gap-2">
          <Info className="h-4 w-4" />
          Please provide a concise answer.
        </span>
        <span className="font-mono">{value.length} / 2000</span>
      </div>
    </div>
  );
}

export function CandidateScreeningClient({ job }: CandidateScreeningClientProps) {
  const router = useRouter();
  const { screeningsByJob, saveScreening, ready } = useScreenings();
  const { createSubmission } = useSubmissions();
  const [form, setForm] = useState<CandidateForm>({ name: "", email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fallbackQuestions, setFallbackQuestions] = useState<Question[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const latestScreening = screeningsByJob[job.id]?.[0] ?? null;

  useEffect(() => {
    if (ready && !latestScreening && fallbackQuestions.length === 0) {
      const generated = generateQuestions(job.id);
      const screening = saveScreening(job.id, generated);
      setFallbackQuestions(screening.questions);
    }
  }, [fallbackQuestions.length, job.id, latestScreening, ready, saveScreening]);

  const questions = latestScreening?.questions ?? fallbackQuestions;
  const activeQuestion = questions[currentIndex];
  const answerValue = activeQuestion ? answers[activeQuestion.id] ?? "" : "";

  const estimatedMinutes = Math.max(questions.length * 2, 6);

  const canBegin = useMemo(() => {
    return form.name.trim().length > 0 && isValidEmail(form.email);
  }, [form.email, form.name]);

  const validateWelcome = () => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const begin = () => {
    if (!validateWelcome()) {
      return;
    }

    setStarted(true);
  };

  const submitCurrent = async () => {
    if (!activeQuestion) {
      return;
    }

    // prevent double submit
    if (submitting) {
      return;
    }

    if (!answerValue.trim()) {
      setErrors({ answer: "Answer is required." });
      return;
    }

    setErrors({});

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1);
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 450));

    const submissionAnswers: Answer[] = questions.map((question) => ({
      questionId: question.id,
      responseType: question.responseType,
      value: answers[question.id]?.trim() ?? "",
    }));

    const submission = createSubmission({
      jobId: job.id,
      screeningId: latestScreening?.id ?? `screening-${job.id}`,
      candidateName: form.name.trim(),
      candidateEmail: form.email.trim(),
      answers: submissionAnswers,
    });

    window.localStorage.setItem(storageKeys.lastSubmission, submission.id);
    router.push(routes.thankYou(job.id));
  };

  const goBack = () => {
    setErrors({});
    setCurrentIndex((current) => Math.max(0, current - 1));
  };

  if (ready && questions.length === 0) {
    return (
      <EmptyState
        title="Screening unavailable"
        description="Ask the recruiter for a new link."
      />
    );
  }

  if (!started) {
    return (
      <motion.section
        {...transition}
        className="mx-auto max-w-172.5 rounded-lg border border-border-default bg-bg-surface p-5 sm:p-8"
      >
        <div className="mx-auto max-w-130 text-center">
          <Image
            src="/phone-waveform.png"
            alt=""
            width={150}
            height={112}
            className="mx-auto h-28 w-37.5 object-contain"
            priority
          />
          <h1 className="mt-4 text-[30px] font-semibold leading-tight text-text-primary md:text-[40px]">
            Phone Screening
          </h1>
          <p className="mt-2 text-lg font-semibold text-brand-primary">
            {job.title}
          </p>
          <p className="mt-4 text-base leading-7 text-text-secondary">
            Welcome. Answer each question one at a time.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-130 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-text-primary">
              Full Name
            </span>
            <TextInput
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Enter your full name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <span className="mt-2 block text-[12px] text-status-danger">
                {errors.name}
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-text-primary">
              Email Address
            </span>
            <TextInput
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Enter your email address"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <span className="mt-2 block text-[12px] text-status-danger">
                {errors.email}
              </span>
            )}
          </label>

          <div className="grid gap-3 rounded-lg border border-border-default bg-bg-subtle p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total Questions</p>
                <p className="text-lg font-semibold text-text-primary">
                  {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Estimated Time</p>
                <p className="text-lg font-semibold text-text-primary">
                  {estimatedMinutes} min
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={!canBegin}
            onClick={begin}
          >
            Start Screening
          </Button>

          <p className="flex items-center justify-center gap-2 text-[13px] text-text-muted">
            <Lock className="h-4 w-4" />
            Your responses are confidential.
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <div className="mx-auto grid max-w-300 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <CardSurface padding="panel" className="min-h-140">
        <AnimatePresence mode="wait">
          {activeQuestion && (
            <motion.div key={activeQuestion.id} {...transition} className="space-y-8">
              <Progress current={currentIndex + 1} total={questions.length} />
              <div>
                <h1 className="max-w-3xl text-[26px] font-semibold leading-tight text-text-primary md:text-[32px]">
                  {activeQuestion.text}
                </h1>
              </div>

              <QuestionInput
                question={activeQuestion}
                value={answerValue}
                onChange={(value) => {
                  setAnswers((current) => ({
                    ...current,
                    [activeQuestion.id]: value,
                  }));
                  setErrors((current) => ({ ...current, answer: undefined }));
                }}
              />

              {errors.answer && (
                <p className="text-[12px] text-status-danger">{errors.answer}</p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={currentIndex === 0}
                  onClick={goBack}
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={submitCurrent}
                  loading={submitting}
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  {currentIndex === questions.length - 1 ? "Submit" : "Next Question"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardSurface>

      <CardSurface padding="panel" className="h-fit space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Your Session</h2>
        <div className="rounded-lg border border-border-default bg-bg-subtle p-4">
          <div className="flex items-center gap-3">
            <Clock3 className="h-6 w-6 text-brand-primary" />
            <div>
              <p className="text-sm text-text-secondary">Estimated Time</p>
              <p className="text-2xl font-semibold text-text-primary">
                {estimatedMinutes} min
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border-default bg-bg-subtle p-4">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="h-6 w-6 text-status-success" />
            <div>
              <p className="text-sm text-text-secondary">Role</p>
              <p className="font-semibold text-text-primary">{job.title}</p>
            </div>
          </div>
        </div>
        <p className="border-t border-border-default pt-5 text-[13px] leading-6 text-text-secondary">
          Answers are saved when you submit.
        </p>
      </CardSurface>
    </div>
  );
}
