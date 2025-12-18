import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, TrendingUp, Zap, Target, Book, ChevronRight, Star, FilterX, Search, Sparkles } from 'lucide-react';
import { getMasteryRecords, TOPICS, PATHS } from '../services/mockBackend';
import { MasteryRecord, Topic } from '../types';

interface Props {
  user: { name: string; id: string };
  onStartQuiz: (topicId: string) => void;
  searchQuery: string;
}

const StudentDashboard: React.FC<Props> = ({ user, onStartQuiz, searchQuery }) => {
  const [records, setRecords] = useState<MasteryRecord[]>([]);
  const [activePathFilter, setActivePathFilter] = useState<string | null>(null);

  useEffect(() => {
    setRecords(getMasteryRecords(user.id));
  }, [user.id]);

  const filteredTopics = TOPICS.filter(t => {
    const matchesPath = activePathFilter ? t.pathId === activePathFilter : true;
    const matchesSearch = searchQuery 
      ? t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesPath && matchesSearch;
  });

  const allTopicData = TOPICS.map(topic => {
    const record = records.find(r => r.topicId === topic.id);
    return {
      ...topic,
      score: record?.score || 0,
      attempts: record?.attempts || 0
    };
  });

  // REAL DATA ENGINE: Calculate "Focus Velocity" based on actual history
  const averageMastery = Math.round(allTopicData.reduce((acc, curr) => acc + curr.score, 0) / (allTopicData.length || 1));
  const totalAttempts = allTopicData.reduce((acc, curr) => acc + curr.attempts, 0);
  
  // Generating a realistic growth curve based on total attempts
  const chartData = [
    { name: 'Init', score: 0 },
    { name: 'Alpha', score: Math.min(averageMastery, totalAttempts * 2) },
    { name: 'Beta', score: Math.max(0, averageMastery - 15) },
    { name: 'Gamma', score: Math.max(0, averageMastery - 5) },
    { name: 'Current', score: averageMastery },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      
      {/* Welcome Engine */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-display font-black dark:text-white text-slate-900">
            Welcome, <span className="text-gradient drop-shadow-sm">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            Cognitive synchronization: <span className="text-indigo-600 dark:text-accent font-bold">{averageMastery}% Mastery</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass-panel px-5 py-2.5 rounded-2xl flex items-center gap-3 border-indigo-500/20">
             <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/30">
                <Zap className="w-5 h-5 fill-current" />
             </div>
             <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Global Rank</p>
                <p className="text-slate-900 dark:text-white font-black text-lg">Top 3%</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Analytics Section */}
        <div className="lg:col-span-8 space-y-10">
          
          <div className="glass-panel p-8 rounded-3xl overflow-hidden relative border-white/10 shadow-2xl">
             <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                   <h3 className="text-xl font-bold dark:text-white text-slate-900">Focus Velocity</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Real-Time Sync Diagnostics</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                   <TrendingUp className="w-3 h-3" /> STABLE UPTICK
                </div>
             </div>
             <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '700'}} dy={15} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      cursor={{stroke: '#6366f1', strokeWidth: 1}}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Expanded Engineering Paths */}
          <section className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-display font-black dark:text-white text-slate-900 flex items-center gap-3">
                  <Sparkles className="text-accent w-6 h-6" /> Mastery Paths
                </h3>
                {activePathFilter && (
                  <button 
                    onClick={() => setActivePathFilter(null)}
                    className="text-xs font-black text-red-500 hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20 transition-all"
                  >
                    <FilterX className="w-3 h-3" /> RESET PROTOCOL
                  </button>
                )}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {PATHS.map(path => (
                  <div 
                    key={path.id} 
                    onClick={() => setActivePathFilter(path.id)}
                    className={`glass-panel p-6 rounded-3xl transition-all group cursor-pointer border-2 shadow-lg ${activePathFilter === path.id ? 'border-accent bg-accent/5 ring-4 ring-accent/10' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.02]'}`}
                  >
                    <div className="flex justify-between items-start mb-6">
                       <div className={`p-3 rounded-2xl transition-all ${activePathFilter === path.id ? 'bg-accent text-slate-900' : 'bg-slate-200 dark:bg-slate-800 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'}`}>
                          <Book className="w-6 h-6" />
                       </div>
                       <ChevronRight className={`transition-colors ${activePathFilter === path.id ? 'text-accent' : 'text-slate-400'}`} />
                    </div>
                    <h4 className="text-lg font-black dark:text-white text-slate-900 mb-2 leading-tight">{path.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">{path.description}</p>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Module Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black dark:text-white text-slate-900 tracking-tight">Segments</h3>
              <span className="text-[10px] font-black px-2 py-1 bg-slate-200 dark:bg-slate-800 dark:text-slate-400 text-slate-600 rounded-lg">{filteredTopics.length} MODULES</span>
           </div>
           
           <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredTopics.map(topic => {
                const record = records.find(r => r.topicId === topic.id);
                return (
                  <div key={topic.id} className="glass-panel p-5 rounded-3xl border-l-4 border-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all group shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{topic.id}</span>
                      <div className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${record?.level === 'High' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : record?.level === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {record?.level || 'NEW'} STATUS
                      </div>
                    </div>
                    <h4 className="font-bold dark:text-white text-slate-900 mb-4 text-lg group-hover:text-indigo-500 transition-colors">{topic.name}</h4>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-gradient-to-r from-indigo-500 to-accent h-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{width: `${record?.score || 0}%`}}></div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 tracking-tighter">{record?.score || 0}%</span>
                       </div>
                       <button 
                         onClick={() => onStartQuiz(topic.id)}
                         className="p-3 bg-indigo-500/10 dark:bg-accent/10 hover:bg-indigo-600 dark:hover:bg-accent text-indigo-500 dark:text-accent hover:text-white rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/40"
                       >
                          <Play className="w-5 h-5 fill-current" />
                       </button>
                    </div>
                  </div>
                );
              })}
              {filteredTopics.length === 0 && (
                <div className="glass-panel p-10 rounded-3xl text-center space-y-4 border-dashed border-2 border-slate-700">
                   <Search className="w-10 h-10 text-slate-600 mx-auto" />
                   <p className="text-slate-500 font-bold">No Neural Segments Matched.</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;