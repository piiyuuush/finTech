
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sparkles, BrainCircuit, AlertCircle, ChevronRight, MoreHorizontal, X } from 'lucide-react';

const Analytics: React.FC = () => {
  const { state } = useFinance();
  const [dismissed, setDismissed] = useState<string[]>([]);

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const overspentBudgets = state.budget
  .map(b => {
    const spent = state.transactions
      .filter(t =>
        t.type === 'EXPENSE' &&
        t.category === b.category &&
        new Date(t.date).getMonth() === currentMonth &&
        new Date(t.date).getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return { ...b, spent };
  })
  .filter(b => b.spent > b.limit && !dismissed.includes(b.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Alert Banner */}
      {overspentBudgets.length > 0 && (
      <div className="space-y-4">
         {overspentBudgets.map((budget) => {
            const exceededAmount = budget.spent - budget.limit;

            return (
            <div
               key={budget.id}
               className={`relative border rounded-[28px] p-6 transition-all ${
                  state.isDarkMode
                  ? 'bg-[#f43f5e]/5 border-[#f43f5e]/20'
                  : 'bg-rose-50 border-rose-100'
               }`}
            >
               {/* Close Button */}
               <button
                  onClick={() =>
                  setDismissed(prev => [...prev, budget.id])
                  }
                  className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
                  state.isDarkMode
                     ? 'text-white/40 hover:bg-white/10'
                     : 'text-slate-400 hover:bg-white'
                  }`}
               >
                  <X size={16} />
               </button>

               <div className="flex items-start gap-4">
                  <div
                  className={`p-3 rounded-2xl ${
                     state.isDarkMode
                        ? 'bg-[#f43f5e]/10 text-[#f43f5e]'
                        : 'bg-white text-rose-500'
                  }`}
                  >
                  <AlertCircle size={22} />
                  </div>

                  <div>
                  <h4
                     className={`font-black text-sm uppercase tracking-wide ${
                        state.isDarkMode
                        ? 'text-white'
                        : 'text-slate-800'
                     }`}
                  >
                     Overspending Alert
                  </h4>

                  <p
                     className={`text-xs mt-1 ${
                        state.isDarkMode
                        ? 'text-[#94a3b8]'
                        : 'text-slate-600'
                     }`}
                  >
                     You've exceeded your{" "}
                     <span className={`font-bold ${
                        state.isDarkMode
                        ? 'text-white'
                        : 'text-slate-800'
                     }`}>
                        {budget.category}
                     </span>{" "}
                     budget by{" "}
                     <span className={`font-bold ${
                        state.isDarkMode
                        ? 'text-[#f43f5e]'
                        : 'text-rose-600'
                     }`}>
                        ₹{exceededAmount.toLocaleString()}
                     </span>.
                  </p>
                  </div>
               </div>
            </div>
            );
         })}
      </div>
      )}

      <div className={`rounded-[32px] p-8 border relative overflow-hidden transition-all duration-500 ${state.isDarkMode ? 'bg-[#1e1b39]/60 backdrop-blur-xl border-white/5 shadow-none' : 'bg-white border-slate-100 shadow-sm'}`}>
         <div className="flex justify-between items-center mb-8">
            <h3 className={`text-2xl font-black transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>Analytics</h3>
         </div>

         <div className="mb-6">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-4 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Spending Analysis</p>
            <p className={`text-xs font-bold mb-8 flex items-center gap-2 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
               <span className={`w-2 h-2 rounded-full ${state.isDarkMode ? 'bg-[#a855f7]' : 'bg-blue-600'}`}></span> Spent 
               <span className={`w-2 h-2 rounded-full ml-2 ${state.isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></span> Budget
            </p>
         </div>

         {/* <div className="h-64 -mx-4">
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
         </div> */}
      </div>

    </div>
  );
};

export default Analytics;
