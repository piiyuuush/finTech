
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sparkles, BrainCircuit, AlertCircle, ChevronRight, MoreHorizontal, X } from 'lucide-react';

const Analytics: React.FC = () => {
  const { state } = useFinance();
  const [dismissed, setDismissed] = useState<string[]>([]);

   const now = new Date();
   const currentMonth = now.getMonth();
   const currentYear = now.getFullYear();
   const categoryData = (() => {
  const categoryMap: Record<string, number> = {};

  state.transactions
    .filter(t =>
      t.type === 'EXPENSE' &&
      new Date(t.date).getMonth() === currentMonth &&
      new Date(t.date).getFullYear() === currentYear
    )
    .forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += t.amount;
    });

  return Object.entries(categoryMap).map(([category, amount]) => ({
    name: category,
    value: amount
  }));
})();
const COLORS = state.isDarkMode
  ? ['#a855f7', '#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#6366f1']
  : ['#2563eb', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#0ea5e9'];

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
            <div className="space-y-6">
   <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
      state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'
   }`}>
      Budget Usage
   </p>

   {state.budget.map((budget) => {
      const spent = state.transactions
         .filter(t =>
         t.type === 'EXPENSE' &&
         t.category === budget.category &&
         new Date(t.date).getMonth() === currentMonth &&
         new Date(t.date).getFullYear() === currentYear
         )
         .reduce((sum, t) => sum + t.amount, 0);

      const percentage = spent / budget.limit * 100;
      const exceeded = spent > budget.limit;

      return (
         <div key={budget.id} className="space-y-2">
         
         {/* Top Row */}
         <div className="flex justify-between items-center">
            <p className={`text-xs font-bold ${
               state.isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
               {budget.category}
            </p>

            <p className={`text-xs font-bold ${
               exceeded
               ? 'text-rose-500'
               : state.isDarkMode
                  ? 'text-[#94a3b8]'
                  : 'text-slate-500'
            }`}>
               ₹{spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
            </p>
         </div>

         {/* Progress Bar */}
         <div className={`w-full h-3 rounded-full overflow-hidden ${
            state.isDarkMode ? 'bg-white/10' : 'bg-slate-100'
         }`}>
            <div
               className={`h-full transition-all duration-700 ${
               exceeded
                  ? 'bg-rose-500'
                  : state.isDarkMode
                     ? 'bg-[#a855f7]'
                     : 'bg-blue-600'
               }`}
               style={{ width: `${percentage}%` }}
            />
         </div>

         {/* Percentage Label */}
         <p className={`text-[10px] font-semibold ${
            exceeded
               ? 'text-rose-500'
               : state.isDarkMode
               ? 'text-[#94a3b8]'
               : 'text-slate-500'
         }`}>
            {percentage.toFixed(0)}% used
         </p>
         </div>
      );
   })}
            </div>
   <div className="space-y-6 mt-10">
  <div className="mt-12">
  <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${
    state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'
  }`}>
    Category Wise Expenditure
  </p>

  {categoryData.length === 0 ? (
    <p className={`text-xs ${
      state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'
    }`}>
      No expense data for this month.
    </p>
  ) : (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: '16px',
              border: 'none',
              backgroundColor: state.isDarkMode ? '#1e1b39' : '#ffffff',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) =>
              `₹${value.toLocaleString()}`
            }
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}
</div>

</div>
  <p className={`text-[10px] font-black uppercase tracking-widest ${
    state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'
  }`}>
    Lend & Borrow Overview
  </p>

  {(() => {
    const totalLent = state.transactions
      .filter(t => t.type === 'LENT')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBorrowed = state.transactions
      .filter(t => t.type === 'BORROWED')
      .reduce((sum, t) => sum + t.amount, 0);

    const net = totalLent - totalBorrowed;

    return (
      <div className="grid grid-cols-3 gap-4">

        {/* Lent */}
        <div className={`p-5 rounded-3xl border ${
          state.isDarkMode
            ? 'bg-emerald-500/5 border-emerald-500/20'
            : 'bg-emerald-50 border-emerald-100'
        }`}>
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-500">
            You Lent
          </p>
          <p className="text-lg font-extrabold text-emerald-500 mt-2">
            ₹{totalLent.toLocaleString()}
          </p>
        </div>

        {/* Borrowed */}
        <div className={`p-5 rounded-3xl border ${
          state.isDarkMode
            ? 'bg-rose-500/5 border-rose-500/20'
            : 'bg-rose-50 border-rose-100'
        }`}>
          <p className="text-[10px] font-bold uppercase tracking-wide text-rose-500">
            You Borrowed
          </p>
          <p className="text-lg font-extrabold text-rose-500 mt-2">
            ₹{totalBorrowed.toLocaleString()}
          </p>
        </div>

        {/* Net */}
        <div className={`p-5 rounded-3xl border ${
          state.isDarkMode
            ? 'bg-blue-500/5 border-blue-500/20'
            : 'bg-blue-50 border-blue-100'
        }`}>
          <p className="text-[10px] font-bold uppercase tracking-wide text-blue-500">
            Net Position
          </p>
          <p className={`text-lg font-extrabold mt-2 ${
            net >= 0 ? 'text-emerald-500' : 'text-rose-500'
          }`}>
            ₹{Math.abs(net).toLocaleString()}
          </p>
        </div>

      </div>
    );
  })()}
      </div>
    </div>
  );
};

export default Analytics;
