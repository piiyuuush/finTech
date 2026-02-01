
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
      <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSave}>
          <div className="p-8 pb-4 flex justify-between items-start">
             <div className="flex-1 text-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Record Entry</p>
                <div className="relative inline-block mx-auto">
                    <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-300">{state.currency}</span>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      className="text-5xl font-black text-slate-800 bg-transparent border-none focus:outline-none w-48 text-center" 
                      placeholder="0.00"
                      autoFocus={!editingTransaction}
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    />
                </div>
             </div>
             <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors">
                <X size={20} />
             </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-[24px]">
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
                  className={`flex-1 py-2.5 px-1 rounded-[18px] text-[10px] font-black uppercase tracking-tight transition-all ${type === t.id ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >{t.label}</button>
              ))}
            </div>

            <div className="space-y-4">
               <div className="relative group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">
                    {type === TransactionType.TRANSFER ? 'Source Account' : 'From Account'}
                  </p>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold appearance-none focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    value={formData.accountId}
                    onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                  >
                    {state.accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 bottom-4 text-slate-400 pointer-events-none" size={18} />
               </div>

               {type === TransactionType.TRANSFER && (
                 <div className="relative group animate-in slide-in-from-top-2 duration-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Target Account</p>
                    <select 
                      required
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold appearance-none focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      value={formData.toAccountId}
                      onChange={(e) => setFormData({...formData, toAccountId: e.target.value})}
                    >
                      {state.accounts.filter(a => a.id !== formData.accountId).map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 bottom-4 text-slate-400 pointer-events-none" size={18} />
                 </div>
               )}

               {(type === TransactionType.LENT || type === TransactionType.BORROWED) && (
                 <div className="relative group animate-in slide-in-from-top-2 duration-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Associate / Person</p>
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        placeholder="Name..." 
                        className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none"
                        value={formData.person}
                        onChange={(e) => setFormData({...formData, person: e.target.value})}
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                 </div>
               )}

               {type !== TransactionType.TRANSFER && (
                 <div className="relative group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Category</p>
                    <select 
                      required
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold appearance-none focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {(CATEGORIES[type] || CATEGORIES.EXPENSE).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 bottom-4 text-slate-400 pointer-events-none" size={18} />
                 </div>
               )}

               <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Date</p>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16}/>
                    </div>
                  </div>
                  <div className="relative group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Note</p>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="..." 
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                      <FileText className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16}/>
                    </div>
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-5 rounded-[28px] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
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
