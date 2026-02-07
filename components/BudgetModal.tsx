
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FinancialBudget } from '../types';
import { CATEGORIES } from '../constants';
import { X, PieChart, Wallet } from 'lucide-react';

interface Props {
  onClose: () => void;
  editingBudget?: FinancialBudget;
}

const BudgetModal: React.FC<Props> = ({ onClose, editingBudget }) => {
  const { state, dispatch } = useFinance();
  const [formData, setFormData] = useState<Partial<FinancialBudget>>({
    category: CATEGORIES.EXPENSE[0],
    limit: 0,
    currentAmount: 0,
    icon: '💰'
  });

  useEffect(() => {
    if (editingBudget) {
      setFormData(editingBudget);
    }
  }, [editingBudget]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.limit) return;

    const budgetPayload: FinancialBudget = { 
      id: editingBudget?.id || Math.random().toString(36).substr(2, 9), 
      category: formData.category!,
      limit: formData.limit!,
      currentAmount: formData.currentAmount || 0,
      icon: formData.icon || '💰'
    };
    
    if (editingBudget) {
      dispatch({ type: 'UPDATE_BUDGET', payload: budgetPayload });
    } else {
      dispatch({ type: 'ADD_BUDGET', payload: budgetPayload });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-in fade-in duration-200">
      <div className={`rounded-[32px] w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300 transition-all ${state.isDarkMode ? 'bg-[#1e1b39] border border-white/10 shadow-2xl' : 'bg-white shadow-2xl'}`}>
        <form onSubmit={handleSave}>
          <div className={`p-6 flex justify-between items-center transition-colors ${state.isDarkMode ? 'bg-white/5 border-b border-white/5' : 'border-b border-slate-50 bg-slate-50/50'}`}>
            <h3 className={`text-xl font-black transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{editingBudget ? 'Edit Budget' : 'New Monthly Budget'}</h3>
            <button type="button" onClick={onClose} className={`p-2 rounded-full transition-colors shadow-sm ${state.isDarkMode ? 'bg-white/5 text-[#94a3b8] hover:text-white' : 'bg-white text-slate-400 hover:text-slate-600'}`}>
              <X size={20} />
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Category</p>
                <div className="relative">
                  <select 
                    required
                    className={`w-full p-4 pl-12 rounded-2xl text-sm font-semibold appearance-none focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-100 text-slate-800'}`}
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.EXPENSE.map(cat => (
                      <option key={cat} value={cat} className={state.isDarkMode ? 'bg-[#1e1b39] text-white' : ''}>{cat}</option>
                    ))}
                  </select>
                  <PieChart className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${state.isDarkMode ? 'text-white/20' : 'text-slate-400'}`} size={18} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Monthly Limit</p>
                  <div className="relative">
                    <input 
                      required
                      type="number" 
                      className={`w-full p-4 pl-12 rounded-2xl text-sm font-semibold focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20' : 'bg-slate-50 border border-slate-100 text-slate-800'}`} 
                      placeholder="0" 
                      value={formData.limit || ''} 
                      onChange={e => setFormData({...formData, limit: parseFloat(e.target.value)})} 
                    />
                    <Wallet className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${state.isDarkMode ? 'text-white/20' : 'text-slate-400'}`} size={16} />
                  </div>
                </div>
                <div className="relative group">
                  <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Spent So Far</p>
                  <input 
                    type="number" 
                    className={`w-full p-4 rounded-2xl text-sm font-semibold focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20' : 'bg-slate-50 border border-slate-100 text-slate-800'}`} 
                    placeholder="0" 
                    value={formData.currentAmount || ''} 
                    onChange={e => setFormData({...formData, currentAmount: parseFloat(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="relative group">
                <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Emoji Icon</p>
                <input 
                  type="text" 
                  className={`w-full p-4 rounded-2xl text-sm font-semibold focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20' : 'bg-slate-50 border border-slate-100 text-slate-800'}`} 
                  placeholder="e.g. 🍔" 
                  value={formData.icon} 
                  onChange={e => setFormData({...formData, icon: e.target.value})} 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className={`w-full py-5 rounded-[24px] font-bold text-lg transition-all active:scale-[0.98] ${state.isDarkMode ? 'bg-white text-[#1e1b39] shadow-xl hover:bg-slate-100' : 'bg-slate-900 text-white shadow-xl shadow-slate-100 hover:bg-slate-800'}`}
            >
              {editingBudget ? 'Update Budget' : 'Set Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
