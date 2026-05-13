import type { Screening, Submission } from "@/core/types";

const frontendQuestions = [
  {
    id: "job-001-q1",
    text: "Tell me about yourself.",
    responseType: "text",
    isCustom: false,
    order: 1,
  },
  {
    id: "job-001-q2",
    text: "Why are you interested in this role?",
    responseType: "text",
    isCustom: false,
    order: 2,
  },
  {
    id: "job-001-q3",
    text: "Describe your experience with React.",
    responseType: "audio",
    isCustom: false,
    order: 3,
  },
  {
    id: "job-001-q4",
    text: "How do you handle tight deadlines?",
    responseType: "text",
    isCustom: false,
    order: 4,
  },
  {
    id: "job-001-q5",
    text: "Solve this problem: two sum.",
    responseType: "text",
    isCustom: false,
    order: 5,
  },
  {
    id: "job-001-q6",
    text: "Do you have any questions for us?",
    responseType: "text",
    isCustom: false,
    order: 6,
  },
] satisfies Screening["questions"];

const designQuestions = [
  {
    id: "job-002-q1",
    text: "Describe a product interface you think works well.",
    responseType: "text",
    isCustom: false,
    order: 1,
  },
  {
    id: "job-002-q2",
    text: "How do you handle unclear feedback?",
    responseType: "audio",
    isCustom: false,
    order: 2,
  },
  {
    id: "job-002-q3",
    text: "What details do you check before handoff?",
    responseType: "text",
    isCustom: false,
    order: 3,
  },
  {
    id: "job-002-q4",
    text: "How would you improve a crowded dashboard?",
    responseType: "text",
    isCustom: false,
    order: 4,
  },
  {
    id: "job-002-q5",
    text: "What design tools help you move quickly?",
    responseType: "text",
    isCustom: false,
    order: 5,
  },
] satisfies Screening["questions"];

const successQuestions = [
  {
    id: "job-003-q1",
    text: "Tell us about a time you handled a difficult customer conversation.",
    responseType: "text",
    isCustom: false,
    order: 1,
  },
  {
    id: "job-003-q2",
    text: "How do you prioritize multiple customer issues?",
    responseType: "audio",
    isCustom: false,
    order: 2,
  },
  {
    id: "job-003-q3",
    text: "What signals tell you an account needs attention?",
    responseType: "text",
    isCustom: false,
    order: 3,
  },
  {
    id: "job-003-q4",
    text: "How would you explain a delayed resolution?",
    responseType: "text",
    isCustom: false,
    order: 4,
  },
  {
    id: "job-003-q5",
    text: "How do you document customer feedback?",
    responseType: "text",
    isCustom: false,
    order: 5,
  },
] satisfies Screening["questions"];

const dataQuestions = [
  {
    id: "job-004-q1",
    text: "How do you check whether a dataset is ready for reporting?",
    responseType: "text",
    isCustom: false,
    order: 1,
  },
  {
    id: "job-004-q2",
    text: "Describe a data quality issue you fixed.",
    responseType: "audio",
    isCustom: false,
    order: 2,
  },
  {
    id: "job-004-q3",
    text: "What spreadsheet workflows do you use often?",
    responseType: "text",
    isCustom: false,
    order: 3,
  },
  {
    id: "job-004-q4",
    text: "How do you handle repetitive operational checks?",
    responseType: "text",
    isCustom: false,
    order: 4,
  },
  {
    id: "job-004-q5",
    text: "What do you verify before sharing a report?",
    responseType: "text",
    isCustom: false,
    order: 5,
  },
] satisfies Screening["questions"];

export const sampleScreenings: Screening[] = [
  {
    id: "sample-screening-frontend",
    jobId: "job-001",
    status: "active",
    createdAt: "2026-05-13T09:30:00.000Z",
    questions: frontendQuestions,
  },
  {
    id: "sample-screening-design",
    jobId: "job-002",
    status: "active",
    createdAt: "2026-05-11T14:15:00.000Z",
    questions: designQuestions,
  },
  {
    id: "sample-screening-success",
    jobId: "job-003",
    status: "draft",
    createdAt: "2026-05-10T10:00:00.000Z",
    questions: successQuestions,
  },
  {
    id: "sample-screening-data",
    jobId: "job-004",
    status: "draft",
    createdAt: "2026-05-09T13:25:00.000Z",
    questions: dataQuestions,
  },
];

