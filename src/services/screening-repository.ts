import { storageKeys } from "@/config/storage";
import type { Screening } from "@/core/types";
import { sampleScreenings } from "@/data/sample-screening-data";
import { readStorageList, writeStorageList } from "@/lib/storage";

function sortScreenings(screenings: Screening[]) {
  return [...screenings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const screeningRepository = {
  list() {
    const stored = readStorageList<Screening>(storageKeys.screenings);
    const storedIds = new Set(stored.map((screening) => screening.id));
    // merge seed fallback
    return sortScreenings([
      ...stored,
      ...sampleScreenings.filter((screening) => !storedIds.has(screening.id)),
    ]);
  },

  listByJob(jobId: string) {
    return this.list().filter((screening) => screening.jobId === jobId);
  },

  latestForJob(jobId: string) {
    return this.listByJob(jobId)[0] ?? null;
  },

  save(screening: Screening) {
    const screenings = readStorageList<Screening>(storageKeys.screenings);
    const next = screenings.filter((item) => item.id !== screening.id);
    // keep seeds immutable
    writeStorageList(storageKeys.screenings, sortScreenings([screening, ...next]));
  },
};
