
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getFinancialObservations } from '../services/geminiService';
import { Sparkles, BrainCircuit, AlertCircle, ChevronRight, MoreHorizontal, X } from 'lucide-react';

const Analytics: React.FC = () => {
  const { state } = useFinance();
  const [observations, setObservations] = useState<string[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  // Weekly spending vs budget mockup
  const weeklyData: any[] = [
    { day: 'Mon', spent: 1200, budget: 1500 },
    { day: 'Tue', spent: 1800, budget: 1500 },
    { day: 'Wed', spent: 800, budget: 1500 },
    { day: 'Thu', spent: 2200, budget: 1500 },
    { day: 'Fri', spent: 1400, budget: 1500 },
    { day: 'Sat', spent: 2500, budget: 1500 },
    { day: 'Sun', spent: 1100, budget: 1500 }
  ];

  const generateInsights = async () => {
    setLoadingAi(true);
    const insights = await getFinancialObservations(state.transactions, state.goals);
    setObservations(insights);
    setLoadingAi(false);
  };

  useEffect(() => {
    generateInsights();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className={`rounded-[32px] p-8 border relative overflow-hidden transition-all duration-500 ${state.isDarkMode ? 'bg-[#1e1b39]/60 backdrop-blur-xl border-white/5 shadow-none' : 'bg-white border-slate-100 shadow-sm'}`}>
         <div className="flex justify-between items-center mb-8">
            <h3 className={`text-2xl font-black transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>Analytics</h3>
            <div className={`p-2 rounded-full transition-colors ${state.isDarkMode ? 'bg-white/5 text-[#94a3b8]' : 'bg-slate-50 text-slate-400'}`}><MoreHorizontal size={20} /></div>
         </div>

         <div className="mb-6">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-4 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Spending Analysis</p>
            <p className={`text-xs font-bold mb-8 flex items-center gap-2 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
               <span className={`w-2 h-2 rounded-full ${state.isDarkMode ? 'bg-[#a855f7]' : 'bg-blue-600'}`}></span> Spent 
               <span className={`w-2 h-2 rounded-full ml-2 ${state.isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></span> Budget
            </p>
         </div>

         <div className="h-64 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={weeklyData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: state.isDarkMode ? '#94a3b8' : '#cbd5e1'}} dy={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: state.isDarkMode ? '#1e1b39' : '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: state.isDarkMode ? '#fff' : '#000' }}
                    itemStyle={{ color: state.isDarkMode ? '#a855f7' : '#2563eb' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spent" 
                    stroke={state.isDarkMode ? '#a855f7' : '#2563eb'} 
                    strokeWidth={4} 
                    dot={{r: 4, fill: state.isDarkMode ? '#a855f7' : '#2563eb', strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 8, strokeWidth: 0}}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke={state.isDarkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9'} 
                    strokeWidth={4} 
                    strokeDasharray="8 8" 
                    dot={false}
                  />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Alert Banner */}
      <div className={`border rounded-[28px] p-6 flex items-start gap-4 transition-all ${state.isDarkMode ? 'bg-[#f43f5e]/5 border-[#f43f5e]/20' : 'bg-rose-50 border-rose-100'}`}>
         <div className={`p-3 rounded-2xl shadow-sm transition-colors ${state.isDarkMode ? 'bg-[#f43f5e]/10 text-[#f43f5e]' : 'bg-white text-rose-500'}`}><AlertCircle size={24} /></div>
         <div className="flex-1">
            <h4 className={`font-black text-sm uppercase tracking-wide transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>Overspending Alert</h4>
            <p className={`text-xs mt-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-600'}`}>You've exceeded your <span className={`font-bold transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>Dining</span> budget by <span className={`font-bold transition-colors ${state.isDarkMode ? 'text-[#f43f5e]' : 'text-rose-600'}`}>₹1,420</span> this week.</p>
         </div>
         <button className={`transition-colors ${state.isDarkMode ? 'text-white/20 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}><X size={16} /></button>
      </div>

      {/* Insights Section */}
      <section className={`rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-500 ${state.isDarkMode ? 'bg-[#1e1b39]/80 border border-white/5' : 'bg-slate-900'}`}>
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <BrainCircuit className={state.isDarkMode ? 'text-[#a855f7]' : 'text-blue-400'} size={24} />
               <h3 className="text-xl font-black">AI Insights</h3>
            </div>
            
            <div className={`leading-relaxed mb-8 space-y-4 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-300'}`}>
               {observations.length > 0 ? (
                  observations.map((obs, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <Sparkles size={14} className={`mt-1 shrink-0 ${state.isDarkMode ? 'text-[#a855f7]' : 'text-blue-400'}`} />
                      <span>{obs}</span>
                    </p>
                  ))
               ) : (
                  <p>Analyzing your spending patterns to provide personalized financial tips...</p>
               )}
            </div>

            <button 
              onClick={generateInsights}
              disabled={loadingAi}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 group border ${state.isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/5 text-[#a855f7]' : 'bg-white/10 hover:bg-white/20 border-white/5 text-white'}`}
            >
               {loadingAi ? 'Analyzing...' : 'Refresh Insights'}
               <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>

         {/* Glow effect */}
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[100px] pointer-events-none transition-colors ${state.isDarkMode ? 'bg-[#a855f7]/10' : 'bg-blue-500/10'}`}></div>
      </section>
    </div>
  );
};

export default Analytics;
