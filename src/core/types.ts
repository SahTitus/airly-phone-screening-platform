export type EmploymentType = "Full-time" | "Part-time" | "Internship" | "NSS";

export type JobStatus = "active" | "draft" | "closed";

export type ResponseType = "text" | "audio";

export type ScreeningStatus = "active" | "draft";

export type Recommendation = "advance" | "reject" | "hold";

export interface Job {
  id: string;
  title: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  description: string;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  responseType: ResponseType;
  isCustom: boolean;
  order: number;
}

export interface Screening {
  id: string;
  jobId: string;
  status: ScreeningStatus;
  createdAt: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  responseType: ResponseType;
  value: string;
}

export interface Submission {
  id: string;
  jobId: string;
  screeningId: string;
  candidateName: string;
  candidateEmail: string;
  answers: Answer[];
  submittedAt: string;
}

export interface AnalysisResult {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendation: Recommendation;
}
