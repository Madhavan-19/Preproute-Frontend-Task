export interface TestFormData {
  testType?: string;
  subject?: string;
  testName?: string;
  topic?: string;
  subTopic?: string;
  exam?: string;
  year?: string;
  questionsCount?: number;
  duration?: number;
  difficultyLevel?: string;
  wrongAnswerMarks?: number;
  unattemptedMarks?: number;
  correctAnswerMarks?: number;
  noOfQuestions?: number;
  totalMarks?: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  solution: string;
  difficulty: string;
  topic: string;
  subTopic: string;
}

export interface Subject {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
  created_at: string;
  updated_at: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
  created_at: string;
  updated_at: string;
}