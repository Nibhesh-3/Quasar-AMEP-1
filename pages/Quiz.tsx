import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ArrowRight, Loader2, BrainCircuit, ShieldCheck } from 'lucide-react';
import { getQuestions, submitQuiz, TOPICS } from '../services/mockBackend';
import { Question, QuizResult } from '../types';

interface Props {
  topicId: string;
  studentId: string;
  onExit: () => void;
}

const TIME_LIMIT = 60;

const Quiz: React.FC<Props> = ({ topicId, studentId, onExit }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); 
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

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
    } else if (timeLeft === 0 && !result && !isSubmitting) {
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

    const res = await submitQuiz(
      studentId, 
      topicId, 
      correctCount, 
      questions.length, 
      TIME_LIMIT - timeLeft, 
      TIME_LIMIT
    );
    
    setResult(res);
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
        <p className="mt-4 text-slate-400 font-display uppercase tracking-widest text-xs">Initiating Neural Link...</p>
      </div>
    );
  }

  if (result) {
    const topicName = TOPICS.find(t => t.id === topicId)?.name;
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border-indigo-500/20">
          <div className="bg-gradient-to-r from-indigo-600/50 to-cyan-600/50 p-10 text-center backdrop-blur-md">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="text-accent w-10 h-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">Mastery Session Evaluated</h2>
            <p className="text-slate-300">{topicName}</p>
          </div>
          
          <div className="p-10 bg-slate-900/40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="glass-panel p-4 rounded-2xl text-center border-slate-700/50">
                <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-1">Total Rank</p>
                <p className="text-3xl font-display font-bold text-accent">{result.finalScore}</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl text-center border-slate-700/50">
                <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-1">Precision</p>
                <p className="text-3xl font-display font-bold text-white">{Math.round(result.accuracy)}%</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl text-center border-slate-700/50">
                <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-1">Cognition</p>
                <p className="text-3xl font-display font-bold text-white">{Math.round(result.timeEfficiency)}%</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl text-center border-slate-700/50">
                 <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-1">Grade</p>
                 <p className={`text-2xl font-display font-bold ${result.level === 'High' ? 'text-emerald-400' : result.level === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>{result.level}</p>
              </div>
            </div>

            <div className="mb-10 bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                 <BrainCircuit className="w-6 h-6 text-indigo-400" />
                 <h3 className="font-display font-bold text-lg text-white">AMEP Cognitive Analysis</h3>
              </div>
              <p className="text-slate-400 mb-4 leading-relaxed italic">"{result.feedback}"</p>
              <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl text-accent text-sm font-bold flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> Adaptive Next Step: {result.nextStep}
              </div>
            </div>

            <button onClick={onExit} className="w-full py-5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-2xl font-display font-bold text-lg shadow-lg hover:shadow-indigo-500/40 transition-all hover:-translate-y-1">
              Finalize & Return to Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-display font-bold text-white mb-1">{TOPICS.find(t => t.id === topicId)?.name}</h2>
           <p className="text-slate-500 text-sm font-medium">Neural Segment {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-mono font-bold border ${timeLeft < 10 ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'glass-panel border-slate-700 text-slate-300'}`}>
          <Clock className="w-5 h-5" />
          00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="w-full bg-slate-800 h-2 rounded-full mb-10 overflow-hidden border border-slate-700/50">
        <div className="bg-accent h-full transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="glass-panel p-10 rounded-3xl border-slate-700/50 shadow-xl min-h-[400px] flex flex-col mb-8">
        <h3 className="text-2xl font-display font-semibold mb-10 text-white leading-snug">{currentQ.text}</h3>

        <div className="space-y-4 flex-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentIndex] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center group
                  ${isSelected 
                    ? 'border-accent bg-accent/5 text-accent shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
              >
                <span className="font-medium text-lg">{opt}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-accent bg-accent' : 'border-slate-700'}`}>
                  {isSelected && <CheckCircle className="w-4 h-4 text-slate-900" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end">
        {currentIndex < questions.length - 1 ? (
          <button 
            disabled={answers[currentIndex] === undefined}
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="flex items-center gap-3 px-10 py-4 glass-panel border-slate-700 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Advance <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            disabled={answers[currentIndex] === undefined || isSubmitting}
            onClick={handleSubmit}
            className="flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 rounded-2xl font-black shadow-lg hover:shadow-emerald-500/40 disabled:opacity-30 transition-all uppercase tracking-widest"
          >
            {isSubmitting ? 'Analyzing Responses...' : 'Sync Mastery'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;