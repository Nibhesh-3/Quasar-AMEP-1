
import { MasteryRecord, Topic, Question, QuizResult, User, LearningPath } from '../types';
// Fix: Import GoogleGenAI and Type to enable real-time AI feedback generation
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initialize the Google GenAI client using the provided environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const PATHS: LearningPath[] = [
  { id: 'path-ai', name: 'AI & Data Science', description: 'Neural networks and predictive modeling.', topics: ['alg-01', 'ml-01'] },
  { id: 'path-aero', name: 'Aerospace Engineering', description: 'Orbital mechanics and propulsion systems.', topics: ['aero-01', 'aero-02'] },
  { id: 'path-elec', name: 'Electrical Engineering', description: 'Circuit analysis and digital logic.', topics: ['elec-01', 'elec-02'] },
  { id: 'path-mech', name: 'Mechanical Engineering', description: 'Thermodynamics and material science.', topics: ['mech-01', 'mech-02'] },
  { id: 'path-civil', name: 'Civil Engineering', description: 'Structural mechanics and urban planning.', topics: ['civil-01', 'civil-02'] },
];

export const TOPICS: Topic[] = [
  { id: 'alg-01', pathId: 'path-ai', name: 'Advanced Algebra', icon: 'Calculator', description: 'Linear equations for AI systems.' },
  { id: 'ml-01', pathId: 'path-ai', name: 'Machine Learning Basics', icon: 'Cpu', description: 'Training your first model.' },
  { id: 'aero-01', pathId: 'path-aero', name: 'Fluid Dynamics', icon: 'Wind', description: 'Lift and drag coefficients.' },
  { id: 'elec-01', pathId: 'path-elec', name: 'Circuit Theory', icon: 'Zap', description: 'KVL, KCL, and nodal analysis.' },
  { id: 'mech-01', pathId: 'path-mech', name: 'Thermodynamics', icon: 'Flame', description: 'Entropy and heat cycles.' },
  { id: 'civil-01', pathId: 'path-civil', name: 'Structural Analysis', icon: 'Building', description: 'Stress and strain in trusses.' },
];

const QUESTIONS_DB: Record<string, Question[]> = {
  'alg-01': [
    { id: 'q1', text: 'Solve for x: 5x + 15 = 40', options: ['5', '2', '3', '7'], correctAnswer: 0 },
  ],
  'aero-01': [
    { id: 'ae1', text: 'Which principle explains lift?', options: ['Bernoulli', 'Newton', 'Pascal', 'Faraday'], correctAnswer: 0 },
  ],
  'elec-01': [
    { id: 'el1', text: 'What is the unit of impedance?', options: ['Henry', 'Farad', 'Ohm', 'Watt'], correctAnswer: 2 },
  ],
  'default': [
    { id: 'd1', text: 'General Assessment Question', options: ['Alpha', 'Beta', 'Gamma', 'Delta'], correctAnswer: 0 },
  ]
};

const STORAGE_KEY = 'amep_v3_db';
const AUTH_KEY = 'amep_v3_session';
const USERS_KEY = 'amep_v3_users';

export const getAuthUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const registerUser = (user: User): { success: boolean; message: string } => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (users.find((u: User) => u.email === user.email)) {
    return { success: false, message: 'Identity exists in Nexus.' };
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return { success: true, message: 'Initialization complete.' };
};

export const loginUser = (email: string): { success: boolean; user?: User; message: string } => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find((u: User) => u.email === email);
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { success: true, user, message: 'Sync successful.' };
  }
  return { success: false, message: 'Identity not found.' };
};

export const saveAuthUser = (user: User | null) => {
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
};

export const getMasteryRecords = (studentId: string): MasteryRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const db = stored ? JSON.parse(stored) : {};
  return db[studentId] || TOPICS.map(t => ({
    topicId: t.id,
    score: 0,
    level: 'Low',
    attempts: 0,
    lastUpdated: new Date().toISOString()
  }));
};

export const saveMasteryRecord = (studentId: string, record: MasteryRecord) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const db = stored ? JSON.parse(stored) : {};
  if (!db[studentId]) db[studentId] = getMasteryRecords(studentId);
  db[studentId] = db[studentId].map((r: MasteryRecord) => r.topicId === record.topicId ? record : r);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const getQuestions = async (topicId: string): Promise<Question[]> => {
  await new Promise(r => setTimeout(r, 600));
  return QUESTIONS_DB[topicId] || QUESTIONS_DB['default'];
};

export const submitQuiz = async (
  studentId: string, 
  topicId: string, 
  correctCount: number, 
  totalQuestions: number,
  timeTakenSec: number,
  timeLimitSec: number
): Promise<QuizResult> => {
  await new Promise(r => setTimeout(r, 800));
  const accuracy = (correctCount / totalQuestions) * 100;
  const timeRatio = Math.max(0, (timeLimitSec - timeTakenSec) / timeLimitSec); 
  const timeEfficiency = timeRatio * 100;
  
  const currentRecords = getMasteryRecords(studentId);
  const prevRecord = currentRecords.find(r => r.topicId === topicId);
  const attempts = (prevRecord?.attempts || 0) + 1;
  const consistency = Math.min(100, 75 + (attempts * 7));

  const finalScore = Math.round((accuracy * 0.6) + (timeEfficiency * 0.2) + (consistency * 0.2));

  let level: 'Low' | 'Medium' | 'High' = finalScore < 45 ? 'Low' : finalScore < 80 ? 'Medium' : 'High';
  
  // Fix: Generate intelligent feedback and next steps using Gemini AI
  let feedback = level === 'High' ? "Exceptional! Cognitive sync at 99.9%." : "Calibrating synaptic paths.";
  let nextStep = level === 'High' ? "Elite Labs Access" : "Foundation Review";

  try {
    const topic = TOPICS.find(t => t.id === topicId);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate the student's mastery in ${topic?.name || 'this segment'}. 
        Stats: Accuracy ${accuracy}%, Time Efficiency ${timeEfficiency}%, consistency score ${consistency}%, overall score ${finalScore}. 
        Provide a concise futuristic analysis and a concrete next learning action.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING },
            nextStep: { type: Type.STRING },
          },
          required: ["feedback", "nextStep"],
        },
      },
    });

    const aiAnalysis = JSON.parse(response.text || '{}');
    if (aiAnalysis.feedback) feedback = aiAnalysis.feedback;
    if (aiAnalysis.nextStep) nextStep = aiAnalysis.nextStep;
  } catch (err) {
    console.error("Cognitive analysis failed:", err);
  }

  const result = {
    accuracy,
    timeEfficiency,
    consistency,
    finalScore,
    level,
    feedback,
    nextStep
  };

  saveMasteryRecord(studentId, {
    topicId, score: finalScore, level, attempts, lastUpdated: new Date().toISOString()
  });

  return result;
};

export const getTeacherAnalytics = async () => {
  await new Promise(r => setTimeout(r, 500));
  return [
    { id: '1', name: 'Sarah Connor', avgScore: 92, velocity: 88, risk: false, weakTopic: 'None' },
    { id: '2', name: 'John Doe', avgScore: 41, velocity: 32, risk: true, weakTopic: 'Data Structures' },
  ];
};
