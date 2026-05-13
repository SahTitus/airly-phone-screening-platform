import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-page px-3">
      <section className="app-card app-card-padding-panel w-full max-w-md text-center">
        <p className="app-label">Not found</p>
        <h1 className="mt-3 text-2xl font-semibold text-text-primary">
          Page unavailable
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Check the link and try again.
        </p>
        <Link
          href="/jobs"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-brand-primary px-5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-deep"
        >
          Back to jobs
        </Link>
      </section>
    </main>
  );
}
