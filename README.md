````md
# Phone Screening Platform

Frontend take-home assessment for Remotown GmbH, National Service Placement 2026/2027.

## Stack

- Next.js App Router
- TypeScript
- React hooks
- Tailwind CSS v4
- Framer Motion
- localStorage persistence

## Run Locally

```bash
yarn install
yarn dev
````

Open `http://localhost:3000`.

Useful checks:

```bash
yarn typecheck
yarn build
```

## What I Built

* Recruiter jobs page at `/jobs`
* Create screening flow at `/jobs/create`
* Job detail page at `/jobs/[jobId]`
* Applicant response review at `/jobs/[jobId]/applicants/[applicantId]`
* Candidate screening flow at `/screening/[jobId]`
* Candidate confirmation page at `/screening/[jobId]/thank-you`

## Core Features

* Jobs are seeded in `src/data/jobs.ts`
* Recruiter-created screenings persist in localStorage
* Candidate submissions persist in localStorage under `aihrly_submissions`
* Recruiter pages read from the same localStorage data
* Generated questions can be edited, removed, reordered, and switched between text/audio types
* Candidate questions appear one at a time with validation and loading states
* Audio responses use a placeholder UI with text fallback
* Applicant analysis is mocked with a simulated loading state

## Approach

I focused mainly on keeping the experience clean, responsive, and easy to navigate on both recruiter and candidate flows. I used the Next.js App Router and tried to keep the codebase modular by breaking features into reusable components instead of large page files.

For persistence, I used localStorage so screenings and candidate submissions remain available after refresh without needing a backend. I also added small UX details like loading states, progress indicators, empty states, drag-and-drop question reordering, and simple transitions to make the flow feel more interactive.

## Tradeoffs

* No backend, authentication, database, real AI integration, or real audio recording
* Audio responses use a placeholder UI with a text fallback
* Some applicant data is seeded to help demonstrate recruiter review states
* Framer Motion is only used for lightweight transitions

```
```
