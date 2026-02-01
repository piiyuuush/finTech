
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Account, FinancialGoal } from '../types';
import { PiggyBank, CreditCard, Landmark, Plus, Trash2, Target, MoreVertical, Edit2 } from 'lucide-react';
import AccountModal from './AccountModal';
import GoalModal from './GoalModal';
import { stat } from 'fs';

const Profile: React.FC = () => {
  const { state, dispatch } = useFinance();
  const [showAccModal, setShowAccModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | undefined>();
  
  const [openAccMenuId, setOpenAccMenuId] = useState<string | null>(null);
  const [openGoalMenuId, setOpenGoalMenuId] = useState<string | null>(null);

  const handleEditAcc = (acc: Account) => {
    setEditingAccount(acc);
    setShowAccModal(true);
    setOpenAccMenuId(null);
  };

  const handleDeleteAcc = (id: string) => {
    if (confirm('Delete this account and all its transactions?')) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    }
    setOpenAccMenuId(null);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
    setOpenGoalMenuId(null);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Remove this savings goal?')) {
      dispatch({ type: 'DELETE_GOAL', payload: id });
    }
    setOpenGoalMenuId(null);
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'Bank': return <Landmark size={20} />;
          case 'Credit Card': return <CreditCard size={20} />;
          case 'Investment': return <Target size={20} />;
          default: return <PiggyBank size={20} />;
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* User Header */}
      <div className="flex items-center gap-6 p-6 bg-white rounded-[32px] shadow-sm border border-slate-100">
          <div className="w-20 h-20 rounded-full border-4 border-slate-50 overflow-hidden shadow-inner">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Piyush" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
              <h2 className="text-2xl font-black text-slate-800">{state.userName}</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Premium Member • Joined Jan 2024</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Accounts & Wallets */}
          <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-black text-slate-800">Accounts & Wallets</h3>
                  <button onClick={() => { setEditingAccount(undefined); setShowAccModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"><Plus size={20} /></button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                  {state.accounts.map(acc => (
                      <div key={acc.id} className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between shadow-sm hover:border-blue-100 hover:shadow-md transition-all group relative">
                          <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl ${acc.color || 'bg-slate-50'} text-white shadow-sm`}>{getIcon(acc.type)}</div>
                              <div>
                                  <p className="font-black text-slate-800 text-sm">{acc.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{acc.type} • {acc.cardNumber?.slice(-4)}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-4">
                              <span className="text-lg font-black text-slate-900">{state.currency}{acc.balance.toLocaleString()}</span>
                              <div className="relative">
                                  <button onClick={() => setOpenAccMenuId(openAccMenuId === acc.id ? null : acc.id)} className="p-1 text-slate-300 hover:text-slate-600">
                                      <MoreVertical size={16} />
                                  </button>
                                  {openAccMenuId === acc.id && (
                                      <div className="absolute right-0 top-full mt-1 w-28 bg-white shadow-xl rounded-xl py-1 z-10 border border-slate-100">
                                          <button onClick={() => handleEditAcc(acc)} className="w-full px-3 py-1.5 text-left text-xs font-bold flex items-center gap-2 hover:bg-slate-50">
                                              <Edit2 size={12} className="text-blue-600" /> Edit
                                          </button>
                                          <button onClick={() => handleDeleteAcc(acc.id)} className="w-full px-3 py-1.5 text-left text-xs font-bold flex items-center gap-2 hover:bg-slate-50 text-rose-600">
                                              <Trash2 size={12} /> Delete
                                          </button>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </section>

          {/* Financial Goals */}
          <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-black text-slate-800">Financial Goals</h3>
                  <button onClick={() => { setEditingGoal(undefined); setShowGoalModal(true); }} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"><Plus size={20} /></button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                  {state.goals.map(goal => (
                      <div key={goal.id} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-all relative">
                          <div className="flex justify-between items-start">
                              <div className="flex gap-2">
                                <span className="text-xl">{goal.icon || '🎯'}</span>
                                <div>
                                    <h4 className="font-black text-slate-800 text-sm">{goal.name}</h4>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Due: {goal.deadline}</span>
                                </div>
                              </div>
                              <div className="relative">
                                  <button onClick={() => setOpenGoalMenuId(openGoalMenuId === goal.id ? null : goal.id)} className="p-1 text-slate-300 hover:text-slate-600">
                                      <MoreVertical size={16} />
                                  </button>
                                  {openGoalMenuId === goal.id && (
                                      <div className="absolute right-0 top-full mt-1 w-28 bg-white shadow-xl rounded-xl py-1 z-10 border border-slate-100">
                                          <button onClick={() => handleEditGoal(goal)} className="w-full px-3 py-1.5 text-left text-xs font-bold flex items-center gap-2 hover:bg-slate-50">
                                              <Edit2 size={12} className="text-blue-600" /> Edit
                                          </button>
                                          <button onClick={() => handleDeleteGoal(goal.id)} className="w-full px-3 py-1.5 text-left text-xs font-bold flex items-center gap-2 hover:bg-slate-50 text-rose-600">
                                              <Trash2 size={12} /> Delete
                                          </button>
                                      </div>
                                  )}
                              </div>
                          </div>
                          <div className="flex justify-between items-end pt-1">
                              <div>
                                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Target</p>
                                  <p className="font-black text-slate-700">{state.currency}{goal.targetAmount.toLocaleString()}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Current</p>
                                  <p className="font-black text-blue-600">{state.currency}{goal.currentAmount.toLocaleString()}</p>
                              </div>
                          </div>
                          <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }} />
                          </div>
                      </div>
                  ))}
                  {state.goals.length === 0 && <p className="text-center py-12 text-slate-400 font-bold text-sm bg-white rounded-[28px] border border-dashed border-slate-200">Start saving! Set your first goal.</p>}
              </div>
          </section>
      </div>

      {showAccModal && <AccountModal editingAccount={editingAccount} onClose={() => { setShowAccModal(false); setEditingAccount(undefined); }} />}
      {showGoalModal && <GoalModal editingGoal={editingGoal} onClose={() => { setShowGoalModal(false); setEditingGoal(undefined); }} />}
    </div>
  );
};

export default Profile;
