import { storageKeys } from "@/config/storage";
import type { Submission } from "@/core/types";
import { sampleSubmissions } from "@/data/sample-screening-data";
import { readStorageList, writeStorageList } from "@/lib/storage";

function sortSubmissions(submissions: Submission[]) {
  return [...submissions].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export const submissionRepository = {
  list() {
    const stored = readStorageList<Submission>(storageKeys.submissions);
    const storedIds = new Set(stored.map((submission) => submission.id));
    // merge seed fallback
    return sortSubmissions([
      ...stored,
      ...sampleSubmissions.filter((submission) => !storedIds.has(submission.id)),
    ]);
  },

  listByJob(jobId: string) {
    return this.list().filter((submission) => submission.jobId === jobId);
  },

  findById(id: string) {
    return this.list().find((submission) => submission.id === id) ?? null;
  },

  save(submission: Submission) {
    const submissions = readStorageList<Submission>(storageKeys.submissions);
    const next = submissions.filter((item) => item.id !== submission.id);
    // keep seeds immutable
    writeStorageList(storageKeys.submissions, sortSubmissions([submission, ...next]));
  },
};
