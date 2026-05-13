export const routes = {
  home: () => "/",
  jobs: () => "/jobs",
  createScreening: (jobId?: string) =>
    jobId ? `/jobs/create?jobId=${jobId}` : "/jobs/create",
  job: (jobId: string) => `/jobs/${jobId}`,
  applicant: (jobId: string, applicantId: string) =>
    `/jobs/${jobId}/applicants/${applicantId}`,
  screening: (jobId: string) => `/screening/${jobId}`,
  thankYou: (jobId: string) => `/screening/${jobId}/thank-you`,
} as const;

export const recruiterNavItems = [
  { label: "Jobs", href: routes.jobs() },
  { label: "Create Screening", href: routes.createScreening() },
] as const;
