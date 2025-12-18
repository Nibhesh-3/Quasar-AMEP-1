import React, { useState, useEffect } from 'react';
import { Layers, Network, BookOpen, ChevronLeft, Download, ExternalLink, Image as ImageIcon, Search } from 'lucide-react';
import Layout from './components/Layout';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Quiz from './pages/Quiz';
import { User, Topic } from './types';
import { getAuthUser, saveAuthUser, TOPICS } from './services/mockBackend';

type ViewState = 'dashboard' | 'quiz' | 'detail';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('dashboard');
  const [activeView, setActiveView] = useState('hub');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [activeQuizTopicId, setActiveQuizTopicId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const saved = getAuthUser();
    if (saved) setUser(saved);
    setIsInitializing(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    saveAuthUser(null);
    setUser(null);
    setActiveQuizTopicId(null);
    setActiveView('hub');
    setView('dashboard');
  };

  const startQuiz = (topicId: string) => {
    setActiveQuizTopicId(topicId);
    setView('quiz');
  };

  const openDetail = (topic: Topic) => {
    setActiveTopic(topic);
    setView('detail');
  };

  const endQuiz = () => {
    setActiveQuizTopicId(null);
    setView('dashboard');
  };

  if (isInitializing) return null;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Library Detail View (Notes & Diagrams)
  const renderDetail = () => {
    if (!activeTopic) return null;
    return (
      <div className="animate-fade-in max-w-5xl mx-auto pb-20">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-accent mb-8 font-black uppercase text-xs tracking-widest transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Exit Archive
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="glass-panel p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-4 bg-indigo-500/20 text-indigo-500 rounded-2xl">
                    <BookOpen className="w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-4xl font-display font-black dark:text-white text-slate-900 tracking-tight">{activeTopic.name}</h2>
                    <div className="flex gap-2 mt-2">
                       {activeTopic.examFocus?.map(e => (
                         <span key={e} className="px-2 py-0.5 bg-accent/20 text-accent text-[9px] font-black rounded border border-accent/20 uppercase tracking-widest">{e} Focus</span>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-400 leading-relaxed font-medium space-y-4 whitespace-pre-line text-lg">
                  {activeTopic.content || "Decryption in progress... High-level summaries available in the quiz modules. Archive data sync estimated at 92%."}
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 flex flex-wrap gap-4">
                 <button onClick={() => startQuiz(activeTopic.id)} className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
                   INITIATE MASTERY SYNC
                 </button>
                 <button className="px-8 py-5 bg-slate-800/50 text-white font-black rounded-2xl hover:bg-slate-700 transition-all flex items-center gap-3 border border-white/10">
                   <Download className="w-5 h-5" /> OFFLINE ARCHIVE
                 </button>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="glass-panel p-8 rounded-[2rem] border-white/10 shadow-xl">
                <h3 className="text-lg font-black dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
                  <ImageIcon className="text-accent w-5 h-5" /> Schematic Vault
                </h3>
                <div className="space-y-4">
                   {activeTopic.resources?.filter(r => r.type === 'diagram').map((r, i) => (
                     <div key={i} className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-lg cursor-zoom-in">
                        <img src={r.url} alt={r.title} className="w-full h-52 object-cover group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent p-4 flex flex-col justify-end">
                           <p className="text-[10px] font-black text-white uppercase tracking-widest">{r.title}</p>
                        </div>
                     </div>
                   ))}
                   {(!activeTopic.resources || activeTopic.resources.length === 0) && (
                     <div className="p-12 border-2 border-dashed border-slate-700 rounded-[2rem] text-center text-slate-500 font-bold text-xs uppercase italic">
                       No Schematics Sync
                     </div>
                   )}
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[2rem] border-white/10 shadow-xl">
                <h3 className="text-lg font-black dark:text-white mb-6 uppercase tracking-tighter">Satellite Links</h3>
                <div className="space-y-3">
                   <a href="#" className="flex items-center justify-between p-4 bg-slate-800/20 hover:bg-slate-700/30 rounded-2xl transition-all border border-white/5">
                      <span className="text-xs font-bold text-slate-400">MU Syllabus Guide</span>
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                   </a>
                   <a href="#" className="flex items-center justify-between p-4 bg-slate-800/20 hover:bg-slate-700/30 rounded-2xl transition-all border border-white/5">
                      <span className="text-xs font-bold text-slate-400">ISRO Pattern Docs</span>
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                   </a>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onSearch={setSearchQuery}
      activeView={activeView}
      setActiveView={(v) => { setActiveView(v); setView('dashboard'); }}
    >
      {view === 'quiz' && activeQuizTopicId && user.role === 'student' ? (
        <Quiz 
          topicId={activeQuizTopicId} 
          studentId={user.id} 
          onExit={endQuiz} 
        />
      ) : view === 'detail' ? (
        renderDetail()
      ) : user.role === 'teacher' ? (
        <TeacherDashboard />
      ) : activeView === 'hub' ? (
        <StudentDashboard 
          user={user} 
          onStartQuiz={startQuiz} 
          searchQuery={searchQuery}
        />
      ) : activeView === 'segments' ? (
        <div className="space-y-10 animate-fade-in">
           <div className="flex justify-between items-center">
             <h2 className="text-5xl font-display font-black dark:text-white tracking-tighter uppercase">All Segments</h2>
             <span className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl font-black text-xs border border-indigo-500/20">{TOPICS.length} TOTAL ARCHIVES</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TOPICS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(topic => (
                <div 
                  key={topic.id} 
                  onClick={() => openDetail(topic)}
                  className="glass-panel p-8 rounded-[2.5rem] hover:bg-indigo-600/5 transition-all cursor-pointer group border-2 border-transparent hover:border-indigo-500/30 shadow-xl"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner">
                        <Network className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1">
                        {topic.examFocus?.slice(0, 1).map(e => (
                           <span key={e} className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-[8px] font-black rounded uppercase tracking-widest text-slate-500 border border-transparent dark:border-white/5">{e}</span>
                        ))}
                      </div>
                   </div>
                   <h4 className="text-2xl font-black dark:text-white mb-2 leading-none group-hover:text-indigo-500 transition-colors">{topic.name}</h4>
                   <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-6">{topic.description}</p>
                   <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                      Open Neural Core <ChevronLeft className="w-3 h-3 rotate-180" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center space-y-10">
           <div className="bg-indigo-500/10 p-16 rounded-full animate-pulse-slow border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
              <BookOpen className="w-24 h-24 text-indigo-500" />
           </div>
           <div className="space-y-4">
             <h2 className="text-6xl font-display font-black dark:text-white text-slate-900 uppercase tracking-tighter italic">Library Restricted</h2>
             <p className="text-slate-500 font-bold max-w-xl mx-auto leading-relaxed text-lg">Your synaptic synchronization index is insufficient for the Global Library. Maintain a <span className="text-accent">90% average accuracy</span> across 5 segments to unlock encrypted archives.</p>
           </div>
           <button onClick={() => setActiveView('hub')} className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">Synchronize Now</button>
        </div>
      )}
    </Layout>
  );
};

export default App;