
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Account } from '../types';
import { TRANSLATIONS } from '../constants';
import { 
  PiggyBank, 
  CreditCard, 
  Landmark, 
  Plus, 
  Trash2, 
  Target, 
  MoreVertical, 
  Edit2, 
  Globe, 
  Coins, 
  User as UserIcon,
  ShieldCheck,
  Moon,
  Check
} from 'lucide-react';
import AccountModal from './AccountModal';

const Profile: React.FC = () => {
  const { state, dispatch } = useFinance();
  const [showAccModal, setShowAccModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  const [openAccMenuId, setOpenAccMenuId] = useState<string | null>(null);

  const t = TRANSLATIONS[state.language];

  // Functional Settings State
  const [tempUserName, setTempUserName] = useState(state.userName);
  const [tempCurrency, setTempCurrency] = useState(state.currency);
  const [tempLanguage, setTempLanguage] = useState(state.language);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleEditAcc = (acc: Account) => {
    setEditingAccount(acc);
    setShowAccModal(true);
    setOpenAccMenuId(null);
  };

  const handleDeleteAcc = (id: string) => {
    if (confirm('Delete this account and all its transactions?')) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    }
    setOpenAccMenuId(null);
  };

  const handleSaveSettings = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        userName: tempUserName,
        currency: tempCurrency,
        language: tempLanguage as any
      }
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'Bank': return <Landmark size={20} />;
          case 'Credit Card': return <CreditCard size={20} />;
          case 'Investment': return <Target size={20} />;
          default: return <PiggyBank size={20} />;
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* User Header */}
      <div className={`flex flex-col sm:flex-row items-center gap-6 p-8 rounded-[40px] border relative overflow-hidden group transition-all duration-500 ${state.isDarkMode ? 'bg-[#1e1b39]/60 backdrop-blur-md border-white/5 shadow-none' : 'bg-white shadow-sm border-slate-100'}`}>
          <div className={`w-24 h-24 rounded-full border-4 overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-500 relative z-10 flex items-center justify-center text-white ${state.isDarkMode ? 'border-white/5 bg-[#a855f7]' : 'border-slate-50 bg-indigo-500'}`}>
              <UserIcon size={40} />
          </div>
          <div className="text-center sm:text-left relative z-10">
              <h2 className={`text-3xl font-black tracking-tight transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{state.userName}</h2>
              <p className={`font-bold text-xs uppercase tracking-[0.2em] mt-1 flex items-center justify-center sm:justify-start gap-2 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                 <ShieldCheck size={14} className={state.isDarkMode ? 'text-[#10b981]' : 'text-emerald-500'} /> Premium Member • Joined Jan 2024
              </p>
          </div>
          <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none transition-colors ${state.isDarkMode ? 'bg-[#a855f7]/10' : 'bg-indigo-50/50'}`}></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Accounts & Wallets */}
          <section className="space-y-6">
              <div className="flex justify-between items-center px-2">
                  <h3 className={`text-xl font-black tracking-tight transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.accounts}</h3>
                  <button 
                    onClick={() => { setEditingAccount(undefined); setShowAccModal(true); }} 
                    className={`p-3 rounded-2xl transition-all active:scale-95 ${state.isDarkMode ? 'bg-white/5 text-[#a855f7] hover:bg-white/10' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                  >
                    <Plus size={20} />
                  </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                  {state.accounts.map(acc => (
                      <div key={acc.id} className={`backdrop-blur-sm p-6 rounded-[32px] border flex items-center justify-between transition-all group relative ${state.isDarkMode ? 'bg-[#1e1b39]/40 border-white/5 shadow-none hover:border-white/20' : 'bg-white/80 border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1'} ${openAccMenuId === acc.id ? 'z-50' : 'z-0'}`}>
                          <div className="flex items-center gap-4">
                              <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-lg ${state.isDarkMode ? (acc.color === 'bg-indigo-600' ? 'bg-[#a855f7]' : acc.color || 'bg-[#a855f7]') : acc.color || 'bg-slate-50'} text-white shadow-slate-100`}>{getIcon(acc.type)}</div>
                              <div>
                                  <p className={`font-black text-sm transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{acc.name}</p>
                                  <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mt-1 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>{acc.type} • {acc.cardNumber?.slice(-4)}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-4">
                              <span className={`text-xl font-black transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-900'}`}>{state.currency}{acc.balance.toLocaleString()}</span>
                              <div className="relative">
                                  <button onClick={() => setOpenAccMenuId(openAccMenuId === acc.id ? null : acc.id)} className={`p-2 transition-colors ${state.isDarkMode ? 'text-[#94a3b8] hover:text-[#a855f7]' : 'text-slate-300 hover:text-indigo-600'}`}>
                                      <MoreVertical size={20} />
                                  </button>
                                  {openAccMenuId === acc.id && (
                                      <div className={`absolute right-0 top-full mt-2 w-32 shadow-2xl rounded-[20px] py-2 z-[60] border animate-in fade-in zoom-in duration-200 ${state.isDarkMode ? 'bg-[#1e1b39] border-white/10 text-white' : 'bg-white border-slate-50 shadow-slate-100 text-slate-800'}`}>
                                          <button onClick={() => handleEditAcc(acc)} className={`w-full px-5 py-3 text-left text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-colors ${state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                              <Edit2 size={14} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-indigo-600'} /> Edit
                                          </button>
                                          <button onClick={() => handleDeleteAcc(acc.id)} className={`w-full px-5 py-3 text-left text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-colors text-rose-500 ${state.isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                              <Trash2 size={14} /> Delete
                                          </button>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </section>

          {/* Settings Section */}
          <section className="space-y-6">
              <div className="flex justify-between items-center px-2">
                  <h3 className={`text-xl font-black tracking-tight transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.settings}</h3>
              </div>
              <div className={`p-8 rounded-[40px] border shadow-sm space-y-8 relative overflow-hidden transition-all duration-500 ${state.isDarkMode ? 'bg-[#1e1b39]/60 backdrop-blur-sm border-white/5 shadow-none' : 'bg-white border-slate-100'}`}>
                  
                  {/* Save Status Toast */}
                  <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-[#10b981] text-white text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-lg transition-all duration-500 ${showSavedToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <span className="flex items-center gap-2"><Check size={12}/> Settings Applied</span>
                  </div>

                  {/* General settings group */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                          <UserIcon size={12} /> {t.userName}
                       </label>
                       <input 
                         type="text"
                         className={`w-full border p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border-white/5 text-white focus:ring-[#a855f7]/20' : 'bg-slate-50 border-slate-100 text-slate-800 focus:ring-indigo-100'}`}
                         value={tempUserName}
                         onChange={(e) => setTempUserName(e.target.value)}
                         placeholder="Enter your name"
                       />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                              <Coins size={12} /> {t.currency}
                           </label>
                           <select 
                             className={`w-full border p-4 rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border-white/5 text-white focus:ring-[#a855f7]/20' : 'bg-slate-50 border-slate-100 text-slate-800 focus:ring-indigo-100'}`}
                             value={tempCurrency}
                             onChange={(e) => setTempCurrency(e.target.value)}
                           >
                              <option value="₹">Rupee (₹)</option>
                              <option value="$">Dollar ($)</option>
                              <option value="€">Euro (€)</option>
                              <option value="£">Pound (£)</option>
                              <option value="¥">Yen (¥)</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                              <Globe size={12} /> {t.language}
                           </label>
                           <select 
                             className={`w-full border p-4 rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:outline-none transition-all ${state.isDarkMode ? 'bg-white/5 border-white/5 text-white focus:ring-[#a855f7]/20' : 'bg-slate-50 border-slate-100 text-slate-800 focus:ring-indigo-100'}`}
                             value={tempLanguage}
                             onChange={(e) => setTempLanguage(e.target.value as any)}
                           >
                              <option value="en">English</option>
                              <option value="es">Español</option>
                              <option value="fr">Français</option>
                              <option value="hi">हिन्दी</option>
                           </select>
                        </div>
                    </div>
                  </div>

                  <hr className={state.isDarkMode ? 'border-white/5' : 'border-slate-50'} />

                  {/* UI Settings group */}
                  <div className="space-y-4">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]/50' : 'text-slate-300'}`}>Preferences</p>
                    <div className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${state.isDarkMode ? 'bg-white/5' : 'bg-slate-50/50'}`}>
                      <div className="flex items-center gap-3">
                        <Moon size={18} className={state.isDarkMode ? 'text-[#a855f7]' : 'text-slate-400'} />
                        <span className={`text-sm font-bold transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-700'}`}>{t.darkTheme}</span>
                      </div>
                      <div 
                        onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                        className={`w-10 h-6 rounded-full flex items-center px-1 shadow-inner cursor-pointer transition-colors ${state.isDarkMode ? 'bg-[#a855f7] justify-end' : 'bg-slate-200 justify-start'}`}
                      >
                         <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveSettings}
                    className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group ${state.isDarkMode ? 'bg-[#a855f7] text-white shadow-[#a855f7]/10 hover:bg-[#a855f7]/90' : 'bg-slate-900 text-white shadow-slate-100 hover:bg-indigo-600'}`}
                  >
                    {t.saveSettings}
                    <Check size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>
          </section>
      </div>
      {showAccModal && <AccountModal editingAccount={editingAccount} onClose={() => { setShowAccModal(false); setEditingAccount(undefined); }} />}
    </div>
  );
};

export default Profile;
