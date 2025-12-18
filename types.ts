export type Role = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export type MasteryLevel = 'Low' | 'Medium' | 'High';

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  pathId: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  topics: string[]; // Topic IDs
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