
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, Account, FinancialGoal, Transaction } from '../types';
import { MoreHorizontal, Wallet, Edit2, Trash2, ArrowRightLeft, UserMinus, UserPlus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import AccountModal from './AccountModal';
import TransactionModal from './TransactionModal';
import GoalModal from './GoalModal';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { state, dispatch } = useFinance();
  
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
    if (confirm('Are you sure you want to delete this account? All associated transactions will be removed.')) {
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
      case TransactionType.INCOME: return <ArrowDownLeft size={20} className="text-emerald-600" />;
      case TransactionType.EXPENSE: return <ArrowUpRight size={20} className="text-rose-600" />;
      case TransactionType.TRANSFER: return <ArrowRightLeft size={20} className="text-blue-600" />;
      case TransactionType.LENT: return <UserMinus size={20} className="text-amber-600" />;
      case TransactionType.BORROWED: return <UserPlus size={20} className="text-indigo-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Section */}
      <section>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">WELCOME BACK,</p>
        <h2 className="text-3xl font-black text-slate-900">{state.userName}</h2>
      </section>

      {/* Account Cards - Horizontal Scroll */}
      <section className="relative overflow-visible">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth">
          {state.accounts.map((acc) => (
            <div 
              key={acc.id} 
              onClick={() => handleEditAccount(acc)}
              className={`${acc.color || 'bg-blue-600'} min-w-[320px] h-[200px] rounded-[32px] p-8 text-white relative flex flex-col justify-between shadow-2xl shadow-indigo-100 transition-transform hover:scale-[1.02] cursor-pointer group`}
            >
                <div className="flex justify-between items-start relative">
                   <div>
                      <p className="text-xs opacity-70 font-medium tracking-wide">Current Balance</p>
                      <h3 className="text-3xl font-black mt-1">{state.currency} {acc.balance.toLocaleString()}</h3>
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
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-2xl py-2 z-50 text-slate-800 animate-in fade-in zoom-in duration-200">
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleEditAccount(acc); }}
                             className="w-full px-4 py-2 text-left text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
                           >
                              <Edit2 size={14} className="text-blue-600" /> Edit
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleDeleteAccount(acc.id); }}
                             className="w-full px-4 py-2 text-left text-sm font-bold flex items-center gap-2 hover:bg-slate-50 text-rose-600 transition-colors"
                           >
                              <Trash2 size={14} /> Delete
                           </button>
                        </div>
                      )}
                   </div>
                </div>
                
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] opacity-60 font-mono tracking-widest mb-1">{acc.cardNumber || '**** **** **** 0000'}</p>
                      <p className="text-xs font-bold uppercase tracking-widest">{acc.name}</p>
                   </div>
                   <div className="w-10 h-6 bg-white/20 rounded-md backdrop-blur-sm flex items-center justify-center">
                      <div className="w-4 h-4 bg-orange-400 rounded-full -mr-1.5 opacity-80"></div>
                      <div className="w-4 h-4 bg-red-400 rounded-full opacity-80"></div>
                   </div>
                </div>
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none"></div>
            </div>
          ))}
          <button 
            onClick={() => { setEditingAccount(undefined); setShowAccountModal(true); }}
            className="min-w-[320px] h-[200px] border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group"
          >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                 <Wallet size={24} />
              </div>
              <p className="font-bold text-sm">Add New Card</p>
          </button>
        </div>
      </section>

      {/* Financial Goals */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-xl font-black text-slate-900">Financial Goals</h3>
           <button 
            onClick={() => onNavigate('goals')}
            className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
           >View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {state.goals.slice(0, 4).map(goal => (
             <div 
                key={goal.id} 
                onClick={() => handleEditGoal(goal)}
                className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
             >
                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                   {goal.icon || '🎯'}
                </div>
                <p className="text-xs font-black text-slate-800 mb-1">{goal.name}</p>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                   <span>{state.currency}{Math.round(goal.currentAmount/1000)}k / {state.currency}{Math.round(goal.targetAmount/1000)}k</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                   <div 
                    className="bg-orange-400 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                   />
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
           <button 
            onClick={() => onNavigate('transactions')}
            className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
           >View All</button>
        </div>
        <div className="bg-white rounded-[32px] border border-slate-100 p-2 shadow-sm overflow-hidden">
           {state.transactions.length > 0 ? (
             <div className="divide-y divide-slate-50">
               {state.transactions.slice(0, 5).map(t => (
                 <div 
                    key={t.id} 
                    onClick={() => handleEditTransaction(t)}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer group rounded-2xl"
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all`}>
                          {getTransactionIcon(t.type)}
                       </div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{t.description || t.category}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {t.category} {t.person ? `• ${t.person}` : ''} • {t.date}
                          </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`font-black text-sm ${
                            t.type === TransactionType.INCOME || t.type === TransactionType.BORROWED 
                            ? 'text-emerald-600' 
                            : t.type === TransactionType.TRANSFER 
                            ? 'text-blue-600' 
                            : 'text-rose-600'
                        }`}>
                          {t.type === TransactionType.INCOME || t.type === TransactionType.BORROWED ? '+' : '-'}{state.currency}{t.amount.toLocaleString()}
                       </p>
                       <p className="text-[10px] font-bold text-slate-300">
                        {state.accounts.find(a => a.id === t.accountId)?.name}
                       </p>
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="py-12 text-center">
                <p className="text-slate-400 font-bold text-sm">No transactions yet.</p>
                <p className="text-xs text-slate-300 mt-1 uppercase tracking-widest font-black">Add your first transaction to see it here!</p>
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
