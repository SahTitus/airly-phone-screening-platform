const scores: Record<string, number> = {
  "sample-applicant-alex": 78,
  "sample-applicant-priya": 72,
  "sample-applicant-maya": 84,
};

export function getSubmissionScore(id: string) {
  return scores[id] ?? 76;
}

export function getScoreTone(score: number) {
  if (score >= 70) {
    return "success" as const;
  }

  if (score >= 55) {
    return "warning" as const;
  }

  return "danger" as const;
}
