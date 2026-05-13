"use client";

import Image from "next/image";
import { useMemo } from "react";
import { CalendarDays, FileText, Mail, UserRound } from "lucide-react";

import { CardSurface } from "@/components/shared/card-surface";
import { EmptyState } from "@/components/shared/empty-state";
import { LinkButton } from "@/components/shared/link-button";
import { storageKeys } from "@/config/storage";
import { routes } from "@/config/routes";
import type { Job } from "@/core/types";
import { useSubmissions } from "@/hooks/useSubmissions";
import { formatDateTime } from "@/lib/date";

export function ThankYouClient({ job }: { job: Job }) {
  const { submissions } = useSubmissions();

  const submission = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const lastId = window.localStorage.getItem(storageKeys.lastSubmission);
    return (
      submissions.find((item) => item.id === lastId) ??
      submissions.find((item) => item.jobId === job.id) ??
      null
    );
  }, [job.id, submissions]);

  if (!submission) {
    return (
      <EmptyState
        title="Submission not found"
        description="Complete the screening to see this page."
        action={
          <LinkButton href={routes.screening(job.id)} variant="outline">
            Back to screening
          </LinkButton>
        }
      />
    );
  }

  return (
    <section className="mx-auto max-w-190 rounded-lg border border-border-default bg-bg-surface p-5 text-center sm:p-8">
      <Image
        src="/success-check.png"
        alt=""
        width={150}
        height={112}
        className="mx-auto h-28 w-37.5 object-contain"
        priority
      />
      <h1 className="mt-4 text-[30px] font-semibold leading-tight text-text-primary md:text-[40px]">
        Screening Submitted
      </h1>
      <p className="mx-auto mt-4 max-w-130 text-base leading-7 text-text-secondary">
        Thank you for completing the phone screening for{" "}
        <span className="font-semibold text-brand-primary">{job.title}</span>.
      </p>

      <CardSurface padding="compact" className="mx-auto mt-8 max-w-135 text-left">
        <div className="divide-y divide-border-default">
          {[
            {
              icon: UserRound,
              label: "Candidate Name",
              value: submission.candidateName,
            },
            { icon: Mail, label: "Email", value: submission.candidateEmail },
            {
              icon: CalendarDays,
              label: "Submitted At",
              value: formatDateTime(submission.submittedAt),
            },
            {
              icon: FileText,
              label: "Total Answers",
              value: String(submission.answers.length),
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="grid gap-3 py-4 sm:grid-cols-[220px_minmax(0,1fr)]"
              >
                <div className="flex items-center gap-3 text-text-secondary">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-primary-soft text-brand-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm">{item.label}</span>
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </CardSurface>

      <p className="mx-auto mt-8 max-w-130 text-sm leading-6 text-text-secondary">
        Your responses have been recorded successfully.
      </p>
      <LinkButton
        href={routes.screening(job.id)}
        size="lg"
        className="mt-7 min-w-65"
      >
        Return to Screening
      </LinkButton>
    </section>
  );
}
