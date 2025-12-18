
export type Role = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export type MasteryLevel = 'Low' | 'Medium' | 'High';

export interface Resource {
  type: 'diagram' | 'video' | 'pdf' | 'link';
  title: string;
  url: string;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  pathId: string;
  content?: string; // Markdown or Rich Text notes
  diagrams?: string[]; // Array of base64 or URL strings for visual aids
  resources?: Resource[];
  examFocus?: ('MU' | 'GATE' | 'ISRO' | 'ESE')[];
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  topics: string[]; // Topic IDs
  category: 'MU Syllabus' | 'Competitive' | 'Core Engineering';
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface MasteryRecord {
  topicId: string;
  score: number;
  level: MasteryLevel;
  attempts: number;
  lastUpdated: string;
}

export interface QuizResult {
  accuracy: number;
  timeEfficiency: number;
  consistency: number;
  finalScore: number;
  level: MasteryLevel;
  feedback: string;
  nextStep: string;
}
