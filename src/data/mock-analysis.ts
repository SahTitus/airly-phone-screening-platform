import type { AnalysisResult } from "@/core/types";

export const mockAnalysis: AnalysisResult = {
  summary:
    "The response set is clear, practical, and aligned with the role expectations. The candidate gives enough detail to support a deeper technical interview.",
  strengths: [
    "Communicates tradeoffs with specific examples",
    "Shows practical ownership of work quality",
    "Connects decisions to user outcomes",
  ],
  concerns: [
    "Some answers need more measurable impact",
    "Follow up on collaboration under tight deadlines",
  ],
  recommendation: "advance",
};
