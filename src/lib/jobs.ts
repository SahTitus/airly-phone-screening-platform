import { jobs } from "@/data/jobs";

export function getJob(jobId: string) {
  return jobs.find((job) => job.id === jobId) ?? null;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
