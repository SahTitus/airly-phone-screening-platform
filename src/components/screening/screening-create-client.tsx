"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  BriefcaseBusiness,
  Check,
  Clock3,
  GripVertical,
  Mic,
  Plus,
  Save,
  Sparkles,
  Target,
  Trash2,
  Type,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "@/components/inputs/dropdown";
import { TextareaInput } from "@/components/inputs/textarea-input";
import { TextInput } from "@/components/inputs/text-input";
import { CardSurface } from "@/components/shared/card-surface";
import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import type { Question, ResponseType } from "@/core/types";
import { jobs } from "@/data/jobs";
import { generateQuestions } from "@/data/question-bank";
import { useScreenings } from "@/hooks/useScreenings";
import { createId } from "@/lib/id";

const extraQuestionPrompts = [
  "What should the recruiter know before the next interview?",
  "Describe a work habit that helps you deliver consistently.",
];

function StepPill({
  value,
  label,
  active,
}: {
  value: number;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={
          active
            ? "flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white"
            : "flex h-9 w-9 items-center justify-center rounded-full bg-bg-muted text-sm font-semibold text-text-secondary"
        }
      >
        {value}
      </span>
      <span
        className={
          active
            ? "min-w-0 truncate text-sm font-semibold text-brand-primary"
            : "min-w-0 truncate text-sm font-semibold text-text-secondary"
        }
      >
        {label}
      </span>
    </div>
  );
}

