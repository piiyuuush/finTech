
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
  const { dispatch } = useFinance();
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
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSave}>
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800">{editingBudget ? 'Edit Budget' : 'New Monthly Budget'}</h3>
            <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full transition-colors shadow-sm">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Category</p>
                <div className="relative">
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none appearance-none"
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.EXPENSE.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <PieChart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Monthly Limit</p>
                  <div className="relative">
                    <input 
                      required
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none" 
                      placeholder="0" 
                      value={formData.limit || ''} 
                      onChange={e => setFormData({...formData, limit: parseFloat(e.target.value)})} 
                    />
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                </div>
                <div className="relative group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Spent So Far</p>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none" 
                    placeholder="0" 
                    value={formData.currentAmount || ''} 
                    onChange={e => setFormData({...formData, currentAmount: parseFloat(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="relative group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Emoji Icon</p>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none" 
                  placeholder="e.g. 🍔" 
                  value={formData.icon} 
                  onChange={e => setFormData({...formData, icon: e.target.value})} 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-slate-100 hover:bg-slate-800 transition-all active:scale-[0.98]"
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
