
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Account } from '../types';
import { ACCOUNT_TYPES } from '../constants';
import { X, Landmark, CreditCard, Target, PiggyBank, Palette, Hash } from 'lucide-react';

interface Props {
  onClose: () => void;
  editingAccount?: Account;
}

const CARD_COLORS = [
  { name: 'Indigo', class: 'bg-indigo-600' },
  { name: 'Slate', class: 'bg-slate-800' },
  { name: 'Emerald', class: 'bg-emerald-600' },
  { name: 'Rose', class: 'bg-rose-600' },
  { name: 'Amber', class: 'bg-amber-600' },
  { name: 'Violet', class: 'bg-violet-600' },
];

const AccountModal: React.FC<Props> = ({ onClose, editingAccount }) => {
  const { state, dispatch } = useFinance();
  const [formData, setFormData] = useState<Partial<Account>>({
    name: '',
    type: 'Bank',
    balance: 0,
    cardNumber: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
    color: 'bg-indigo-600'
  });

  useEffect(() => {
    if (editingAccount) {
      setFormData(editingAccount);
    }
  }, [editingAccount]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const accountData: Account = {
      id: editingAccount?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      type: formData.type as any,
      balance: formData.balance || 0,
      cardNumber: formData.cardNumber,
      color: formData.color
    };

    if (editingAccount) {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: accountData });
    } else {
      dispatch({ type: 'ADD_ACCOUNT', payload: accountData });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSave}>
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
             <h3 className="text-xl font-black text-slate-800">{editingAccount ? 'Edit Account' : 'Add New Account'}</h3>
             <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full transition-colors shadow-sm">
                <X size={20} />
             </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
               {/* Account Name */}
               <div className="relative group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Account Name</p>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Savings Account"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {/* Account Type */}
                  <div className="relative group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Type</p>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none appearance-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    >
                      {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {/* Initial Balance */}
                  <div className="relative group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Balance</p>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none"
                      value={formData.balance || ''}
                      onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value)})}
                    />
                  </div>
               </div>

               {/* Card Number Simulation */}
               <div className="relative group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 flex items-center gap-1">
                    <Hash size={10} /> Card Number Display
                  </p>
                  <input 
                    type="text"
                    placeholder="**** **** **** 1234"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                  />
               </div>

               {/* Color Picker */}
               <div className="relative group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 flex items-center gap-1">
                    <Palette size={10} /> Card Theme
                  </p>
                  <div className="flex gap-2 flex-wrap p-2 bg-slate-50 rounded-2xl border border-slate-100">
                    {CARD_COLORS.map((c) => (
                      <button
                        key={c.class}
                        type="button"
                        onClick={() => setFormData({...formData, color: c.class})}
                        className={`${c.class} w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === c.class ? 'border-white shadow-md ring-2 ring-blue-500' : 'border-transparent'}`}
                        title={c.name}
                      />
                    ))}
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-slate-100 hover:bg-slate-800 transition-all active:scale-[0.98]"
            >
              {editingAccount ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;
