
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
  const weeklyData = [];

  const generateInsights = async () => {
    setLoadingAi(true);
    const insights = await getFinancialObservations(state.transactions, state.debts, state.goals);
    setObservations(insights);
    setLoadingAi(false);
  };

  useEffect(() => {
    generateInsights();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-900">Analytics</h3>
            <div className="p-2 bg-slate-50 rounded-full"><MoreHorizontal size={20} className="text-slate-400" /></div>
         </div>

         <div className="mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Spending Analysis</p>
            <p className="text-xs font-bold text-slate-500 mb-8 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-600"></span> Spent 
               <span className="w-2 h-2 rounded-full bg-slate-200 ml-2"></span> Budget
            </p>
         </div>

         <div className="h-64 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={weeklyData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#cbd5e1'}} dy={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spent" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 8, strokeWidth: 0}}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#f1f5f9" 
                    strokeWidth={4} 
                    strokeDasharray="8 8" 
                    dot={false}
                  />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-rose-50 border border-rose-100 rounded-[28px] p-6 flex items-start gap-4">
         <div className="p-3 bg-white rounded-2xl text-rose-500 shadow-sm"><AlertCircle size={24} /></div>
         <div className="flex-1">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-wide">Overspending Alert</h4>
            <p className="text-xs text-slate-600 mt-1">You've exceeded your <span className="font-bold text-slate-800">Dining</span> budget by <span className="font-bold text-rose-600">₹1,420</span> this week.</p>
         </div>
         <button className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
      </div>

      {/* Insights Section */}
      <section className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <BrainCircuit className="text-blue-400" size={24} />
               <h3 className="text-xl font-black">Insights</h3>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-8">
               Your morning routine is getting expensive. <span className="text-blue-400 font-bold">You've spent 15% more on Coffee</span> this month compared to your last 3-month average.
            </p>

            <button 
              onClick={generateInsights}
              disabled={loadingAi}
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 group border border-white/5"
            >
               {loadingAi ? 'Analyzing...' : 'Review Habits'}
               <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>

         {/* Glow effect */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
      </section>
    </div>
  );
};

export default Analytics;
