
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FinancialGoal } from '../types';
import { Plus, Target, Calendar, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import GoalModal from './GoalModal';

const GoalsManager: React.FC = () => {
  const { state, dispatch } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | undefined>();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      dispatch({ type: 'DELETE_GOAL', payload: id });
    }
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Your Savings Goals</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Track and manage your future dreams.</p>
        </div>
        <button 
          onClick={() => { setEditingGoal(undefined); setShowModal(true); }}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
        >
          <Plus size={18} /> New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.goals.map(goal => (
          <div 
            key={goal.id} 
            onClick={() => handleEdit(goal)}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                {goal.icon || '🎯'}
              </div>
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === goal.id ? null : goal.id); }}
                  className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
                {openMenuId === goal.id && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white shadow-2xl rounded-2xl py-2 z-20 border border-slate-50 animate-in fade-in zoom-in duration-150">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(goal); }}
                      className="w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2 hover:bg-slate-50"
                    >
                      <Edit2 size={12} className="text-blue-600" /> Edit
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(goal.id); }}
                      className="w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2 hover:bg-slate-50 text-rose-600"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-black text-slate-800 text-lg">{goal.name}</h4>
                <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                  <Calendar size={12} className="mb-0.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Target: {goal.deadline}</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Saved</p>
                  <p className="font-black text-slate-900">{state.currency}{goal.currentAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Goal</p>
                  <p className="font-black text-emerald-600">{state.currency}{goal.targetAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                />
                <div className="absolute inset-0 bg-white/10" />
              </div>

              <p className="text-[10px] font-bold text-slate-400 text-right uppercase tracking-widest">
                {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% Completed
              </p>
            </div>
            
            {/* Background pattern */}
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={120} />
            </div>
          </div>
        ))}

        {state.goals.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
            <Target size={48} className="mb-4 opacity-20" />
            <p className="font-black text-lg">No goals set yet.</p>
            <p className="text-sm font-medium mt-1">Every big achievement starts with a simple goal.</p>
          </div>
        )}
      </div>

      {showModal && <GoalModal editingGoal={editingGoal} onClose={() => { setShowModal(false); setEditingGoal(undefined); }} />}
      {/* Budget Limits */}
      <section>
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-slate-900">Budget Limits</h3>
            <button 
              // onClick={() => { setEditingGoal(undefined); setShowModal(true); }}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
              >
              <Plus size={18} /> New Budget
            </button>
         </div>
         <div className="space-y-3">
          {state.budget.map(budget => (
            <div className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-blue-100 transition-colors"
            key={budget.id} 
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl">{budget.icon}</div>
                  <div>
                     <p className="font-black text-slate-800 text-sm">{budget.category}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spent vs Limit</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="font-black text-slate-800 text-sm">₹{budget.currentAmount}/₹{budget.limit}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">{Math.round((budget.currentAmount/budget.limit) * 100)}% used</p>
               </div>
            </div>
          ))}
         </div>
      </section>
    </div>
  );
};

export default GoalsManager;
