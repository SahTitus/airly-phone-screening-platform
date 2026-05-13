import type { ReactNode } from "react";

import { BrandMark } from "./brand-mark";

export function CandidateShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-bg-page px-3 py-8 text-text-primary sm:px-4 lg:px-6">
      <BrandMark centered className="mb-8" />
      {children}
    </main>
  );
}
