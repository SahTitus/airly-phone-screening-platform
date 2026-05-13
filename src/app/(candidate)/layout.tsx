import type { ReactNode } from "react";

import { CandidateShell } from "@/components/layout/candidate-shell";

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return <CandidateShell>{children}</CandidateShell>;
}
