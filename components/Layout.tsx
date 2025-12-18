import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Search, User as UserIcon, Moon, Sun, BrainCircuit, Network, Layers, BookOpen } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onSearch, activeView, setActiveView }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f1f5f9';
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'dark bg-darkbg' : 'bg-[#f1f5f9]'}`}>
      
      <header className="sticky top-0 z-[100] px-6 py-4">
        <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl border-white/20 dark:border-white/10 dark:bg-slate-900/80 bg-white/90">
          <div className="flex items-center gap-4">
             <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                <BrainCircuit className="text-white w-5 h-5" />
             </div>
             <div className="flex flex-col">
               <span className="font-display font-black text-2xl tracking-tighter dark:text-white text-slate-900 flex items-center gap-2 group cursor-pointer">
                 <span className="group-hover:text-indigo-600 transition-colors">AMEP</span> 
                 <span className="text-[10px] bg-indigo-600/10 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-widest font-black border border-indigo-600/20">Nexus v6</span>
               </span>
             </div>
             
             <div className="ml-10 hidden lg:flex items-center gap-1">
                {[
                  { id: 'hub', label: 'Hub', icon: LayoutDashboard },
                  { id: 'segments', label: 'Segments', icon: Layers },
                  { id: 'library', label: 'Library', icon: BookOpen }
                ].map(nav => (
                  <button 
                    key={nav.id}
                    onClick={() => setActiveView(nav.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${activeView === nav.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-400'}`}
                  >
                    <nav.icon className="w-4 h-4" /> {nav.label}
                  </button>
                ))}
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsDark(!isDark)}
               className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all border border-slate-300 dark:border-white/5"
             >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Mastery Search..." 
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white text-slate-900 w-48 focus:w-80 transition-all"
                />
             </div>
             
             {user && (
               <div className="flex items-center gap-4 pl-4 border-l border-slate-300 dark:border-white/10">
                 <div className="text-right hidden xl:block">
                   <p className="text-sm font-black dark:text-white text-slate-900 leading-none mb-1">{user.name}</p>
                   <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{user.role}</p>
                 </div>
                 <button onClick={onLogout} className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg">
                   <LogOut className="w-5 h-5" />
                 </button>
               </div>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel rounded-full px-8 py-4 flex items-center justify-around md:hidden shadow-2xl border-white/20 z-[100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
         <LayoutDashboard className={`w-6 h-6 cursor-pointer ${activeView === 'hub' ? 'text-indigo-600' : 'text-slate-400'}`} onClick={() => setActiveView('hub')} />
         <Layers className={`w-6 h-6 cursor-pointer ${activeView === 'segments' ? 'text-indigo-600' : 'text-slate-400'}`} onClick={() => setActiveView('segments')} />
         <BookOpen className={`w-6 h-6 cursor-pointer ${activeView === 'library' ? 'text-indigo-600' : 'text-slate-400'}`} onClick={() => setActiveView('library')} />
      </nav>
    </div>
  );
};

export default Layout;