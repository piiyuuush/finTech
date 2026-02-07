
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, Account, FinancialGoal, Transaction } from '../types';
import { TRANSLATIONS } from '../constants';
import { MoreHorizontal, Wallet, Edit2, Trash2, ArrowRightLeft, UserMinus, UserPlus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import AccountModal from './AccountModal';
import TransactionModal from './TransactionModal';
import GoalModal from './GoalModal';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { state, dispatch } = useFinance();
  const t_dash = TRANSLATIONS[state.language];
  
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  const [openAccMenuId, setOpenAccMenuId] = useState<string | null>(null);

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | undefined>();

  const handleEditAccount = (acc: Account) => {
    setEditingAccount(acc);
    setShowAccountModal(true);
    setOpenAccMenuId(null);
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure?')) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    }
    setOpenAccMenuId(null);
  };

  const handleEditTransaction = (t: Transaction) => {
    setEditingTransaction(t);
    setShowTransactionModal(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME: return <ArrowDownLeft size={20} className={state.isDarkMode ? 'text-[#10b981]' : 'text-emerald-600'} />;
      case TransactionType.EXPENSE: return <ArrowUpRight size={20} className={state.isDarkMode ? 'text-[#f43f5e]' : 'text-rose-600'} />;
      case TransactionType.TRANSFER: return <ArrowRightLeft size={20} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-indigo-600'} />;
      case TransactionType.LENT: return <UserMinus size={20} className={state.isDarkMode ? 'text-[#f59e0b]' : 'text-amber-600'} />;
      case TransactionType.BORROWED: return <UserPlus size={20} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-indigo-600'} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Section */}
      <section>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>{t_dash.welcome}</p>
        <h2 className={`text-4xl font-black tracking-tight transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>{state.userName}</h2>
      </section>

      {/* Account Cards - Horizontal Scroll */}
      <section className="relative overflow-visible">
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth">
          {state.accounts.map((acc) => (
            <div 
              key={acc.id} 
              onClick={() => handleEditAccount(acc)}
              className={`${state.isDarkMode ? (acc.color === 'bg-indigo-600' ? 'bg-[#a855f7]' : acc.color || 'bg-[#a855f7]') : (acc.color || 'bg-indigo-600')} min-w-[340px] h-[210px] rounded-[40px] p-8 text-white relative flex flex-col justify-between shadow-2xl transition-all hover:scale-[1.03] cursor-pointer group hover:rotate-1 ${state.isDarkMode ? 'shadow-[#000]/20' : 'shadow-slate-200'} ${openAccMenuId === acc.id ? 'z-[100]' : 'z-10'}`}
            >
                <div className="flex justify-between items-start relative">
                   <div>
                      <p className="text-[10px] opacity-70 font-black uppercase tracking-widest">Current Balance</p>
                      <h3 className="text-3xl font-black mt-1 tracking-tight">{state.currency} {acc.balance.toLocaleString()}</h3>
                   </div>
                   <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenAccMenuId(openAccMenuId === acc.id ? null : acc.id);
                        }}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                         <MoreHorizontal size={20} />
                      </button>
                      
                      {openAccMenuId === acc.id && (
                        <div className={`absolute right-0 mt-2 w-32 rounded-2xl shadow-2xl py-2 z-[110] animate-in fade-in zoom-in duration-200 ${state.isDarkMode ? 'bg-[#1e1b39] text-white border border-white/10' : 'bg-white text-slate-800'}`}>
                           <button onClick={(e) => { e.stopPropagation(); handleEditAccount(acc); }} className={`w-full px-4 py-2 text-left text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                              <Edit2 size={14} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-indigo-600'} /> Edit
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); handleDeleteAccount(acc.id); }} className={`w-full px-4 py-2 text-left text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors text-rose-500 ${state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                              <Trash2 size={14} /> Delete
                           </button>
                        </div>
                      )}
                   </div>
                </div>
                
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] opacity-60 font-mono tracking-widest mb-1 font-bold">{acc.cardNumber || '**** **** **** 0000'}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">{acc.name}</p>
                   </div>
                   <div className="w-12 h-8 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center">
                      <div className="w-5 h-5 bg-orange-400 rounded-full -mr-2 opacity-80 shadow-sm"></div>
                      <div className="w-5 h-5 bg-red-400 rounded-full opacity-80 shadow-sm"></div>
                   </div>
                </div>
            </div>
          ))}
          <button 
            onClick={() => { setEditingAccount(undefined); setShowAccountModal(true); }}
            className={`min-w-[340px] h-[210px] border-4 border-dashed rounded-[40px] flex flex-col items-center justify-center transition-all cursor-pointer group ${state.isDarkMode ? 'border-white/10 text-[#94a3b8] hover:border-[#a855f7]/50 hover:text-[#a855f7] hover:bg-[#a855f7]/5' : 'border-slate-100 text-slate-300 hover:border-indigo-200 hover:text-indigo-400 hover:bg-indigo-50/50'}`}
          >
              <div className={`w-14 h-14 rounded-3xl flex items-center justify-center mb-3 group-hover:scale-110 transition-all ${state.isDarkMode ? 'bg-white/5 text-[#94a3b8] group-hover:bg-[#a855f7] group-hover:text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-white group-hover:shadow-xl group-hover:text-indigo-500'}`}>
                 <Wallet size={28} />
              </div>
              <p className="font-black text-xs uppercase tracking-[0.2em]">Add New Card</p>
          </button>
        </div>
      </section>

      {/* Financial Goals */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
           <h3 className={`text-xl font-black tracking-tight transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t_dash.savingsGoals}</h3>
           <button onClick={() => onNavigate('goals')} className={`font-black text-[10px] uppercase tracking-widest hover:underline transition-colors ${state.isDarkMode ? 'text-[#a855f7]' : 'text-indigo-600'}`}>View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {state.goals.slice(0, 4).map(goal => (
             <div 
                key={goal.id} 
                onClick={() => handleEditGoal(goal)}
                className={`p-6 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden ${state.isDarkMode ? 'bg-[#1e1b39]/60 backdrop-blur-xl border-white/5 shadow-none hover:border-white/20 hover:-translate-y-2' : 'bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2'}`}
             >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner ${state.isDarkMode ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-amber-50 text-amber-600'}`}>
                   {goal.icon || '🎯'}
                </div>
                <p className={`text-xs font-black mb-1 uppercase tracking-tight truncate transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{goal.name}</p>
                <div className={`flex justify-between items-center text-[9px] font-black uppercase tracking-widest transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                   <span>{state.currency}{Math.round(goal.currentAmount/1000)}k / {state.currency}{Math.round(goal.targetAmount/1000)}k</span>
                </div>
                <div className={`w-full h-2 rounded-full mt-3 overflow-hidden border transition-colors ${state.isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100/50'}`}>
                   <div 
                    className={`h-full rounded-full transition-all duration-1000 shadow-sm ${state.isDarkMode ? 'bg-[#10b981]' : 'bg-amber-500'}`} 
                    style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                   />
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
           <h3 className={`text-xl font-black tracking-tight transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t_dash.recentTransactions}</h3>
           <button onClick={() => onNavigate('transactions')} className={`font-black text-[10px] uppercase tracking-widest hover:underline transition-colors ${state.isDarkMode ? 'text-[#a855f7]' : 'text-indigo-600'}`}>View All</button>
        </div>
        <div className={`backdrop-blur-md rounded-[40px] border p-2 transition-all duration-500 ${state.isDarkMode ? 'bg-[#1e1b39]/40 border-white/5 shadow-none' : 'bg-white/80 border-slate-100 shadow-sm'}`}>
           {state.transactions.length > 0 ? (
             <div className={state.isDarkMode ? 'divide-y divide-white/5' : 'divide-y divide-slate-50'}>
               {state.transactions.slice(0, 5).map(t => (
                 <div 
                    key={t.id} 
                    onClick={() => handleEditTransaction(t)}
                    className={`flex items-center justify-between p-5 transition-all cursor-pointer group rounded-[28px] ${state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                 >
                    <div className="flex items-center gap-5">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all shadow-inner ${state.isDarkMode ? 'bg-white/5 group-hover:bg-white/10 group-hover:scale-105' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-lg group-hover:scale-105'}`}>
                          {getTransactionIcon(t.type)}
                       </div>
                       <div>
                          <p className={`font-black text-sm transition-colors uppercase tracking-tight ${state.isDarkMode ? 'text-white group-hover:text-[#a855f7]' : 'text-slate-800 group-hover:text-indigo-600'}`}>{t.description || t.category}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mt-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                            {t.category} {t.person ? `• ${t.person}` : ''} • {t.date}
                          </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`font-black text-base ${
                            t.type === TransactionType.INCOME || t.type === TransactionType.BORROWED 
                            ? (state.isDarkMode ? 'text-[#10b981]' : 'text-emerald-500')
                            : t.type === TransactionType.TRANSFER 
                            ? (state.isDarkMode ? 'text-[#a855f7]' : 'text-indigo-500')
                            : (state.isDarkMode ? 'text-[#f43f5e]' : 'text-rose-500')
                        }`}>
                          {t.type === TransactionType.INCOME || t.type === TransactionType.BORROWED ? '+' : '-'}{state.currency}{t.amount.toLocaleString()}
                       </p>
                       <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${state.isDarkMode ? 'text-[#94a3b8]/50' : 'text-slate-300'}`}>
                        {state.accounts.find(a => a.id === t.accountId)?.name.split(' ')[0]}
                       </p>
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="py-20 text-center">
                <p className={`font-black text-sm uppercase tracking-widest transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>No activity yet</p>
                <p className={`text-[10px] mt-2 uppercase tracking-[0.2em] font-bold transition-colors ${state.isDarkMode ? 'text-[#94a3b8]/50' : 'text-slate-300'}`}>Your financial journey starts here</p>
             </div>
           )}
        </div>
      </section>

      {showAccountModal && <AccountModal editingAccount={editingAccount} onClose={() => { setShowAccountModal(false); setEditingAccount(undefined); }} />}
      {showTransactionModal && <TransactionModal editingTransaction={editingTransaction} onClose={() => { setShowTransactionModal(false); setEditingTransaction(undefined); }} />}
      {showGoalModal && <GoalModal editingGoal={editingGoal} onClose={() => { setShowGoalModal(false); setEditingGoal(undefined); }} />}
    </div>
  );
};

export default Dashboard;
