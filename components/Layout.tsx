
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { Plus } from 'lucide-react';
import TransactionModal from './TransactionModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Determine the header title based on active tab
  const getHeaderTitle = () => {
    if (activeTab === 'profile') return 'Profile & Wallets';
    return NAV_ITEMS.find(i => i.id === activeTab)?.label || 'Dashboard';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <nav className="hidden md:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen shadow-sm">
        <div className="flex items-center gap-3 p-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100">F</div>
          <span onClick={() => setActiveTab('dashboard')}className="text-xl font-black text-slate-800 tracking-tight cursor-pointer">FinTrack</span>
        </div>
        
        <div className="flex flex-col p-6 gap-2 mt-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white font-bold shadow-xl shadow-blue-100 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <span className={activeTab === item.id ? 'text-white' : 'text-inherit'}>
                {/* Fix: Added explicit generic <any> to ReactElement cast to allow cloning with new 'size' prop */}
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
                  ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-50' 
                  : 'border-transparent bg-slate-50 hover:bg-slate-100'
              }`}
            >
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Piyush" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-xs font-black text-slate-800 leading-none">Piyush B.</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pro Account</p>
                </div>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>

        {/* Floating Action Button - Positioned at bottom right, above mobile navbar */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-blue-600 text-white rounded-[24px] shadow-2xl shadow-blue-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white/10"
        >
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Bottom Nav - Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center p-4 z-40 pb-6 rounded-t-[32px] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                activeTab === item.id ? 'text-blue-600 scale-110' : 'text-slate-300'
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
