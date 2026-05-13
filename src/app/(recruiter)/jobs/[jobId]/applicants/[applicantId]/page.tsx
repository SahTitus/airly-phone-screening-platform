import { notFound } from "next/navigation";

import { ApplicantDetailClient } from "@/components/applicants/applicant-detail-client";
import { getJob } from "@/lib/jobs";

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ jobId: string; applicantId: string }>;
}) {
  const { jobId, applicantId } = await params;
  const job = getJob(jobId);

  if (!job) {
    notFound();
  }

  return <ApplicantDetailClient job={job} applicantId={applicantId} />;
}
