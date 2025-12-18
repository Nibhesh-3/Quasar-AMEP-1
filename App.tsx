
import React, { useState, useEffect } from 'react';
// Fix: Added missing Layers import to resolve "Cannot find name 'Layers'" error
import { Layers } from 'lucide-react';
import Layout from './components/Layout';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Quiz from './pages/Quiz';
import { User } from './types';
import { getAuthUser, saveAuthUser } from './services/mockBackend';

type ViewState = 'dashboard' | 'quiz';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('dashboard');
  const [activeView, setActiveView] = useState('hub');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuizTopic, setActiveQuizTopic] = useState<string | null>(null);
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
    setActiveQuizTopic(null);
    setActiveView('hub');
  };

  const startQuiz = (topicId: string) => {
    setActiveQuizTopic(topicId);
    setView('quiz');
  };

  const endQuiz = () => {
    setActiveQuizTopic(null);
    setView('dashboard');
  };

  if (isInitializing) return null;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onSearch={setSearchQuery}
      activeView={activeView}
      setActiveView={setActiveView}
    >
      {view === 'quiz' && activeQuizTopic && user.role === 'student' ? (
        <Quiz 
          topicId={activeQuizTopic} 
          studentId={user.id} 
          onExit={endQuiz} 
        />
      ) : user.role === 'teacher' ? (
        <TeacherDashboard />
      ) : activeView === 'hub' ? (
        <StudentDashboard 
          user={user} 
          onStartQuiz={startQuiz} 
          searchQuery={searchQuery}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center space-y-6">
           <div className="bg-indigo-500/10 p-10 rounded-full animate-pulse">
              <Layers className="w-20 h-20 text-indigo-500" />
           </div>
           <h2 className="text-4xl font-black dark:text-white text-slate-900 uppercase tracking-tighter italic">Nexus {activeView} Locked</h2>
           <p className="text-slate-500 font-bold max-w-md">Complete 3 additional mastery modules to unlock the {activeView} interface.</p>
        </div>
      )}
    </Layout>
  );
};

export default App;
