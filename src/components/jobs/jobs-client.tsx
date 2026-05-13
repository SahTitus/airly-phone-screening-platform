"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CheckCircle2,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable, type Column } from "@/components/data/data-table";
import { SearchInput } from "@/components/inputs/search-input";
import { Badge } from "@/components/shared/badge";
import { CardSurface } from "@/components/shared/card-surface";
import { EmptyState } from "@/components/shared/empty-state";
import { LinkButton } from "@/components/shared/link-button";
import { routes } from "@/config/routes";
import type { Job } from "@/core/types";
import { jobs } from "@/data/jobs";
import { useScreenings } from "@/hooks/useScreenings";
import { useSubmissions } from "@/hooks/useSubmissions";

function metricValue(value: number, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

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

  return <Badge label={labels[status]} variant={variants[status]} />;
}

export function JobsClient() {
  const [query, setQuery] = useState("");
  const { screeningsByJob } = useScreenings();
  const { submissionsByJob } = useSubmissions();

  const filteredJobs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const sorted = [...jobs].sort((a, b) => {
      const latestA = screeningsByJob[a.id]?.[0]?.createdAt ?? a.createdAt;
      const latestB = screeningsByJob[b.id]?.[0]?.createdAt ?? b.createdAt;
      return latestB.localeCompare(latestA);
    });

    if (!normalized) {
      return sorted;
    }

    return sorted.filter(
      (job) =>
        job.title.toLowerCase().includes(normalized) ||
        job.location.toLowerCase().includes(normalized),
    );
  }, [query, screeningsByJob]);

  const totalScreenings = jobs.reduce(
    (sum, job) => sum + (screeningsByJob[job.id]?.length ?? 0),
    0,
  );
  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (submissionsByJob[job.id]?.length ?? 0),
    0,
  );
  const completed = totalApplicants;
  const completionRate = metricValue(
    Math.round((completed / Math.max(totalApplicants + 2, 1)) * 100),
    0,
  );

  const columns: Column<Job>[] = [
    {
      key: "title",
      header: "Job Title",
      render: (job) => (
        <Link
          href={routes.job(job.id)}
          className="font-medium text-text-primary hover:text-brand-primary"
        >
          {job.title}
        </Link>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (job) => job.location,
    },
    {
      key: "screenings",
      header: "Screenings",
      render: (job) => screeningsByJob[job.id]?.length ?? 0,
    },
    {
      key: "applicants",
      header: "Applicants",
      render: (job) => submissionsByJob[job.id]?.length ?? 0,
    },
    {
      key: "employmentType",
      header: "Employment Type",
        render: (job) => job.employmentType,
    },
    {
      key: "status",
      header: "Status",
      render: (job) => jobStatusBadge(job.status),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (job) => (
        <Link
          href={routes.job(job.id)}
          aria-label={`Open ${job.title}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-muted hover:text-brand-primary"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[30px] font-semibold leading-tight text-text-primary md:text-[36px]">
            Jobs
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Manage job openings and screenings.
          </p>
        </div>
        <LinkButton
          href={routes.createScreening()}
          size="lg"
          className="w-full md:w-auto"
        >
          Create Phone Screening
        </LinkButton>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search jobs by title or location"
          className="w-full md:max-w-2/5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Active Jobs",
            value: jobs.filter((job) => job.status === "active").length,
            delta: "20%",
          },
          { label: "Total Screenings", value: totalScreenings, delta: "12%" },
          { label: "Completed", value: completed, delta: "25%" },
          { label: "Avg. Completion Rate", value: `${completionRate}%`, delta: "8%" },
        ].map((metric) => (
          <CardSurface key={metric.label} padding="panel">
            <p className="text-sm font-medium text-text-secondary">
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

      <CardSurface padding="none" className="overflow-hidden">
        {filteredJobs.length === 0 ? (
          <EmptyState
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            title="No jobs found"
            description="Try another title or location."
          />
        ) : (
          <DataTable
            columns={columns}
            rows={filteredJobs}
            rowKey={(job) => job.id}
            mobileRender={(job) => (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={routes.job(job.id)}
                      className="font-semibold text-text-primary"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-1 text-[13px] text-text-secondary">
                      {job.location}
                    </p>
                  </div>
                  {jobStatusBadge(job.status)}
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-md bg-bg-muted p-3">
                    <p className="text-lg font-semibold text-text-primary">
                      {screeningsByJob[job.id]?.length ?? 0}
                    </p>
                    <p className="text-[11px] text-text-muted">Screenings</p>
                  </div>
                  <div className="rounded-md bg-bg-muted p-3">
                    <p className="text-lg font-semibold text-text-primary">
                      {submissionsByJob[job.id]?.length ?? 0}
                    </p>
                    <p className="text-[11px] text-text-muted">Applicants</p>
                  </div>
                  <div className="rounded-md bg-bg-muted p-3">
                    <CheckCircle2 className="mx-auto h-5 w-5 text-text-muted" />
                    <p className="mt-1 text-[11px] text-text-muted">Status</p>
                  </div>
                </div>
                <LinkButton
                  href={routes.job(job.id)}
                  variant="outline"
                  className="w-full"
                >
                  Open Job
                </LinkButton>
              </div>
            )}
          />
        )}
      </CardSurface>
    </div>
  );
}
