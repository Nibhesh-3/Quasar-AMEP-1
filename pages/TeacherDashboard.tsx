import React, { useEffect, useState } from 'react';
import { getTeacherAnalytics } from '../services/mockBackend';
import { Users, AlertTriangle, BookOpen, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TeacherDashboard: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherAnalytics().then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 dark:text-white">Loading Analytics...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold dark:text-white">Class Analytics (Grade 10-A)</h1>
           <p className="text-gray-500 dark:text-gray-400">Real-time mastery tracking & intervention alerts</p>
        </div>
        <div className="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex items-center gap-2 text-sm text-gray-500 w-64">
           <Search className="w-4 h-4" />
           <span>Search student...</span>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Class Average</p>
                <h3 className="text-3xl font-bold mt-1 dark:text-white">72%</h3>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
           </div>
           <div className="mt-4 text-xs text-green-600 font-medium flex items-center gap-1">
             +4% from last week
           </div>
        </div>

        <div className="bg-white dark:bg-darkcard p-6 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Students at Risk</p>
                <h3 className="text-3xl font-bold mt-1 text-red-600">2</h3>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
           </div>
           <div className="mt-4 text-xs text-red-600 font-medium">
             Requires immediate intervention
           </div>
        </div>

        <div className="bg-white dark:bg-darkcard p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Weakest Topic</p>
                <h3 className="text-xl font-bold mt-2 dark:text-white">Newtonian Physics</h3>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
           </div>
           <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
             Avg. Score: 45%
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Student Table */}
        <div className="bg-white dark:bg-darkcard rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg dark:text-white">Student Performance</h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Avg. Mastery</th>
                <th className="px-6 py-3">Struggling With</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 dark:text-gray-300">
              {students.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-medium dark:text-white">{s.name}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${s.avgScore < 50 ? 'text-red-500' : s.avgScore > 80 ? 'text-green-500' : 'text-amber-500'}`}>
                      {s.avgScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{s.weakTopic}</td>
                  <td className="px-6 py-4">
                    {s.risk ? (
                       <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">
                         Risk
                       </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                        On Track
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white dark:bg-darkcard rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-6 dark:text-white">Class Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={students}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="avgScore" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
             Performance distribution across active students.
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;