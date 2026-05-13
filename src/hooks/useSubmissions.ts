"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Answer, Submission } from "@/core/types";
import { createId } from "@/lib/id";
import { submissionRepository } from "@/services/submission-repository";

type CreateSubmissionInput = {
  jobId: string;
  screeningId: string;
  candidateName: string;
  candidateEmail: string;
  answers: Answer[];
};

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>(() =>
    submissionRepository.list(),
  );
  const [ready, setReady] = useState(true);

  const reload = useCallback(() => {
    setSubmissions(submissionRepository.list());
    setReady(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const createSubmission = useCallback(
    (input: CreateSubmissionInput) => {
      const submission: Submission = {
        id: createId("submission"),
        submittedAt: new Date().toISOString(),
        ...input,
      };

      submissionRepository.save(submission);
      reload();
      return submission;
    },
    [reload],
  );

  const submissionsByJob = useMemo(() => {
    return submissions.reduce<Record<string, Submission[]>>((acc, submission) => {
      const current = acc[submission.jobId] ?? [];
      acc[submission.jobId] = [...current, submission].sort((a, b) =>
        b.submittedAt.localeCompare(a.submittedAt),
      );
      return acc;
    }, {});
  }, [submissions]);

  return { submissions, submissionsByJob, createSubmission, reload, ready };
}
