import type { Question, ResponseType } from "@/core/types";
import { createId } from "@/lib/id";

const questionBank: Record<string, string[]> = {
  "job-001": [
    "Walk us through a recent project where you built a full-stack feature from start to finish.",
    "How do you approach debugging a production issue with limited information?",
    "What frameworks and tools do you prefer for frontend and backend development, and why?",
    "Describe how you handle state management in a complex frontend application.",
    "How do you ensure your code is scalable, maintainable, and testable?",
    "Do you have any questions for me about the role or our engineering team?",
  ],
  "job-002": [
    "Describe a product interface you think works well and why.",
    "How do you handle unclear feedback from stakeholders?",
    "What details do you check before handing a design to engineering?",
    "How would you improve a crowded dashboard screen?",
    "Tell us how you validate whether a design is easy to use.",
    "What design tools or workflows help you move quickly?",
  ],
  "job-003": [
    "Tell us about a time you handled a difficult customer conversation.",
    "How do you prioritize multiple customer issues at the same time?",
    "What signals tell you a customer account needs attention?",
    "How would you explain a delayed resolution to a customer?",
    "Describe how you document customer feedback for product teams.",
    "What would make you successful in this role during the first month?",
  ],
  "job-004": [
    "How do you check whether a dataset is ready for reporting?",
    "Describe a time you found and fixed a data quality issue.",
    "What spreadsheet or database workflows do you use often?",
    "How do you handle repetitive operational checks?",
    "What would you do if two reports showed conflicting numbers?",
    "What details do you verify before sharing a report?",
  ],
};

const fallbackQuestions = [
  "Tell us why this role is a strong match for your experience.",
  "Describe a recent work challenge and how you handled it.",
  "What tools or workflows help you stay organized?",
  "How do you communicate progress when work is uncertain?",
  "What would you want the team to know before the next interview?",
];

export function generateQuestions(jobId: string): Question[] {
  const source = questionBank[jobId] ?? fallbackQuestions;

  return source.map((text, index) => ({
    id: createId('question'),
    text,
    responseType: index === 1 || index === source.length - 2 ? "audio" : ("text" as ResponseType),
    isCustom: false,
    order: index + 1,
  }));
}
