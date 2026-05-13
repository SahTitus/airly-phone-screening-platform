import { notFound } from "next/navigation";

import { JobDetailClient } from "@/components/jobs/job-detail-client";
import { getJob } from "@/lib/jobs";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job) {
    notFound();
  }

  return <JobDetailClient job={job} />;
}
