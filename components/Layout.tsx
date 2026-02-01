
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
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <nav className="hidden md:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen shadow-sm transition-all">
        <div className="flex items-center gap-3 p-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">F</div>
          <span onClick={() => setActiveTab('dashboard')} className="text-xl font-black text-slate-800 tracking-tight cursor-pointer">FinTrack</span>
        </div>
        
        <div className="flex flex-col p-6 gap-2 mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <span className={activeTab === item.id ? 'text-white' : 'text-inherit'}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 22 })}
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative">
        <header className="h-20 bg-white/80 border-b border-slate-50 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {getHeaderTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`group relative flex items-center gap-3 p-1 pr-4 rounded-full border-2 transition-all ${
                activeTab === 'profile' 
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-50' 
                  : 'border-transparent bg-slate-50 hover:bg-slate-100'
              }`}
            >
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm bg-indigo-500 flex items-center justify-center text-white">
                    <User size={20} />
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-xs font-black text-slate-800 leading-none">{state.userName.split(' ')[0]}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pro Account</p>
                </div>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-indigo-600 text-white rounded-[24px] shadow-2xl shadow-indigo-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white/10"
        >
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Bottom Nav - Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center p-4 z-40 pb-6 rounded-t-[32px] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
          {navItems.concat([{id: 'profile', label: t.profile, icon: <Settings size={20} />}]).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                activeTab === item.id ? 'text-indigo-600 scale-110' : 'text-slate-300'
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
