
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, TransactionSubtype, Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { X, ChevronDown, Calendar, FileText, User } from 'lucide-react';

interface Props {
  onClose: () => void;
  editingTransaction?: Transaction;
}

const TransactionModal: React.FC<Props> = ({ onClose, editingTransaction }) => {
  const { state, dispatch } = useFinance();
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [formData, setFormData] = useState<Partial<Transaction>>({
    amount: 0,
    category: CATEGORIES.EXPENSE[0],
    date: new Date().toISOString().split('T')[0],
    description: '',
    accountId: state.accounts[0]?.id || '',
    toAccountId: state.accounts[1]?.id || '',
    person: '',
    subtype: TransactionSubtype.ONE_TIME
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData(editingTransaction);
      setType(editingTransaction.type);
    }
  }, [editingTransaction]);

  useEffect(() => {
    const cats = CATEGORIES[type] || CATEGORIES.EXPENSE;
    if (!cats.includes(formData.category!)) {
      setFormData(prev => ({ ...prev, category: cats[0] }));
    }
  }, [type]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.accountId) return;

    const transactionData: Transaction = {
      id: editingTransaction?.id || Math.random().toString(36).substr(2, 9),
      type,
      ...formData as any
    };

    const applyBalanceChanges = (t: Transaction, multiplier: 1 | -1) => {
      if (t.type === TransactionType.TRANSFER) {
        if (t.toAccountId) {
          dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { id: t.accountId, amount: -t.amount * multiplier } });
          dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { id: t.toAccountId, amount: t.amount * multiplier } });
        }
      } else if (t.type === TransactionType.INCOME || t.type === TransactionType.BORROWED) {
        dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { id: t.accountId, amount: t.amount * multiplier } });
      } else if (t.type === TransactionType.EXPENSE || t.type === TransactionType.LENT) {
        dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { id: t.accountId, amount: -t.amount * multiplier } });
      }
    };

    if (editingTransaction) {
      applyBalanceChanges(editingTransaction, -1);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transactionData });
      applyBalanceChanges(transactionData, 1);
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: transactionData });
      applyBalanceChanges(transactionData, 1);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <div className={`rounded-[40px] w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300 transition-all ${state.isDarkMode ? 'bg-[#1e1b39] border border-white/10 shadow-2xl' : 'bg-white shadow-2xl'}`}>
        <form onSubmit={handleSave}>
          <div className={`p-8 pb-4 flex justify-between items-start transition-colors ${state.isDarkMode ? 'bg-[#1e1b39]' : 'bg-white'}`}>
             <div className="flex-1 text-center">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Record Entry</p>
                <div className="relative inline-block mx-auto">
                    <span className={`absolute -left-8 top-1/2 -translate-y-1/2 text-3xl font-bold transition-colors ${state.isDarkMode ? 'text-white/20' : 'text-slate-300'}`}>{state.currency}</span>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      className={`text-5xl font-black bg-transparent border-none focus:outline-none w-48 text-center transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`} 
                      placeholder="0.00"
                      autoFocus={!editingTransaction}
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    />
                </div>
             </div>
             <button type="button" onClick={onClose} className={`p-2 rounded-full transition-colors ${state.isDarkMode ? 'text-white/40 hover:text-white bg-white/5' : 'text-slate-400 hover:text-slate-600 bg-slate-100'}`}>
                <X size={20} />
             </button>
          </div>

          <div className="p-8 space-y-6">
            <div className={`flex flex-wrap gap-1.5 p-1.5 rounded-[24px] transition-colors ${state.isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              {[
                { id: TransactionType.EXPENSE, label: 'Exp' },
                { id: TransactionType.INCOME, label: 'Inc' },
                { id: TransactionType.TRANSFER, label: 'Self' },
                { id: TransactionType.LENT, label: 'Lent' },
                { id: TransactionType.BORROWED, label: 'Borr' }
              ].map(t => (
                <button 
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex-1 py-2.5 px-1 rounded-[18px] text-[10px] font-black uppercase tracking-tight transition-all ${type === t.id ? (state.isDarkMode ? 'bg-[#a855f7] text-white' : 'bg-white shadow-sm text-blue-600') : (state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500')}`}
                >{t.label}</button>
              ))}
            </div>

            <div className="space-y-4">
               <div className="relative group">
                  <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                    {type === TransactionType.TRANSFER ? 'Source Account' : 'From Account'}
                  </p>
                  <select 
                    required
                    className={`w-full p-4 rounded-2xl text-sm font-semibold appearance-none focus:ring-2 focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white focus:ring-[#a855f7]/20' : 'bg-slate-50 border border-slate-100 text-slate-800 focus:ring-blue-100'}`}
                    value={formData.accountId}
                    onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                  >
                    {state.accounts.map(acc => (
                      <option key={acc.id} value={acc.id} className={state.isDarkMode ? 'bg-[#1e1b39] text-white' : ''}>{acc.name}</option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-4 bottom-4 transition-colors ${state.isDarkMode ? 'text-white/40' : 'text-slate-400'} pointer-events-none`} size={18} />
               </div>

               {type === TransactionType.TRANSFER && (
                 <div className="relative group animate-in slide-in-from-top-2 duration-200">
                    <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Target Account</p>
                    <select 
                      required
                      className={`w-full p-4 rounded-2xl text-sm font-semibold appearance-none focus:ring-2 focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white focus:ring-[#a855f7]/20' : 'bg-slate-50 border border-slate-100 text-slate-800 focus:ring-blue-100'}`}
                      value={formData.toAccountId}
                      onChange={(e) => setFormData({...formData, toAccountId: e.target.value})}
                    >
                      {state.accounts.filter(a => a.id !== formData.accountId).map(acc => (
                        <option key={acc.id} value={acc.id} className={state.isDarkMode ? 'bg-[#1e1b39] text-white' : ''}>{acc.name}</option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute right-4 bottom-4 transition-colors ${state.isDarkMode ? 'text-white/40' : 'text-slate-400'} pointer-events-none`} size={18} />
                 </div>
               )}

               {(type === TransactionType.LENT || type === TransactionType.BORROWED) && (
                 <div className="relative group animate-in slide-in-from-top-2 duration-200">
                    <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Associate / Person</p>
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        placeholder="Name..." 
                        className={`w-full p-4 pl-12 rounded-2xl text-sm font-semibold focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20' : 'bg-slate-50 border border-slate-100 text-slate-800'}`}
                        value={formData.person}
                        onChange={(e) => setFormData({...formData, person: e.target.value})}
                      />
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${state.isDarkMode ? 'text-white/20' : 'text-slate-300'}`} size={18} />
                    </div>
                 </div>
               )}

               {type !== TransactionType.TRANSFER && (
                 <div className="relative group">
                    <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Category</p>
                    <select 
                      required
                      className={`w-full p-4 rounded-2xl text-sm font-semibold appearance-none focus:ring-2 focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white focus:ring-[#a855f7]/20' : 'bg-slate-50 border border-slate-100 text-slate-800 focus:ring-blue-100'}`}
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {(CATEGORIES[type] || CATEGORIES.EXPENSE).map(c => (
                        <option key={c} value={c} className={state.isDarkMode ? 'bg-[#1e1b39] text-white' : ''}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute right-4 bottom-4 transition-colors ${state.isDarkMode ? 'text-white/40' : 'text-slate-400'} pointer-events-none`} size={18} />
                 </div>
               )}

               <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Date</p>
                    <div className="relative">
                      <input 
                        type="date" 
                        className={`w-full p-4 rounded-2xl text-sm font-semibold focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white [color-scheme:dark]' : 'bg-slate-50 border border-slate-100 text-slate-800'}`}
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                      <Calendar className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${state.isDarkMode ? 'text-white/20' : 'text-slate-300'} pointer-events-none`} size={16}/>
                    </div>
                  </div>
                  <div className="relative group">
                    <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Note</p>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="..." 
                        className={`w-full p-4 rounded-2xl text-sm font-semibold focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20' : 'bg-slate-50 border border-slate-100 text-slate-800'}`}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                      <FileText className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${state.isDarkMode ? 'text-white/20' : 'text-slate-300'} pointer-events-none`} size={16}/>
                    </div>
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              className={`w-full py-5 rounded-[28px] font-black text-lg transition-all active:scale-[0.98] ${state.isDarkMode ? 'bg-[#a855f7] text-white shadow-xl shadow-[#a855f7]/20 hover:bg-[#a855f7]/90' : 'bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700'}`}
            >
              Confirm Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
