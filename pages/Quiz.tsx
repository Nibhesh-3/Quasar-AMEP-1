import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ArrowRight, Loader2, BrainCircuit, ShieldCheck, AlertCircle } from 'lucide-react';
import { getQuestions, submitQuiz, TOPICS } from '../services/mockBackend';
import { Question, QuizResult } from '../types';

interface Props {
  topicId: string;
  studentId: string;
  onExit: () => void;
}

const TIME_LIMIT = 1800; // 30 minutes for 50 questions

const Quiz: React.FC<Props> = ({ topicId, studentId, onExit }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); 
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const qs = await getQuestions(topicId);
      setQuestions(qs);
      setLoading(false);
    };
    load();
  }, [topicId]);

  useEffect(() => {
    if (!loading && !result && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !result) {
      handleSubmit();
    }
  }, [loading, result, timeLeft]);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correctCount++;
    });

    const res = await submitQuiz(studentId, topicId, correctCount, questions.length, TIME_LIMIT - timeLeft, TIME_LIMIT);
    setResult(res);
    setIsSubmitting(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
           <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
           <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400" />
        </div>
        <p className="mt-6 text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Decrypting 50 Systematic Queries...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in py-10">
        <div className="glass-panel rounded-[2.5rem] overflow-hidden shadow-2xl border-indigo-600/20 bg-white/95 dark:bg-slate-900/95">
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-12 text-center text-white">
            <ShieldCheck className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-display font-black tracking-tight">Mastery Session Finalized</h2>
            <p className="mt-2 font-bold opacity-80 uppercase tracking-widest text-xs">Evaluation Complete for {topicId}</p>
          </div>
          <div className="p-12 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Rank', val: result.finalScore, color: 'text-indigo-600' },
                { label: 'Accuracy', val: `${Math.round(result.accuracy)}%`, color: 'text-slate-900 dark:text-white' },
                { label: 'Sync Rate', val: `${Math.round(result.consistency)}%`, color: 'text-slate-900 dark:text-white' },
                { label: 'Status', val: result.level, color: result.level === 'High' ? 'text-emerald-500' : 'text-amber-500' }
              ].map(stat => (
                <div key={stat.label} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-center border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                </div>
              ))}
            </div>
            <div className="bg-indigo-600/5 border-2 border-indigo-600/10 p-8 rounded-3xl">
               <h3 className="font-black text-indigo-600 uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                 <BrainCircuit className="w-4 h-4" /> Cognitive Analysis
               </h3>
               <p className="dark:text-white text-slate-900 text-lg font-bold leading-relaxed mb-6 italic">"{result.feedback}"</p>
               <div className="flex items-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-black text-sm">
                  <ArrowRight className="w-5 h-5" /> Next Node: {result.nextStep}
               </div>
            </div>
            <button onClick={onExit} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition-all">
              Return to Command Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
           <h2 className="text-3xl font-display font-black dark:text-white text-slate-900 tracking-tighter">{TOPICS.find(t => t.id === topicId)?.name}</h2>
           <div className="flex items-center gap-3 mt-1">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Query {currentIndex + 1} of {questions.length}</span>
             <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded uppercase">50 Question Matrix</span>
           </div>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black border-2 transition-all ${timeLeft < 300 ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-slate-900 text-white border-slate-700'}`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full mb-10 overflow-hidden shadow-inner">
        <div className="bg-indigo-600 h-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="glass-panel p-10 rounded-[2.5rem] border-slate-200 dark:border-white/10 shadow-2xl bg-white/95 dark:bg-slate-900/95 mb-8">
        <h3 className="text-2xl font-bold mb-10 dark:text-white text-slate-900 leading-tight">{questions[currentIndex].text}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions[currentIndex].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`text-left p-6 rounded-3xl border-2 transition-all group flex items-start gap-4 ${answers[currentIndex] === idx ? 'border-indigo-600 bg-indigo-600/5 text-indigo-600' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:text-slate-300 text-slate-600'}`}
            >
              <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white">{String.fromCharCode(65 + idx)}</span>
              <span className="font-bold">{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          className={`px-8 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
        >
          Previous
        </button>
        
        {currentIndex < questions.length - 1 ? (
          <button 
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:shadow-indigo-600/30 transition-all"
          >
            Advance Query <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={() => setShowConfirm(true)}
            className="px-12 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-xl uppercase tracking-widest hover:scale-105 transition-all"
          >
            Finalize Session
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
           <div className="glass-panel p-10 rounded-[2.5rem] max-w-md w-full text-center space-y-6 border-white/20 bg-white dark:bg-slate-900 shadow-3xl">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
              <h3 className="text-2xl font-black dark:text-white text-slate-900">Confirm Synchronization?</h3>
              <p className="text-slate-500 font-bold">You have answered {answers.filter(a => a !== undefined).length} out of 50 questions. Submitting now will finalize your mastery rank.</p>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setShowConfirm(false)} className="py-4 bg-slate-200 dark:bg-slate-800 dark:text-white rounded-2xl font-black uppercase text-xs">Return</button>
                 <button onClick={handleSubmit} className="py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs">Submit</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;