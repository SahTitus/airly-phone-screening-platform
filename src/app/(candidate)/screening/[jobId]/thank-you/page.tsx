import { notFound } from "next/navigation";

import { ThankYouClient } from "@/components/candidate/thank-you-client";
import { getJob } from "@/lib/jobs";

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job) {
    notFound();
  }

  return <ThankYouClient job={job} />;
}
