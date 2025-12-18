
import { MasteryRecord, Topic, Question, QuizResult, User, LearningPath } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FULL SYSTEMATIC CURRICULUM
export const PATHS: LearningPath[] = [
  { id: 'mu-sem1', name: 'MU: Semester 1 (Applied Sciences)', category: 'MU Syllabus', description: 'Applied Maths-I, Physics-I, Mechanics, BEE.', topics: ['mu-m1', 'mu-p1', 'mu-mech', 'mu-bee', 'mu-evs'] },
  { id: 'mu-sem2', name: 'MU: Semester 2 (Engineering Core)', category: 'MU Syllabus', description: 'Maths-II, Physics-II, Graphics, C Programming.', topics: ['mu-m2', 'mu-p2', 'mu-eg', 'mu-cp', 'mu-chem2'] },
  { id: 'mu-sem3', name: 'MU: Semester 3 (CS/IT Core)', category: 'MU Syllabus', description: 'DS, DM, COA, DBMS, DLCA.', topics: ['mu-ds', 'mu-dm', 'mu-coa', 'mu-dbms', 'mu-dlca'] },
  { id: 'mu-sem4', name: 'MU: Semester 4 (Analysis)', category: 'MU Syllabus', description: 'Algorithms, OS, Microprocessors, Maths-IV.', topics: ['mu-aoa', 'mu-os', 'mu-mp', 'mu-m4', 'mu-cn'] },
  { id: 'mu-sem5', name: 'MU: Semester 5 (Theory & SE)', category: 'MU Syllabus', description: 'TOC, SE, Computer Network, PCOM.', topics: ['mu-toc', 'mu-se', 'mu-cn5', 'mu-pcom'] },
  { id: 'mu-sem6', name: 'MU: Semester 6 (Intelligent Systems)', category: 'MU Syllabus', description: 'AI, CSS, Distributed Systems, QA.', topics: ['mu-ai', 'mu-css', 'mu-ds6', 'mu-qa'] },
  { id: 'mu-sem7', name: 'MU: Semester 7 (Cloud & Big Data)', category: 'MU Syllabus', description: 'MCC, Big Data, Info Security.', topics: ['mu-mcc', 'mu-bd', 'mu-is7'] },
  { id: 'mu-sem8', name: 'MU: Semester 8 (Deep Tech)', category: 'MU Syllabus', description: 'NLP, Distributed Computing, Finance Engineering.', topics: ['mu-nlp', 'mu-dc8', 'mu-fe'] },
  { id: 'gate-2025', name: 'GATE 2025: Full Syllabus Series', category: 'Competitive', description: 'Mock tests covering all CS subjects at GATE difficulty.', topics: ['gate-full-1', 'gate-full-2', 'gate-maths'] },
  { id: 'isro-scientist', name: 'ISRO: Scientist-SC Program', category: 'Competitive', description: 'Satellite Comm, Radar Engineering, Control Systems.', topics: ['isro-ctrl', 'isro-radar', 'isro-sat'] }
];

export const TOPICS: Topic[] = [
  { 
    id: 'mu-os', pathId: 'mu-sem4', name: 'Operating Systems', icon: 'Terminal', 
    description: 'Process management, Deadlocks, Memory, and File Systems.', 
    examFocus: ['MU', 'GATE', 'ISRO'],
    content: '## Operating Systems (OS) Syllabus\nFocus on CPU Scheduling, Deadlocks (Banker\'s Algorithm), and Virtual Memory (Page Replacement).\n\n### Key Diagrams:\n- Process State Transition Diagram\n- Logical to Physical Address Translation\n- Inverted Page Table Structure',
    resources: [{ type: 'diagram', title: 'OS Kernel Architecture', url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600' }]
  },
  { id: 'mu-dbms', pathId: 'mu-sem3', name: 'Database Management', icon: 'Database', description: 'ER Diagrams, Normalization, SQL, and Transactions.', examFocus: ['MU', 'GATE'] },
  { id: 'mu-ds', pathId: 'mu-sem3', name: 'Data Structures', icon: 'Layers', description: 'Stacks, Queues, Graphs, Trees, and Sorting.', examFocus: ['MU', 'GATE'] },
  { id: 'mu-toc', pathId: 'mu-sem5', name: 'Theory of Computation', icon: 'Code', description: 'Automata, CFG, Turing Machines, NP-Completeness.', examFocus: ['GATE', 'ISRO'] },
  { id: 'mu-coa', pathId: 'mu-sem3', name: 'Computer Org & Arch', icon: 'Cpu', description: 'Pipelining, Cache Mapping, I/O Interfacing.', examFocus: ['MU', 'GATE'] },
  { id: 'mu-ai', pathId: 'mu-sem6', name: 'Artificial Intelligence', icon: 'Brain', description: 'A* Search, Logic, Neural Nets, Bayes Theorem.', examFocus: ['MU'] },
  { id: 'gate-full-1', pathId: 'gate-2025', name: 'GATE CS: Full Length Mock-1', icon: 'Target', description: 'Comprehensive 65-question pattern mock.', examFocus: ['GATE'] }
];

// NEURAL GENERATION ENGINE: Fetches 50 questions per topic
export const getQuestions = async (topicId: string): Promise<Question[]> => {
  const topic = TOPICS.find(t => t.id === topicId) || { name: topicId };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate exactly 50 challenging multiple-choice questions for the engineering subject: ${topic.name}. 
      Target Difficulty: ${topicId.includes('gate') ? 'Extremely High (GATE Level)' : 'Moderate (Mumbai University Level)'}.
      Format as a JSON array where each object has: "id" (string), "text" (string), "options" (array of 4 strings), and "correctAnswer" (number 0-3).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.NUMBER }
            }
          }
        }
      }
    });

    const generated = JSON.parse(response.text || '[]');
    if (generated.length > 0) return generated;
  } catch (err) {
    console.warn("AI Generation offline, falling back to cached seed questions.");
  }

  // Fallback Seed
  return Array.from({ length: 50 }, (_, i) => ({
    id: `q-${topicId}-${i}`,
    text: `Systematic Diagnostic Query ${i+1} for ${topic.name}: Evaluate the complex behavioral parameters of this neural node.`,
    options: ['Option Alpha', 'Option Beta', 'Option Gamma', 'Option Delta'],
    correctAnswer: Math.floor(Math.random() * 4)
  }));
};

