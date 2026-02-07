
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, Transaction } from '../types';
import { Plus, Trash2, Search, MoreHorizontal, Edit2, ArrowRightLeft, UserPlus, UserMinus, ArrowDownLeft, ArrowUpRight, Receipt, Repeat, Handshake } from 'lucide-react';
import TransactionModal from './TransactionModal';

type SubTab = 'spending' | 'self' | 'debt';

const TransactionManager: React.FC = () => {
  const { state, dispatch } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('spending');
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getFilteredTransactions = () => {
    return state.transactions.filter(t => {
      const matchesSearch = 
        t.description.toLowerCase().includes(search.toLowerCase()) || 
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        (t.person?.toLowerCase() || '').includes(search.toLowerCase());
      
      let matchesTab = false;
      
      if (activeSubTab === 'spending') {
        matchesTab = t.type === TransactionType.INCOME || t.type === TransactionType.EXPENSE;
      } else if (activeSubTab === 'self') {
        matchesTab = t.type === TransactionType.TRANSFER;
      } else if (activeSubTab === 'debt') {
        matchesTab = t.type === TransactionType.LENT || t.type === TransactionType.BORROWED;
      }
      return matchesSearch && matchesTab;
    });
  };

  const totalLent = state.transactions.filter(d => d.type === TransactionType.LENT).reduce((a, b) => a + b.amount, 0);
  const totalBorrowed = state.transactions.filter(d => d.type === TransactionType.BORROWED).reduce((a, b) => a + b.amount, 0);
  const totalIncome = state.transactions.filter(d => d.type === TransactionType.INCOME).reduce((a, b) => a + b.amount, 0);
  const totalExpense = state.transactions.filter(d => d.type === TransactionType.EXPENSE).reduce((a, b) => a + b.amount, 0);
  const filteredTransactions = getFilteredTransactions();

  const tabconfig = {
    debt: {
      showSummary: true,
      leftLabel: 'I Lent (Owed to me)',
      rightLabel: 'I Borrowed (I owe)',
      leftValue: totalLent,
      rightValue: totalBorrowed,
      leftColor: state.isDarkMode ? '#10b981' : '#10b981',
      rightColor: state.isDarkMode ? '#f59e0b' : '#f59e0b',
      LeftIcon: UserPlus,
      RightIcon: UserMinus,
    },
    self: {
      showSummary: false
    },
    spending: {
      showSummary: true,
      leftLabel: 'Total Expense',
      rightLabel: 'Total Income',
      leftValue: totalExpense,
      rightValue: totalIncome,
      leftColor: state.isDarkMode ? '#f43f5e' : '#e11d48',
      rightColor: state.isDarkMode ? '#10b981' : '#059669',
      LeftIcon: UserMinus,
      RightIcon: UserPlus,
    },
  };

  const config: any = tabconfig[activeSubTab];

  const handleEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setShowModal(true);
    setOpenMenuId(null);
  };

  const deleteTransaction = (t: Transaction) => {
    if (confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: t.id });
      
      if (t.type === TransactionType.TRANSFER) {
        if (t.toAccountId) {
          dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { id: t.accountId, amount: t.amount } });
          dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { id: t.toAccountId, amount: -t.amount } });
        }
      } else if (t.type === TransactionType.INCOME || t.type === TransactionType.BORROWED) {
        dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { id: t.accountId, amount: -t.amount } });
      } else if (t.type === TransactionType.EXPENSE || t.type === TransactionType.LENT) {
        dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { id: t.accountId, amount: t.amount } });
      }
    }
    setOpenMenuId(null);
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME: return <ArrowDownLeft size={16} className={state.isDarkMode ? 'text-[#10b981]' : 'text-emerald-500'} />;
      case TransactionType.EXPENSE: return <ArrowUpRight size={16} className={state.isDarkMode ? 'text-[#f43f5e]' : 'text-rose-500'} />;
      case TransactionType.TRANSFER: return <ArrowRightLeft size={16} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-blue-500'} />;
      case TransactionType.LENT: return <UserMinus size={16} className={state.isDarkMode ? 'text-[#f59e0b]' : 'text-amber-500'} />;
      case TransactionType.BORROWED: return <UserPlus size={16} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-indigo-500'} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Search and Section Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${state.isDarkMode ? 'text-white/20' : 'text-slate-400'}`} size={18} />
          <input 
            type="text" 
            placeholder="Search records..." 
            className={`w-full pl-12 pr-4 py-4 rounded-3xl shadow-sm focus:ring-2 focus:outline-none font-medium text-sm transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white focus:ring-[#a855f7]/20 placeholder:text-white/20' : 'bg-white border border-slate-100 text-slate-900 focus:ring-blue-100'}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={`flex p-1.5 rounded-[24px] overflow-x-auto no-scrollbar transition-colors ${state.isDarkMode ? 'bg-[#1e1b39]/60 border border-white/5' : 'bg-slate-100'}`}>
          {[
            { id: 'spending', label: 'Spending', icon: <Receipt size={16} /> },
            { id: 'self', label: 'Self', icon: <Repeat size={16} /> },
            { id: 'debt', label: 'Lending', icon: <Handshake size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeSubTab === tab.id ? (state.isDarkMode ? 'bg-[#a855f7] text-white shadow-lg' : 'bg-white shadow-sm text-blue-600') : (state.isDarkMode ? 'text-[#94a3b8] hover:text-white' : 'text-slate-500 hover:text-slate-700')
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          { config.showSummary && (
            <>
              <div className={`p-6 rounded-2xl shadow-sm border transition-all ${state.isDarkMode ? 'bg-[#1e1b39]/40 border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${state.isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`} style={{ color: config.leftColor }}>
                    <config.LeftIcon size={24} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                      {config.leftLabel}
                    </p>
                    <h2 className="text-2xl font-bold transition-all" style={{ color: config.leftColor }}>
                      {state.currency}{config.leftValue.toLocaleString()}
                    </h2>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl shadow-sm border transition-all ${state.isDarkMode ? 'bg-[#1e1b39]/40 border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${state.isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`} style={{ color: config.rightColor }}>
                    <config.RightIcon size={24} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                      {config.rightLabel}
                    </p>
                    <h2 className="text-2xl font-bold transition-all" style={{ color: config.rightColor }}>
                      {state.currency}{config.rightValue.toLocaleString()}
                    </h2>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <div 
              key={t.id} 
              className={`p-4 rounded-[28px] border flex items-center justify-between transition-all active:scale-[0.98] relative ${state.isDarkMode ? 'bg-[#1e1b39]/40 border-white/5 hover:border-white/20 shadow-none' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'} ${openMenuId === t.id ? 'z-50' : 'z-0'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 min-w-[40px] rounded-2xl flex items-center justify-center transition-colors ${state.isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                  {getTransactionIcon(t.type)}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className={`font-black text-sm truncate transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.category}</p>
                    {t.person && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md truncate transition-colors ${state.isDarkMode ? 'text-[#a855f7] bg-[#a855f7]/10' : 'text-blue-500 bg-blue-50'}`}>
                        {t.person}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                    {t.date} • {state.accounts.find(a => a.id === t.accountId)?.name.split(' ')[0]}
                    {t.type === TransactionType.TRANSFER && (
                      <>
                        <ArrowRightLeft size={8} /> 
                        {state.accounts.find(a => a.id === t.toAccountId)?.name.split(' ')[0]}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`font-black text-sm whitespace-nowrap ${
                    t.type === TransactionType.INCOME || t.type === TransactionType.BORROWED ? (state.isDarkMode ? 'text-[#10b981]' : 'text-emerald-600') : 
                    t.type === TransactionType.TRANSFER ? (state.isDarkMode ? 'text-[#a855f7]' : 'text-blue-600') : (state.isDarkMode ? 'text-[#f43f5e]' : 'text-rose-600')
                  }`}>
                    {t.type === TransactionType.INCOME || t.type === TransactionType.BORROWED ? '+' : '-'}{state.currency}{t.amount.toLocaleString()}
                  </p>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)}
                    className={`p-2 transition-colors ${state.isDarkMode ? 'text-white/20 hover:text-white' : 'text-slate-300 hover:text-slate-600'}`}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {openMenuId === t.id && (
                    <div className={`absolute right-0 top-full mt-1 w-32 shadow-2xl rounded-2xl py-2 z-[60] border animate-in fade-in zoom-in duration-150 ${state.isDarkMode ? 'bg-[#1e1b39] border-white/10 text-white' : 'bg-white border-slate-50'}`}>
                      <button onClick={() => handleEdit(t)} className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors ${state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                        <Edit2 size={12} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-blue-600'} /> Edit
                      </button>
                      <button onClick={() => deleteTransaction(t)} className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2 text-rose-600 transition-colors ${state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`py-20 text-center rounded-[40px] border border-dashed transition-all ${state.isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${state.isDarkMode ? 'bg-white/5 text-white/20' : 'bg-slate-50 text-slate-300'}`}>
              <Search size={24} />
            </div>
            <p className={`font-black text-sm transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>No records found</p>
            <p className={`text-xs mt-1 uppercase tracking-widest font-bold transition-colors ${state.isDarkMode ? 'text-[#94a3b8]/50' : 'text-slate-300'}`}>Try adjusting your filters</p>
          </div>
        )}
      </div>

      {showModal && <TransactionModal editingTransaction={editingTransaction} onClose={() => { setShowModal(false); setEditingTransaction(undefined); }} />}
    </div>
  );
};

export default TransactionManager;
