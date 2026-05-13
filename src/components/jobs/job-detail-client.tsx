"use client";

import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Copy,
  MapPin,
  MoreHorizontal,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import { DataTable, type Column } from "@/components/data/data-table";
import { Badge } from "@/components/shared/badge";
import { CardSurface } from "@/components/shared/card-surface";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { LinkButton } from "@/components/shared/link-button";
import { routes } from "@/config/routes";
import type { Job, Submission } from "@/core/types";
import { useScreenings } from "@/hooks/useScreenings";
import { useSubmissions } from "@/hooks/useSubmissions";
import { formatDateTime } from "@/lib/date";
import { getInitials } from "@/lib/jobs";
import { getScoreTone, getSubmissionScore } from "@/lib/scores";

type JobDetailClientProps = {
  job: Job;
};

function jobStatusBadge(status: Job["status"]) {
  const labels = {
    active: "Active",
    draft: "Draft",
    closed: "Closed",
  };
  const variants = {
    active: "success",
    draft: "default",
    closed: "outline",
  } as const;

  return (
    <Badge
      label={labels[status]}
      variant={variants[status]}
      className="px-3 py-1 text-sm"
    />
  );
}

export function JobDetailClient({ job }: JobDetailClientProps) {
  const [origin, setOrigin] = useState("aihrly.app");
  const { screeningsByJob } = useScreenings();
  const { submissionsByJob } = useSubmissions();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const screenings = screeningsByJob[job.id] ?? [];
  const latestScreening = screenings[0] ?? null;
  const submissions = submissionsByJob[job.id] ?? [];
  const publicLink = `${origin}${routes.screening(job.id)}`;
  const completed = submissions.length;
  const invited = Math.max(screenings.length * 6, completed);
  const completionRate = Math.round((completed / Math.max(invited, 1)) * 100);

  const applicantColumns: Column<Submission>[] = [
    {
      key: "candidate",
      header: "Applicant",
      render: (submission) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary-soft text-[12px] font-semibold text-brand-primary">
            {getInitials(submission.candidateName)}
          </div>
          <Link
            href={routes.applicant(job.id, submission.id)}
            className="font-medium text-text-primary hover:text-brand-primary"
          >
            {submission.candidateName}
          </Link>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => <Badge label="Completed" variant="success" />,
    },
    {
      key: "submitted",
      header: "Submitted",
      render: (submission) => formatDateTime(submission.submittedAt),
    },
    {
      key: "score",
      header: "Score",
      align: "right",
      render: (submission) => {
        const score = getSubmissionScore(submission.id);
        return <Badge label={`${score}%`} variant={getScoreTone(score)} />;
      },
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (submission) => (
        <Link
          href={routes.applicant(job.id, submission.id)}
          className="inline-flex items-center text-[13px] font-semibold text-brand-primary hover:text-brand-primary-deep"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <LinkButton
            href={routes.jobs()}
            variant="ghost"
            className="-ml-3 mb-4"
          >
            Back to Jobs
          </LinkButton>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="min-w-0 wrap-break-word text-[30px] font-semibold leading-tight text-text-primary md:text-[38px]">
              {job.title}
            </h1>
            {jobStatusBadge(job.status)}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-text-muted" />
              <span>{job.employmentType}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-text-muted" />
              <span>{job.location}</span>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
            {job.description}
          </p>
        </div>
        <div className="grid w-full gap-3 sm:grid-cols-2 md:w-auto">
          <LinkButton
            href={routes.createScreening(job.id)}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Edit Job
          </LinkButton>
          <LinkButton
            href={routes.createScreening(job.id)}
            size="lg"
            className="w-full"
          >
            Create Screening
          </LinkButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Screenings", value: screenings.length, delta: "16%" },
          {
            label: "Total Applicants",
            value: submissions.length,
            delta: "20%",
          },
          { label: "Completed", value: completed, delta: "12%" },
          {
            label: "Completion Rate",
            value: `${completionRate}%`,
            delta: "8%",
          },
        ].map((metric) => (
          <CardSurface key={metric.label} padding="panel">
            <p className="text-base font-medium text-text-secondary">
              {metric.label}
            </p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <p className="text-[34px] font-semibold leading-none text-text-primary">
                {metric.value}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-status-success">
                <TrendingUp className="h-4 w-4" />
                {metric.delta}
              </span>
            </div>
          </CardSurface>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <CardSurface padding="none" className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border-default px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Screenings
            </h2>
            <LinkButton
              href={routes.createScreening(job.id)}
              variant="outline"
              startIcon={<Plus className="h-4 w-4" />}
            >
              Create Screening
            </LinkButton>
          </div>
          {screenings.length === 0 ? (
            <EmptyState
              title="No screening yet"
              description="Create the first screening for this job."
              action={
                <LinkButton href={routes.createScreening(job.id)}>
                  Create Screening
                </LinkButton>
              }
            />
          ) : (
            <div className="divide-y divide-border-default">
              {screenings.map((screening) => {
                const screeningSubmissions = submissions.filter(
                  (submission) => submission.screeningId === screening.id,
                );
                const screeningCompleted = screeningSubmissions.length;
                const screeningInvited = Math.max(
                  screening.questions.length * 3,
                  screeningCompleted,
                );
                const screeningRate = Math.round(
                  (screeningCompleted / Math.max(screeningInvited, 1)) * 100,
                );

                return (
                  <div
                    key={screening.id}
                    className="grid gap-4 px-4 py-5 sm:px-6 md:grid-cols-[minmax(0,1fr)_120px_120px_120px_40px] md:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary">
                        Initial Screening
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {screening.questions.length} questions - 20 minutes
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {screeningInvited}
                      </p>
                      <p className="text-sm text-text-secondary">Invited</p>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {screeningCompleted}
                      </p>
                      <p className="text-sm text-text-secondary">Completed</p>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {screeningRate}%
                      </p>
                      <p className="text-sm text-text-secondary">Completion</p>
                    </div>
                    <MoreHorizontal className="hidden h-4 w-4 text-text-muted md:block" />
                  </div>
                );
              })}
            </div>
          )}
        </CardSurface>

        <CardSurface padding="panel" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary-soft text-brand-primary">
              <Copy className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">
              Public Screening Link
            </h2>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border-default bg-bg-subtle p-3">
            <span className="min-w-0 truncate font-mono text-[12px] text-text-secondary">
              {publicLink}
            </span>
            <CopyButton value={publicLink} />
          </div>
          <div className="rounded-lg border border-status-success/20 bg-status-success-soft p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-status-success" />
              <p className="font-semibold text-text-primary">
                {latestScreening ? "Screening Created" : "Screening Draft"}
              </p>
            </div>
            {latestScreening && (
              <p className="mt-2 text-sm text-text-secondary">
                Created {formatDateTime(latestScreening.createdAt)}
              </p>
            )}
          </div>
        </CardSurface>
      </div>

      <CardSurface padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border-default px-4 py-4 sm:px-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Recent Applicants
          </h2>
          <span className="text-sm font-semibold text-brand-primary">
            {submissions.length} total
          </span>
        </div>
        {submissions.length === 0 ? (
          <EmptyState
            title="No applicants yet"
            description="Responses appear here after candidates submit."
          />
        ) : (
          <DataTable
            columns={applicantColumns}
            rows={submissions.slice(0, 6)}
            rowKey={(submission) => submission.id}
            mobileRender={(submission) => {
              const score = getSubmissionScore(submission.id);
              return (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-soft text-[12px] font-semibold text-brand-primary">
                        {getInitials(submission.candidateName)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          {submission.candidateName}
                        </p>
                        <p className="text-[13px] text-text-secondary">
                          {formatDateTime(submission.submittedAt)}
                        </p>
                      </div>
                    </div>
                    <Badge label={`${score}%`} variant={getScoreTone(score)} />
                  </div>
                  <LinkButton
                    href={routes.applicant(job.id, submission.id)}
                    variant="outline"
                    className="w-full"
                  >
                    View Responses
                  </LinkButton>
                </div>
              );
            }}
          />
        )}
      </CardSurface>
    </div>
  );
}
