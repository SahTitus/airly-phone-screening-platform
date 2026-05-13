"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Question, Screening } from "@/core/types";
import { createId } from "@/lib/id";
import { screeningRepository } from "@/services/screening-repository";

export function useScreenings() {
  const [screenings, setScreenings] = useState<Screening[]>(() =>
    screeningRepository.list(),
  );
  const [ready, setReady] = useState(true);

  const reload = useCallback(() => {
    setScreenings(screeningRepository.list());
    setReady(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveScreening = useCallback(
    (jobId: string, questions: Question[], status: Screening["status"] = "active") => {
      const screening: Screening = {
        id: createId("screening"),
        jobId,
        status,
        createdAt: new Date().toISOString(),
        questions: questions.map((question, index) => ({
          ...question,
          order: index + 1,
        })),
      };

      screeningRepository.save(screening);
      reload();
      return screening;
    },
    [reload],
  );

  const screeningsByJob = useMemo(() => {
    return screenings.reduce<Record<string, Screening[]>>((acc, screening) => {
      const current = acc[screening.jobId] ?? [];
      acc[screening.jobId] = [...current, screening].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
      return acc;
    }, {});
  }, [screenings]);

  return { screenings, screeningsByJob, saveScreening, reload, ready };
}
