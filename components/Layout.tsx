
import React, { useState } from 'react';
import { getNavItems, TRANSLATIONS } from '../constants';
import { Plus, Settings, User } from 'lucide-react';
import TransactionModal from './TransactionModal';
import { useFinance } from '../context/FinanceContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { state } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const navItems = getNavItems(state.language);
  const t = TRANSLATIONS[state.language];

  const getHeaderTitle = () => {
    if (activeTab === 'profile') return t.profile;
    return navItems.find(i => i.id === activeTab)?.label || t.dashboard;
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen transition-colors duration-500 ${state.isDarkMode ? 'bg-[#0d0b21] bg-gradient-to-br from-[#0d0b21] to-[#161336]' : 'bg-slate-50'}`}>
      {/* Sidebar - Desktop */}
      <nav className={`hidden md:flex w-72 border-r flex-col sticky top-0 h-screen transition-all duration-500 ${state.isDarkMode ? 'bg-[#0d0b21]/80 backdrop-blur-xl border-white/5 shadow-none' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex items-center gap-3 p-8">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${state.isDarkMode ? 'bg-[#a855f7] shadow-[#a855f7]/20' : 'bg-indigo-600 shadow-indigo-100'}`}>F</div>
          <span onClick={() => setActiveTab('dashboard')} className={`text-xl font-black tracking-tight cursor-pointer transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>FinTrack</span>
        </div>
        
        <div className="flex flex-col p-6 gap-2 mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                activeTab === item.id 
                  ? `${state.isDarkMode ? 'bg-[#a855f7] text-white shadow-[#a855f7]/20' : 'bg-indigo-600 text-white shadow-indigo-100'} font-bold translate-x-1` 
                  : `${state.isDarkMode ? 'text-[#94a3b8] hover:bg-white/5 hover:text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`
              }`}
            >
              <span className={activeTab === item.id ? 'text-white' : 'text-inherit'}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 22 })}
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto p-6">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl w-full transition-all duration-200 ${
              activeTab === 'profile' 
                ? `${state.isDarkMode ? 'bg-white/5 text-[#a855f7] border border-white/10' : 'bg-indigo-50 text-indigo-600 shadow-sm'} font-bold` 
                : `${state.isDarkMode ? 'text-[#94a3b8] hover:bg-white/5 hover:text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`
            }`}
          >
            <Settings size={22} />
            <span className="text-sm tracking-wide">{t.settings}</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative">
        <header className={`h-20 border-b flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-xl transition-all duration-500 ${state.isDarkMode ? 'bg-[#0d0b21]/80 border-white/5 shadow-none' : 'bg-white/80 border-slate-50'}`}>
          <div className="flex items-center gap-4">
            <h1 className={`text-xl font-black tracking-tight transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {getHeaderTitle()}
            </h1>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`group relative flex items-center rounded-full border-2 transition-all duration-500 p-1 sm:pr-4 sm:gap-3 ${
                activeTab === 'profile' 
                  ? (state.isDarkMode ? 'border-[#a855f7] bg-[#a855f7]/10 shadow-lg shadow-[#a855f7]/5' : 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-50')
                  : (state.isDarkMode ? 'border-transparent bg-white/5 hover:bg-white/10' : 'border-transparent bg-slate-50 hover:bg-slate-100')
              }`}
            >
                <div className={`w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden shadow-sm flex items-center justify-center text-white ${state.isDarkMode ? 'bg-[#a855f7]' : 'bg-indigo-500'}`}>
                    <User size={20} />
                </div>
                <div className="hidden sm:block text-left">
                    <p className={`text-xs font-black leading-none transition-colors ${state.isDarkMode ? 'text-white' : 'text-slate-800'}`}>{state.userName.split(' ')[0]}</p>
                    <p className={`text-[10px] font-bold mt-0.5 transition-colors ${state.isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>Pro Account</p>
                </div>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className={`fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white/10 ${state.isDarkMode ? 'bg-[#a855f7] shadow-[#a855f7]/20 text-white' : 'bg-indigo-600 shadow-indigo-200 text-white'}`}
        >
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Bottom Nav - Mobile */}
        <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around items-center p-4 z-40 pb-6 rounded-t-[32px] transition-all duration-500 ${state.isDarkMode ? 'bg-[#161336]/95 backdrop-blur-xl border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]'}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                activeTab === item.id ? (state.isDarkMode ? 'text-[#a855f7] scale-110' : 'text-indigo-600 scale-110') : (state.isDarkMode ? 'text-[#94a3b8]/50' : 'text-slate-300')
              }`}
            >
              {item.icon}
              <span className={`text-[10px] font-bold ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`}>
                {item.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </nav>

        {showAddModal && <TransactionModal onClose={() => setShowAddModal(false)} />}
      </main>
    </div>
  );
};

export default Layout;
