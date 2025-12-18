import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Settings, Bell, Search, User as UserIcon, Book, Moon, Sun, BrainCircuit, Network, Layers } from 'lucide-react';
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
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen flex flex-col selection:bg-accent selection:text-slate-900 transition-colors duration-300 ${isDark ? 'dark bg-darkbg' : 'bg-slate-100'}`}>
      
      <header className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl border-white/20 dark:border-white/10">
          <div className="flex items-center gap-4">
             <div className="bg-gradient-to-br from-indigo-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30 animate-pulse-slow">
                <BrainCircuit className="text-white w-5 h-5" />
             </div>
             <div className="flex flex-col">
               <span className="font-display font-extrabold text-2xl tracking-tighter dark:text-white text-slate-900 flex items-center gap-1">
                 AMEP <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded uppercase tracking-widest font-black">NEXUS</span>
               </span>
             </div>
             
             <div className="ml-10 hidden lg:flex items-center gap-8">
                <button 
                  onClick={() => setActiveView('hub')}
                  className={`text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'hub' ? 'text-indigo-600 dark:text-accent underline underline-offset-8' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'}`}
                >
                   <LayoutDashboard className="w-4 h-4" /> Hub
                </button>
                <button 
                  onClick={() => setActiveView('segments')}
                  className={`text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'segments' ? 'text-indigo-600 dark:text-accent underline underline-offset-8' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'}`}
                >
                   <Layers className="w-4 h-4" /> Segments
                </button>
                <button 
                  onClick={() => setActiveView('neural')}
                  className={`text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'neural' ? 'text-indigo-600 dark:text-accent underline underline-offset-8' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'}`}
                >
                   <Network className="w-4 h-4" /> Neural-Net
                </button>
             </div>
          </div>

          <div className="flex items-center gap-5">
             <button 
               onClick={() => setIsDark(!isDark)}
               className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-accent transition-all"
             >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Universal Search..." 
                  className="bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 dark:text-white text-slate-900 w-48 focus:w-64 transition-all"
                />
             </div>
             
             {user && (
               <div className="flex items-center gap-4 pl-4 border-l border-slate-300 dark:border-slate-800">
                 <div className="text-right hidden xl:block">
                   <p className="text-sm font-bold dark:text-white text-slate-900">{user.name}</p>
                   <p className="text-[10px] text-indigo-600 dark:text-accent font-black uppercase tracking-widest">{user.role}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-slate-300 dark:bg-slate-800 border border-slate-400 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <UserIcon className="w-6 h-6 text-slate-500" />
                 </div>
                 <button 
                  onClick={onLogout}
                  className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  title="Logout"
                 >
                   <LogOut className="w-5 h-5" />
                 </button>
               </div>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel rounded-full px-8 py-4 flex items-center justify-around md:hidden shadow-2xl border-white/20">
         <LayoutDashboard className={`w-6 h-6 ${activeView === 'hub' ? 'text-accent' : 'text-slate-500'}`} onClick={() => setActiveView('hub')} />
         <Layers className={`w-6 h-6 ${activeView === 'segments' ? 'text-accent' : 'text-slate-500'}`} onClick={() => setActiveView('segments')} />
         <Network className={`w-6 h-6 ${activeView === 'neural' ? 'text-accent' : 'text-slate-500'}`} onClick={() => setActiveView('neural')} />
         <Settings className="w-6 h-6 text-slate-500" />
      </nav>
    </div>
  );
};

export default Layout;