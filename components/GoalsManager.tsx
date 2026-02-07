
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FinancialGoal, FinancialBudget } from '../types';
import { Plus, Target, Calendar, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import GoalModal from './GoalModal';
import BudgetModal from './BudgetModal';

const GoalsManager: React.FC = () => {
  const { state, dispatch } = useFinance();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | undefined>();
  const [openGoalMenuId, setOpenGoalMenuId] = useState<string | null>(null);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<FinancialBudget | undefined>();
  const [openBudgetMenuId, setOpenBudgetMenuId] = useState<string | null>(null);

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
    setOpenGoalMenuId(null);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      dispatch({ type: 'DELETE_GOAL', payload: id });
    }
    setOpenGoalMenuId(null);
  };

  const handleEditBudget = (budget: FinancialBudget) => {
    setEditingBudget(budget);
    setShowBudgetModal(true);
    setOpenBudgetMenuId(null);
  };

  const handleDeleteBudget = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      dispatch({ type: 'DELETE_BUDGET', payload: id });
    }
    setOpenBudgetMenuId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-black transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>Your Savings Goals</h2>
          <p className={`text-sm font-medium mt-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Track and manage your future dreams.</p>
        </div>
        <button 
          onClick={() => { setEditingGoal(undefined); setShowGoalModal(true); }}
          className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 ${
            state.isDarkMode 
              ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/20 hover:bg-[#10b981]/90' 
              : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700'
          }`}
        >
          <Plus size={18} /> New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.goals.map(goal => (
          <div 
            key={goal.id} 
            onClick={() => handleEditGoal(goal)}
            className={`p-6 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden ${
              state.isDarkMode 
                ? 'bg-[#1e1b39]/60 backdrop-blur-xl border-white/5 shadow-none hover:border-white/20 hover:-translate-y-1' 
                : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
            } ${openGoalMenuId === goal.id ? 'z-50' : 'z-0'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform ${
                state.isDarkMode ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {goal.icon || '🎯'}
              </div>
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setOpenGoalMenuId(openGoalMenuId === goal.id ? null : goal.id); }}
                  className={`p-2 rounded-full transition-colors ${
                    state.isDarkMode ? 'text-[#94a3b8] hover:text-white hover:bg-white/5' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MoreVertical size={20} />
                </button>
                {openGoalMenuId === goal.id && (
                  <div className={`absolute right-0 top-full mt-2 w-32 shadow-2xl rounded-2xl py-2 z-[60] border animate-in fade-in zoom-in duration-150 ${
                    state.isDarkMode ? 'bg-[#1e1b39] border-white/10 text-white' : 'bg-white border-slate-50'
                  }`}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditGoal(goal); }}
                      className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors ${
                        state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                      }`}
                    >
                      <Edit2 size={12} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-blue-600'} /> Edit
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }}
                      className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors text-rose-600 ${
                        state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                      }`}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`font-black text-lg transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{goal.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <Calendar size={12} className={`mb-0.5 ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Target: {goal.deadline}</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-tighter ${state.isDarkMode ? 'text-[#94a3b8]/50' : 'text-slate-300'}`}>Saved</p>
                  <p className={`font-black transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>{state.currency}{goal.currentAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-bold uppercase tracking-tighter ${state.isDarkMode ? 'text-[#94a3b8]/50' : 'text-slate-300'}`}>Goal</p>
                  <p className={`font-black ${state.isDarkMode ? 'text-[#10b981]' : 'text-emerald-600'}`}>{state.currency}{goal.targetAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className={`relative h-3 rounded-full overflow-hidden transition-colors ${state.isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                    state.isDarkMode ? 'bg-[#10b981]' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                />
                <div className="absolute inset-0 bg-white/10" />
              </div>

              <p className={`text-[10px] font-bold text-right uppercase tracking-widest ${state.isDarkMode ? 'text-[#94a3b8]/50' : 'text-slate-400'}`}>
                {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% Completed
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Budget Limits */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-2xl font-black transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>Budget Limits</h3>
              <p className={`text-sm font-medium mt-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Control your monthly spending by category.</p>
            </div>
            <button 
              onClick={() => { setEditingBudget(undefined); setShowBudgetModal(true); }}
              className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 ${
                state.isDarkMode 
                  ? 'bg-[#a855f7] text-white shadow-lg shadow-[#a855f7]/20 hover:bg-[#a855f7]/90' 
                  : 'bg-slate-900 text-white shadow-lg shadow-100 hover:bg-slate-800'
              }`}
            >
              <Plus size={18} /> New Budget
            </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.budget.map(budget => (
            <div 
              key={budget.id}
              onClick={() => handleEditBudget(budget)}
              className={`p-6 rounded-[32px] border flex items-center justify-between group cursor-pointer transition-all relative overflow-hidden ${
                state.isDarkMode 
                  ? 'bg-[#1e1b39]/40 border-white/5 shadow-none hover:border-white/20' 
                  : 'bg-white border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-xl'
              } ${openBudgetMenuId === budget.id ? 'z-50' : 'z-0'}`}
            >
               <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform ${
                    state.isDarkMode ? 'bg-[#a855f7]/10 text-[#a855f7]' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {budget.icon || '💰'}
                  </div>
                  <div>
                     <p className={`font-black text-sm uppercase tracking-tight transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{budget.category}</p>
                     <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Monthly Allowance</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className="text-right">
                    <p className={`font-black text-sm transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{state.currency}{budget.currentAmount.toLocaleString()} / {state.currency}{budget.limit.toLocaleString()}</p>
                    <p className={`text-[10px] font-black uppercase mt-1 ${budget.currentAmount > budget.limit ? 'text-rose-500' : (state.isDarkMode ? 'text-[#a855f7]' : 'text-indigo-500')}`}>
                      {Math.round((budget.currentAmount/budget.limit) * 100)}% used
                    </p>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setOpenBudgetMenuId(openBudgetMenuId === budget.id ? null : budget.id); }}
                      className={`p-2 rounded-full transition-colors ${
                        state.isDarkMode ? 'text-[#94a3b8] hover:text-white hover:bg-white/5' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openBudgetMenuId === budget.id && (
                      <div className={`absolute right-0 top-full mt-2 w-32 shadow-2xl rounded-2xl py-2 z-[60] border animate-in fade-in zoom-in duration-150 ${
                        state.isDarkMode ? 'bg-[#1e1b39] border-white/10 text-white' : 'bg-white border-slate-50'
                      }`}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEditBudget(budget); }}
                          className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors ${
                            state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                          }`}
                        >
                          <Edit2 size={12} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-blue-600'} /> Edit
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteBudget(budget.id); }}
                          className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors text-rose-600 ${
                            state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                          }`}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
               </div>
               
               {/* Progress bar background */}
               <div className={`absolute bottom-0 left-0 h-1 w-full overflow-hidden transition-colors ${state.isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                 <div 
                   className={`h-full transition-all duration-1000 ${budget.currentAmount > budget.limit ? 'bg-rose-500' : (state.isDarkMode ? 'bg-[#a855f7]' : 'bg-indigo-500')}`}
                   style={{ width: `${Math.min(100, (budget.currentAmount/budget.limit) * 100)}%` }}
                 />
               </div>
            </div>
          ))}
         </div>

         {state.budget.length === 0 && (
           <div className={`py-20 rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center transition-all ${
             state.isDarkMode ? 'bg-[#1e1b39]/40 border-white/10 text-[#94a3b8]' : 'bg-white border-slate-100 text-slate-400'
           }`}>
             <Target size={48} className="mb-4 opacity-10" />
             <p className="font-black">No budgets established.</p>
             <p className="text-xs font-medium mt-1">Control your categories and save more.</p>
           </div>
         )}
      </section>

      {showGoalModal && <GoalModal editingGoal={editingGoal} onClose={() => { setShowGoalModal(false); setEditingGoal(undefined); }} />}
      {showBudgetModal && <BudgetModal editingBudget={editingBudget} onClose={() => { setShowBudgetModal(false); setEditingBudget(undefined); }} />}
    </div>
  );
};

export default GoalsManager;
