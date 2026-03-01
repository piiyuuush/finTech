
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

  const handleRemind = (transaction: Transaction) => {
  if (!transaction.email) return;

  const subject = "Payment Reminder";
  const body = `Hi ${transaction.person || ""},

This is a reminder regarding the amount of ${state.currency}${transaction.amount}.

Please arrange payment at your earliest convenience.

Thank you.`;

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodeURIComponent(transaction.email)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, "_blank");
};

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
            id="search"
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
  className={`group relative p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
    state.isDarkMode
      ? 'bg-[#1e1b39]/60 border-white/5 hover:border-white/20 backdrop-blur-xl'
      : 'bg-white border-slate-100 hover:shadow-xl shadow-sm'
  }`}
>
  <div className="flex items-start justify-between gap-4">
    
    {/* LEFT SECTION */}
    <div className="flex items-start gap-4 overflow-hidden">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          state.isDarkMode
            ? 'bg-gradient-to-br from-white/10 to-white/5'
            : 'bg-gradient-to-br from-slate-50 to-slate-100'
        }`}
      >
        {getTransactionIcon(t.type)}
      </div>

      <div className="overflow-hidden">
        <div className="flex items-center gap-2">
          <p
            className={`font-bold text-sm truncate ${
              state.isDarkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            {t.category}
          </p>

          {t.person && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                state.isDarkMode
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {t.person}
            </span>
          )}
        </div>

        <p
          className={`text-[11px] font-medium mt-1 ${
            state.isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {t.date} •{" "}
          {state.accounts
            .find(a => a.id === t.accountId)
            ?.name.split(" ")[0]}
        </p>
      </div>
    </div>

    {/* RIGHT SECTION */}
    <div className="flex flex-col items-end gap-3">

      {/* Amount */}
      <p
        className={`text-base font-extrabold ${
          t.type === TransactionType.INCOME ||
          t.type === TransactionType.BORROWED
            ? 'text-emerald-500'
            : t.type === TransactionType.TRANSFER
            ? 'text-blue-500'
            : 'text-rose-500'
        }`}
      >
        {t.type === TransactionType.INCOME ||
        t.type === TransactionType.BORROWED
          ? "+"
          : "-"}
        {state.currency}
        {t.amount.toLocaleString()}
      </p>

      {/* LENT ACTIONS */}
      {t.type === TransactionType.LENT && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteTransaction(t);
            }}
            className="px-3 py-1.5 text-[11px] font-semibold rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition"
          >
            ✓ Received
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemind(t);
            }}
            className="px-3 py-1.5 text-[11px] font-semibold rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition"
          >
            ✉ Remind
          </button>
        </div>
      )}
      {t.type === TransactionType.BORROWED && (
  <div className="flex gap-2 mt-2">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        deleteTransaction(t); // or replace with convert-to-expense if needed
      }}
      className={`px-3 py-1 text-[10px] font-bold rounded-xl transition ${
        state.isDarkMode
          ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      }`}
    >
      Paid
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