export const submitQuiz = async (
  studentId: string, 
  topicId: string, 
  correctCount: number, 
  totalQuestions: number,
  timeTakenSec: number,
  timeLimitSec: number
): Promise<QuizResult> => {
  const accuracy = (correctCount / totalQuestions) * 100;
  const timeEfficiency = Math.max(0, ((timeLimitSec - timeTakenSec) / timeLimitSec) * 100);
  
  const currentRecords = getMasteryRecords(studentId);
  const prevRecord = currentRecords.find(r => r.topicId === topicId);
  const attempts = (prevRecord?.attempts || 0) + 1;
  const consistency = Math.min(100, 70 + (attempts * 5));

  const finalScore = Math.round((accuracy * 0.7) + (timeEfficiency * 0.3));
  let level: 'Low' | 'Medium' | 'High' = finalScore < 40 ? 'Low' : finalScore < 75 ? 'Medium' : 'High';

  const result = {
    accuracy,
    timeEfficiency,
    consistency,
    finalScore,
    level,
    feedback: "Analyzing synaptic sync results...",
    nextStep: "Calibrating next mastery node..."
  };

  try {
    const aiRes = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Student Score: ${finalScore}%. Accuracy: ${accuracy}%. Subject: ${topicId}. 
      Give 1 sentence of futuristic technical feedback and 1 specific next step for MU/GATE prep.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { feedback: { type: Type.STRING }, nextStep: { type: Type.STRING } }
        }
      }
    });
    const analysis = JSON.parse(aiRes.text || '{}');
    result.feedback = analysis.feedback || result.feedback;
    result.nextStep = analysis.nextStep || result.nextStep;
  } catch (e) {}

  saveMasteryRecord(studentId, {
    topicId, score: finalScore, level, attempts, lastUpdated: new Date().toISOString()
  });

  return result;
};

// PERSISTENCE LOGIC
const STORAGE_KEY = 'amep_v6_db';
const AUTH_KEY = 'amep_v6_session';
const USERS_KEY = 'amep_v6_users';

export const getAuthUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveAuthUser = (user: User | null) => {
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
};

// Update: Defined explicit return types for registerUser to fix property access errors in components
export const registerUser = (user: User): { success: true } | { success: false; message: string } => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  // Check if user already exists
  if (users.find((u: User) => u.email === user.email)) {
    return { success: false, message: 'Neural ID already synchronized.' };
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return { success: true };
};

// Update: Defined explicit return types for loginUser for better type-safety and consistency
export const loginUser = (email: string): { success: true; user: User } | { success: false; message: string } => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find((u: User) => u.email === email);
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Identity not found.' };
};

export const getMasteryRecords = (studentId: string): MasteryRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const db = stored ? JSON.parse(stored) : {};
  return db[studentId] || [];
};

export const saveMasteryRecord = (studentId: string, record: MasteryRecord) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const db = stored ? JSON.parse(stored) : {};
  if (!db[studentId]) db[studentId] = [];
  const idx = db[studentId].findIndex((r: any) => r.topicId === record.topicId);
  if (idx > -1) db[studentId][idx] = record;
  else db[studentId].push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const getTeacherAnalytics = async () => {
  return [
    { id: '1', name: 'Alpha Student', avgScore: 88, velocity: 90, risk: false, weakTopic: 'TOC' },
    { id: '2', name: 'Beta Student', avgScore: 45, velocity: 30, risk: true, weakTopic: 'Algorithms' }
  ];
};
