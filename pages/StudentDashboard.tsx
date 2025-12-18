import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, TrendingUp, Zap, Book, ChevronRight, FilterX, Search, Sparkles, GraduationCap, Trophy, Info, Brain } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState<'All' | 'MU Syllabus' | 'Competitive'>('All');

  useEffect(() => {
    setRecords(getMasteryRecords(user.id));
  }, [user.id]);

  const filteredTopics = TOPICS.filter(t => {
    const parentPath = PATHS.find(p => p.id === t.pathId);
    const matchesCategory = activeCategory === 'All' || parentPath?.category === activeCategory;
    const matchesPath = activePathFilter ? t.pathId === activePathFilter : true;
    const matchesSearch = searchQuery 
      ? t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesPath && matchesSearch;
  });

  // REAL DATA ENGINE: Calculate velocity based on actual attempts
  const averageMastery = records.length > 0 ? Math.round(records.reduce((acc, curr) => acc + curr.score, 0) / records.length) : 0;
  
  // Create a timeline of scores for the chart
  const timelineData = records.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime())
    .map((r, i) => ({ name: `T-${i+1}`, score: r.score }));

  const chartData = timelineData.length > 3 ? timelineData : [
    { name: 'Initial', score: 0 },
    { name: 'Alpha', score: Math.max(0, averageMastery - 10) },
    { name: 'Beta', score: Math.max(0, averageMastery - 5) },
    { name: 'Current', score: averageMastery },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-display font-black dark:text-white text-slate-900 tracking-tighter">
            Operational, <span className="text-indigo-600">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">
            Average Session Accuracy: <span className="text-indigo-600 font-black">{averageMastery}%</span>
          </p>
        </div>
        
        <div className="glass-panel px-6 py-4 rounded-3xl flex items-center gap-4 bg-white/90 dark:bg-slate-900 shadow-xl border-indigo-600/10">
           <div className="p-3 bg-indigo-600 text-white rounded-2xl">
              <Trophy className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Global Sync Rank</p>
              <p className="text-slate-900 dark:text-white font-black text-2xl">Alpha-1</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          
          <div className="glass-panel p-10 rounded-[2.5rem] bg-white/90 dark:bg-slate-900 shadow-2xl border-white/20">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">Focus Velocity Engine</h3>
                <div className="px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl text-[10px] font-black border border-indigo-600/20 flex items-center gap-2">
                   <TrendingUp className="w-4 h-4" /> LIVE SESSION DATA
                </div>
             </div>
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: '900'}} dy={15} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }} />
                    <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={6} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <section className="space-y-8">
             <div className="flex flex-col sm:flex-row justify-between gap-4">
                <h3 className="text-3xl font-black dark:text-white text-slate-900 flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-indigo-600" /> Mastery Paths
                </h3>
                <div className="flex gap-2">
                   {['All', 'MU Syllabus', 'Competitive'].map(cat => (
                     <button 
                       key={cat} 
                       onClick={() => { setActiveCategory(cat as any); setActivePathFilter(null); }}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-transparent hover:bg-slate-300'}`}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PATHS.filter(p => activeCategory === 'All' || p.category === activeCategory).map(path => (
                  <div 
                    key={path.id} 
                    onClick={() => setActivePathFilter(path.id)}
                    className={`glass-panel p-8 rounded-[2rem] transition-all cursor-pointer border-2 shadow-lg ${activePathFilter === path.id ? 'border-indigo-600 bg-indigo-600/5 ring-8 ring-indigo-600/5' : 'border-transparent bg-white/90 dark:bg-slate-900 hover:border-indigo-600/30'}`}
                  >
                    <div className="flex justify-between items-start mb-6">
                       <div className={`p-4 rounded-2xl ${activePathFilter === path.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-indigo-600'}`}>
                          <Book className="w-6 h-6" />
                       </div>
                       <ChevronRight className={`w-5 h-5 ${activePathFilter === path.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <h4 className="text-xl font-black dark:text-white text-slate-900 mb-2 leading-none">{path.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold line-clamp-2">{path.description}</p>
                  </div>
                ))}
             </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
           <h3 className="text-2xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">Neural Segments</h3>
           <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredTopics.map(topic => {
                const record = records.find(r => r.topicId === topic.id);
                return (
                  <div key={topic.id} className="glass-panel p-6 rounded-[2rem] bg-white/90 dark:bg-slate-900 border-l-[6px] border-l-indigo-600 shadow-xl group">
                    <div className="flex justify-between mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{topic.id}</span>
                      <div className={`text-[9px] font-black px-2 py-1 rounded-full border ${record?.level === 'High' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'}`}>
                        {record?.level || 'NEW'}
                      </div>
                    </div>
                    <h4 className="font-black text-lg dark:text-white text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors">{topic.name}</h4>
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col gap-1">
                          <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                             <div className="bg-indigo-600 h-full" style={{width: `${record?.score || 0}%`}}></div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 tracking-tighter">{record?.score || 0}% SYNC</span>
                       </div>
                       <button onClick={() => onStartQuiz(topic.id)} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-all">
                          <Play className="w-6 h-6 fill-current" />
                       </button>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;