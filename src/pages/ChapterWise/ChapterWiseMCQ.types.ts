// ChapterWiseMCQ.types.ts
import type { TestFormData, Question } from "../CreateTest/Create.types";

export interface ChapterWiseMCQProps {
  onBack: () => void;
  onQuestionsChange?: (questions: Question[]) => void;
  selectedQuestionId?: string;
  onPublish?: (questions: Question[]) => void;
  testFormData?: TestFormData;
  testId?: string;
  onEditTestDetails?: () => void;
  loading?: boolean;
}

export interface PublishState {
  publishType: 'now' | 'schedule';
  scheduleDate: string;
  scheduleTime: string;
  liveUntil: 'always' | '1week' | '2weeks' | '3weeks' | '1month' | 'custom';
  customEndDate: string;
  customEndTime: string;
  startDate: string;
  startTime: string;
}

export interface QuestionPayload {
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  difficulty: string;
  topic: string;
  sub_topic: string;
  subject: string;
}