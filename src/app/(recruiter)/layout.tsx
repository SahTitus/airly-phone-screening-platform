import type { ReactNode } from "react";

import { RecruiterShell } from "@/components/layout/recruiter-shell";

export default function RecruiterLayout({ children }: { children: ReactNode }) {
  return <RecruiterShell>{children}</RecruiterShell>;
}
