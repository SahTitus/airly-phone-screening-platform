"use client";

import { Button } from "@/components/ui/button";

export default function JobsError({ reset }: { reset: () => void }) {
  return (
    <section className="app-card app-card-padding-panel text-center">
      <h1 className="text-xl font-semibold text-text-primary">
        Jobs could not load
      </h1>
      <p className="mt-2 text-sm text-text-secondary">Try again.</p>
      <Button type="button" className="mt-5" onClick={reset}>
        Retry
      </Button>
    </section>
  );
}