export const sampleSubmissions: Submission[] = [
  {
    id: "sample-applicant-alex",
    jobId: "job-001",
    screeningId: "sample-screening-frontend",
    candidateName: "Alex Johnson",
    candidateEmail: "alex.johnson@email.com",
    submittedAt: "2026-05-13T07:30:00.000Z",
    answers: [
      {
        questionId: "job-001-q1",
        responseType: "text",
        value:
          "I am a frontend developer with three years of experience building React applications for product teams.",
      },
      {
        questionId: "job-001-q2",
        responseType: "text",
        value:
          "This role matches my interest in polished SaaS interfaces, strong component systems, and practical full-stack collaboration.",
      },
      {
        questionId: "job-001-q3",
        responseType: "audio",
        value:
          "I have built several single-page applications using React, hooks, Redux, Context API, and React Router. My recent work focused on performance, code splitting, and reusable UI foundations.",
      },
      {
        questionId: "job-001-q4",
        responseType: "text",
        value:
          "I clarify the deadline, split the work into critical and optional pieces, communicate risk early, and protect quality on the user-facing path.",
      },
      {
        questionId: "job-001-q5",
        responseType: "text",
        value:
          "I would use a hash map to store visited values and their indexes, then check the complement for each number in one pass.",
      },
      {
        questionId: "job-001-q6",
        responseType: "text",
        value:
          "I would like to understand the team workflow, review process, and the product areas this role supports first.",
      },
    ],
  },
  {
    id: "sample-applicant-priya",
    jobId: "job-001",
    screeningId: "sample-screening-frontend",
    candidateName: "Priya Sharma",
    candidateEmail: "priya.sharma@email.com",
    submittedAt: "2026-05-13T04:45:00.000Z",
    answers: [
      {
        questionId: "job-001-q1",
        responseType: "text",
        value:
          "I build responsive interfaces with React and TypeScript and enjoy improving complex workflows.",
      },
      {
        questionId: "job-001-q2",
        responseType: "text",
        value:
          "The NSS role is a good fit because I want hands-on product engineering experience in a remote team.",
      },
      {
        questionId: "job-001-q3",
        responseType: "audio",
        value:
          "My React experience includes form-heavy dashboards, API-driven pages, reusable components, and performance checks with browser tools.",
      },
      {
        questionId: "job-001-q4",
        responseType: "text",
        value:
          "I focus on the essential deliverable, keep scope visible, and ask for feedback before the work goes too far.",
      },
      {
        questionId: "job-001-q5",
        responseType: "text",
        value:
          "A map gives constant-time complement lookup, which keeps the solution linear.",
      },
      {
        questionId: "job-001-q6",
        responseType: "text",
        value:
          "I would ask about the design system and how frontend quality is reviewed.",
      },
    ],
  },
  {
    id: "sample-applicant-maya",
    jobId: "job-002",
    screeningId: "sample-screening-design",
    candidateName: "Maya Mensah",
    candidateEmail: "maya.mensah@email.com",
    submittedAt: "2026-05-12T16:20:00.000Z",
    answers: [
      {
        questionId: "job-002-q1",
        responseType: "text",
        value:
          "Linear works well because the navigation stays simple while dense issue details remain easy to scan.",
      },
      {
        questionId: "job-002-q2",
        responseType: "audio",
        value:
          "I ask what decision the feedback should support, then turn vague notes into specific design criteria.",
      },
      {
        questionId: "job-002-q3",
        responseType: "text",
        value:
          "I check states, spacing, token usage, responsive behavior, labels, and interaction details before handoff.",
      },
      {
        questionId: "job-002-q4",
        responseType: "text",
        value:
          "I would group related metrics, reduce competing borders, clarify the primary action, and make filters easier to scan.",
      },
      {
        questionId: "job-002-q5",
        responseType: "text",
        value:
          "Figma components, variants, auto layout, and clear naming help me move quickly without losing consistency.",
      },
    ],
  },
  {
    id: "sample-applicant-kwame",
    jobId: "job-003",
    screeningId: "sample-screening-success",
    candidateName: "Kwame Boateng",
    candidateEmail: "kwame.boateng@email.com",
    submittedAt: "2026-05-12T11:10:00.000Z",
    answers: [
      {
        questionId: "job-003-q1",
        responseType: "text",
        value:
          "I once handled an upset customer by first confirming the issue, then giving a clear update path and following through on every promised step.",
      },
      {
        questionId: "job-003-q2",
        responseType: "audio",
        value:
          "I rank issues by customer impact, urgency, contract risk, and whether another team is blocked.",
      },
      {
        questionId: "job-003-q3",
        responseType: "text",
        value:
          "Repeated support tickets, low product usage, delayed responses, and billing concerns usually show that an account needs attention.",
      },
      {
        questionId: "job-003-q4",
        responseType: "text",
        value:
          "I would acknowledge the delay, explain the next concrete step, give a realistic update time, and stay available.",
      },
      {
        questionId: "job-003-q5",
        responseType: "text",
        value:
          "I summarize the customer problem, quote the impact, tag the product area, and include any reproduction details.",
      },
    ],
  },
  {
    id: "sample-applicant-ama",
    jobId: "job-004",
    screeningId: "sample-screening-data",
    candidateName: "Ama Owusu",
    candidateEmail: "ama.owusu@email.com",
    submittedAt: "2026-05-11T09:40:00.000Z",
    answers: [
      {
        questionId: "job-004-q1",
        responseType: "text",
        value:
          "I check row counts, missing values, duplicate keys, expected ranges, and whether source timestamps match the reporting period.",
      },
      {
        questionId: "job-004-q2",
        responseType: "audio",
        value:
          "I found duplicate transaction rows caused by a repeated export and fixed the report by deduplicating with stable IDs.",
      },
      {
        questionId: "job-004-q3",
        responseType: "text",
        value:
          "I use pivot tables, lookups, conditional formatting, validation rules, and structured exports for recurring reports.",
      },
      {
        questionId: "job-004-q4",
        responseType: "text",
        value:
          "I turn repeated checks into documented templates and review only the exceptions manually.",
      },
      {
        questionId: "job-004-q5",
        responseType: "text",
        value:
          "I verify totals, filters, labels, date ranges, and whether the report answers the original business question.",
      },
    ],
  },
];
