
import React, { useState } from 'react';
import { User as UserIcon, GraduationCap, Mail, ArrowRight, BrainCircuit, AlertCircle } from 'lucide-react';
import { Role, User } from '../types';
import { loginUser, registerUser } from '../services/mockBackend';

interface Props {
  onLogin: (user: User) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const result = loginUser(email);
      // Fixed: result.message access is now safe because of discriminated union narrowing on success property
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.message);
      }
    } else {
      if (!name || !email) {
        setError("Please fill in all fields.");
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role
      };
      const result = registerUser(newUser);
      // Fixed: result.message property access is now type-safe in the else branch due to discriminated union in mockBackend
      if (result.success) {
        onLogin(newUser);
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 glass-panel rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Branding Side */}
        <div className="bg-primary/10 p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-cyan-400 p-3 rounded-2xl shadow-lg shadow-indigo-500/50">
                <BrainCircuit className="text-white w-8 h-8" />
              </div>
              <span className="text-3xl font-display font-bold text-white tracking-tight">AMEP</span>
            </div>
            <h1 className="text-5xl font-display font-bold text-white leading-tight mb-6">
              Mastery <br/><span className="text-gradient">Redefined.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Unlock your cognitive potential with neural-mapped learning paths.
            </p>
          </div>
          
          <div className="mt-12 text-slate-500 text-sm z-10 font-medium">
            Prototyped for Hackathon Excellence.
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Form Side */}
        <div className="bg-slate-900/50 p-10 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-bold text-white">
              {isLogin ? 'Login to Nexus' : 'Initialize Mastery'}
            </h2>
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-sm font-semibold text-accent hover:text-white transition-colors"
            >
              {isLogin ? 'Create Account' : 'Back to Login'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Identity Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Neural ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nexus@amep.io"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Protocol Role</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${role === 'student' ? 'border-accent bg-accent/10 text-accent' : 'border-slate-700 bg-slate-800/50 text-slate-500'}`}
                >
                  <UserIcon className="w-5 h-5" /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${role === 'teacher' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-700 bg-slate-800/50 text-slate-500'}`}
                >
                  <GraduationCap className="w-5 h-5" /> Teacher
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              {isLogin ? 'Access Platform' : 'Initialize Mastery'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-600">Tip: New to AMEP? Click "Create Account" to register.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
