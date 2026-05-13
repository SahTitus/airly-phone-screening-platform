import { notFound } from "next/navigation";

import { CandidateScreeningClient } from "@/components/candidate/screening-client";
import { getJob } from "@/lib/jobs";

export default async function ScreeningPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job) {
    notFound();
  }

  return <CandidateScreeningClient job={job} />;
}
