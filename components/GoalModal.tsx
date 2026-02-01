
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FinancialGoal } from '../types';
import { X, Target, Calendar, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
  editingGoal?: FinancialGoal;
}

const GoalModal: React.FC<Props> = ({ onClose, editingGoal }) => {
  const { dispatch } = useFinance();
  const [formData, setFormData] = useState<Partial<FinancialGoal>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date().toISOString().split('T')[0],
    icon: '🎯'
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData(editingGoal);
    }
  }, [editingGoal]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) return;

    const goalPayload: FinancialGoal = { 
      id: editingGoal?.id || Math.random().toString(36).substr(2, 9), 
      name: formData.name!,
      targetAmount: formData.targetAmount!,
      currentAmount: formData.currentAmount || 0,
      deadline: formData.deadline!,
      icon: formData.icon || '🎯'
    };
    
    if (editingGoal) {
      dispatch({ type: 'UPDATE_GOAL', payload: goalPayload });
    } else {
      dispatch({ type: 'ADD_GOAL', payload: goalPayload });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSave}>
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800">{editingGoal ? 'Edit Goal' : 'New Financial Goal'}</h3>
            <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full transition-colors shadow-sm">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Goal Name</p>
                <div className="relative">
                  <input 
                    required
                    className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none" 
                    placeholder="e.g. New Laptop" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Target Amount</p>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none" 
                    placeholder="0" 
                    value={formData.targetAmount || ''} 
                    onChange={e => setFormData({...formData, targetAmount: parseFloat(e.target.value)})} 
                  />
                </div>
                <div className="relative group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Current Savings</p>
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Deadline</p>
                <div className="relative">
                  <input 
                    required
                    type="date" 
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none" 
                    value={formData.deadline} 
                    onChange={e => setFormData({...formData, deadline: e.target.value})} 
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98]"
            >
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