function ResponseTypeSelect({
  value,
  onChange,
}: {
  value: ResponseType;
  onChange: (value: ResponseType) => void;
}) {
  return (
    <Dropdown value={value} onValueChange={(next) => onChange(next as ResponseType)}>
      <DropdownTrigger>
        <DropdownValue />
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem value="text">
          <Type className="h-4 w-4" />
          Text
        </DropdownItem>
        <DropdownItem value="audio">
          <Mic className="h-4 w-4" />
          Audio
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

export function CreateScreeningClient() {
  const router = useRouter();
  const params = useSearchParams();
  const initialJobId = params.get("jobId");
  const [selectedJobId, setSelectedJobId] = useState(initialJobId ?? jobs[0]?.id ?? "");
  const [screeningTitle, setScreeningTitle] = useState(
    "Frontend Developer - Initial Screening",
  );
  const [description, setDescription] = useState(
    "A short screening to assess technical knowledge, problem solving, and communication skills.",
  );
  const [duration, setDuration] = useState("20");
  const [questionCount, setQuestionCount] = useState("6");
  const [passingScore, setPassingScore] = useState("70");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [customText, setCustomText] = useState("");
  const [customType, setCustomType] = useState<ResponseType>("text");
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [savingAction, setSavingAction] = useState<"draft" | "publish" | null>(null);
  const { saveScreening } = useScreenings();

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? jobs[0],
    [selectedJobId],
  );
  const previewQuestionCount =
    questions.length || Number.parseInt(questionCount, 10) || 6;

  const handleGenerate = async () => {
    if (!selectedJobId) {
      return;
    }

    const targetCount = Math.min(
      8,
      Math.max(5, Number.parseInt(questionCount, 10) || 6),
    );

    setGenerating(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    const generated = generateQuestions(selectedJobId);
    const nextQuestions = [...generated];

    while (nextQuestions.length < targetCount) {
      nextQuestions.push({
        id: createId("question"),
        text: extraQuestionPrompts[nextQuestions.length % extraQuestionPrompts.length],
        responseType: "text",
        isCustom: false,
        order: nextQuestions.length + 1,
      });
    }

    setQuestions(
      nextQuestions.slice(0, targetCount).map((question, index) => ({
        ...question,
        order: index + 1,
      })),
    );
    setQuestionCount(String(targetCount));
    setGenerating(false);
  };

  const updateQuestion = (questionId: string, patch: Partial<Question>) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      ),
    );
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((current) => {
      const next = current
        .filter((question) => question.id !== questionId)
        .map((question, index) => ({ ...question, order: index + 1 }));

      setQuestionCount(String(next.length));

      return next;
    });
  };

  const reorderQuestion = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) {
      return;
    }

    setQuestions((current) => {
      const sourceIndex = current.findIndex((question) => question.id === sourceId);
      const targetIndex = current.findIndex((question) => question.id === targetId);

      if (sourceIndex < 0 || targetIndex < 0) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);

      return next.map((question, index) => ({
        ...question,
        order: index + 1,
      }));
    });
  };

  const addCustomQuestion = () => {
    const text = customText.trim();

    if (!text) {
      return;
    }

    setQuestions((current) => {
      const next = [
        ...current,
        {
          id: createId("question"),
          text,
          responseType: customType,
          isCustom: true,
          order: current.length + 1,
        },
      ];

      setQuestionCount(String(next.length));

      return next;
    });
    setCustomText("");
    setCustomType("text");
  };

  const handleSave = async () => {
    if (!selectedJobId || questions.length === 0) {
      return;
    }

    setSavingAction("publish");
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    const screening = saveScreening(selectedJobId, questions);
    router.push(routes.job(screening.jobId));
  };

  const handleDraft = async () => {
    if (!selectedJobId) {
      return;
    }

    setSavingAction("draft");
    const draftQuestions = questions.length ? questions : generateQuestions(selectedJobId);
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    const screening = saveScreening(selectedJobId, draftQuestions, "draft");
    router.push(routes.job(screening.jobId));
  };

  return (
    <div className="space-y-6 pb-28 md:pb-0">
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <LinkButton
            href={routes.jobs()}
            variant="ghost"
            className="-ml-3 mb-4"
          >
            Back to Jobs
          </LinkButton>
          <h1 className="wrap-break-word text-[30px] font-semibold leading-tight text-text-primary md:text-[36px]">
            Create Phone Screening
          </h1>
          <p className="mt-2 truncate text-xl text-text-secondary">
            {selectedJob?.title ?? "Select a job"}
          </p>
        </div>
        <div className="hidden gap-3 md:grid md:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={savingAction !== null}
            onClick={handleDraft}
            loading={savingAction === "draft"}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            size="lg"
            loading={savingAction === "publish"}
            disabled={questions.length === 0 || savingAction !== null}
            onClick={handleSave}
            startIcon={<Save className="h-4 w-4" />}
          >
            Publish Screening
          </Button>
        </div>
      </div>

      <CardSurface padding="panel">
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            "Details",
            "Questions",
            "Settings",
            "Review",
          ].map((label, index) => (
            <StepPill
              key={label}
              value={index + 1}
              label={label}
              active={index === (questions.length > 0 ? 1 : 0)}
            />
          ))}
        </div>
      </CardSurface>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
        <section className="min-w-0 space-y-5">
          <CardSurface padding="panel" className="space-y-5">
            <h2 className="text-xl font-semibold text-text-primary">
              Screening Details
            </h2>
            <div className="grid min-w-0 gap-5 md:grid-cols-2">
              <label className="min-w-0">
                <span className="mb-2 block truncate text-sm font-medium text-text-secondary">
                  Screening Title
                </span>
                <TextInput
                  value={screeningTitle}
                  onChange={(event) => setScreeningTitle(event.target.value)}
                />
              </label>
              <label className="min-w-0">
                <span className="mb-2 block truncate text-sm font-medium text-text-secondary">
                  Job
                </span>
                <Dropdown value={selectedJobId} onValueChange={setSelectedJobId}>
                  <DropdownTrigger className="h-11">
                    <DropdownValue placeholder="Select job" />
                  </DropdownTrigger>
                  <DropdownContent>
                    {jobs.map((job) => (
                      <DropdownItem key={job.id} value={job.id}>
                        <BriefcaseBusiness className="h-4 w-4" />
                        <span className="min-w-0 truncate">{job.title}</span>
                      </DropdownItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
              </label>
            </div>
            <label className="min-w-0">
              <span className="mb-2 block truncate text-sm font-medium text-text-secondary">
                Description
              </span>
              <TextareaInput
                value={description}
                rows={4}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <div className="grid min-w-0 gap-4 md:grid-cols-3">
              <label className="min-w-0">
                <span className="block truncate text-sm font-medium text-text-secondary">
                  Estimated Duration
                </span>
                <TextInput
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  endAdornment={<span className="truncate text-xs text-text-secondary">Minutes</span>}
                  containerClassName="mt-3"
                />
              </label>
              <label className="min-w-0">
                <span className="block truncate text-sm font-medium text-text-secondary">
                  Number of Questions
                </span>
                <TextInput
                  value={questionCount}
                  onChange={(event) =>
                    setQuestionCount(event.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  endAdornment={<span className="truncate text-xs text-text-secondary">Questions</span>}
                  containerClassName="mt-3"
                />
              </label>
              <label className="min-w-0">
                <span className="block truncate text-sm font-medium text-text-secondary">
                  Passing Score
                </span>
                <TextInput
                  value={passingScore}
                  onChange={(event) => setPassingScore(event.target.value)}
                  endAdornment={<span className="truncate text-xs text-text-secondary">%</span>}
                  containerClassName="mt-3"
                />
              </label>
            </div>
          </CardSurface>

          <CardSurface padding="panel" className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Questions
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Generate, edit, or add custom questions.
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                loading={generating}
                disabled={!selectedJobId || generating}
                onClick={handleGenerate}
                startIcon={<Sparkles className="h-4 w-4" />}
              >
                {questions.length ? "Regenerate Questions" : "Generate Questions"}
              </Button>
            </div>

            <div className="space-y-3">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedQuestionId) {
                      reorderQuestion(draggedQuestionId, question.id);
                    }
                    setDraggedQuestionId(null);
                  }}
                  onDragEnd={() => setDraggedQuestionId(null)}
                  className="grid min-w-0 gap-3 rounded-lg border border-border-default p-3 sm:grid-cols-[40px_minmax(0,1fr)] lg:grid-cols-[40px_minmax(0,1fr)_150px_44px]"
                >
                  <div
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      setDraggedQuestionId(question.id);
                    }}
                    className="flex h-9 w-9 cursor-grab items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary active:cursor-grabbing"
                  >
                    <GripVertical className="h-4 w-4" />
                    <span className="sr-only">{index + 1}</span>
                  </div>
                  <TextareaInput
                    value={question.text}
                    rows={2}
                    onChange={(event) =>
                      updateQuestion(question.id, { text: event.target.value })
                    }
                  />
                  <ResponseTypeSelect
                    value={question.responseType}
                    onChange={(responseType) =>
                      updateQuestion(question.id, { responseType })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label="Remove question"
                    className="text-status-danger hover:text-status-danger"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid min-w-0 gap-3 rounded-lg border border-dashed border-brand-primary/45 bg-brand-primary-soft/40 p-4 md:grid-cols-[minmax(0,1fr)_150px_auto]">
              <TextInput
                value={customText}
                onChange={(event) => setCustomText(event.target.value)}
                placeholder="Add custom question"
                aria-label="Custom question"
              />
              <ResponseTypeSelect value={customType} onChange={setCustomType} />
              <Button
                type="button"
                variant="outline"
                onClick={addCustomQuestion}
                disabled={!customText.trim()}
                startIcon={<Plus className="h-4 w-4" />}
              >
                Add Question
              </Button>
            </div>
          </CardSurface>
        </section>

        <aside className="min-w-0 xl:sticky xl:top-8 xl:self-start">
          <CardSurface padding="panel" className="space-y-5">
            <h2 className="text-lg font-semibold text-text-primary">
              Candidate Experience Preview
            </h2>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
              <BriefcaseBusiness className="h-10 w-10" />
            </div>
            <div className="space-y-4 text-sm text-text-secondary">
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4" />
                {duration} minutes
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4" />
                {previewQuestionCount} questions
              </div>
              <div className="flex items-center gap-3">
                <Mic className="h-4 w-4" />
                Audio placeholders
              </div>
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4" />
                {passingScore}% passing score
              </div>
            </div>
          </CardSurface>
        </aside>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-3 border-t border-border-default bg-bg-surface p-3 md:hidden"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={savingAction !== null}
          onClick={handleDraft}
          loading={savingAction === "draft"}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          size="lg"
          className="px-2 text-[12px]"
          loading={savingAction === "publish"}
          disabled={questions.length === 0 || savingAction !== null}
          onClick={handleSave}
          startIcon={<Save className="h-4 w-4" />}
        >
          Publish Screening
        </Button>
      </div>
    </div>
  );
}
