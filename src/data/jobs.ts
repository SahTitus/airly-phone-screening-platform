import type { Job } from "@/core/types";

export const jobs: Job[] = [
  {
    id: "job-001",
    title: "Frontend-Focused Full Stack Developer (NSS)",
    location: "Remote, Ghana",
    employmentType: "NSS",
    status: "active",
    description:
      "Build responsive web experiences in Next.js, collaborate across the stack when needed, and ship high-quality features for hiring teams.",
    createdAt: "2026-05-01T09:30:00.000Z",
  },
  {
    id: "job-002",
    title: "Product Design Intern",
    location: "Accra, Ghana",
    employmentType: "Internship",
    status: "active",
    description:
      "Support product research, interface design, and high-fidelity SaaS workflows across Aihrly hiring tools.",
    createdAt: "2026-04-28T14:00:00.000Z",
  },
  {
    id: "job-003",
    title: "Customer Success Associate",
    location: "Kumasi, Ghana",
    employmentType: "Full-time",
    status: "draft",
    description:
      "Guide customers through onboarding, issue resolution, and account health conversations with clear communication.",
    createdAt: "2026-04-24T11:20:00.000Z",
  },
  {
    id: "job-004",
    title: "Data Operations Analyst",
    location: "Remote, Ghana",
    employmentType: "Part-time",
    status: "closed",
    description:
      "Maintain structured datasets, review data quality, and prepare operational reports for internal teams.",
    createdAt: "2026-04-18T15:45:00.000Z",
  },
];
