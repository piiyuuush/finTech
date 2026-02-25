
import React from 'react';
import { ArrowRight, BarChart3, ShieldCheck, Zap, TrendingUp, Globe, MessageSquareText } from 'lucide-react';

interface Props {
  onJoin: () => void;
}

const LandingPage: React.FC<Props> = ({ onJoin }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">F</div>
          <span className="text-xl font-black tracking-tight text-slate-800">FinTrack</span>
        </div>
        <button 
          onClick={onJoin}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <header className="px-8 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-widest animate-pulse">
            <Zap size={14} /> The Next Generation of Finance
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1] text-slate-900">
            Master your <br /> <span className="text-indigo-600">financial destiny.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            Take full control of your wealth with our world-class tracker. Set goals, analyze spending, and grow your future with visual analytical insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={onJoin}
              className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Start for Free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute -inset-4 bg-indigo-500/10 blur-[100px] rounded-full" />
          <div className="relative bg-white p-8 rounded-[48px] shadow-2xl border border-slate-100 transform rotate-3 hover:rotate-0 transition-transform duration-700">
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">₹</div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Balance</p>
                      <p className="text-2xl font-black">₹1,45,200</p>
                   </div>
                </div>
                <div className="h-40 bg-slate-50 rounded-3xl flex items-end p-4 gap-2">
                   {[40, 70, 45, 90, 65, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-500 rounded-t-lg" style={{ height: `${h}%` }} />
                   ))}
                </div>
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl">
                   <TrendingUp className="text-emerald-600" size={20} />
                   <p className="text-xs font-bold text-emerald-800">Your savings grew 12% this month!</p>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white py-24 px-8 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-black tracking-tight mb-4">Why choose FinTrack?</h2>
             <p className="text-slate-400 font-medium">Everything you need to manage money like a pro.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <BarChart3 size={32} className="text-indigo-600" />, title: 'Smart Analytics', desc: 'Visualize your spending habits with deep-dive category breakdowns.' },
              { icon: <ShieldCheck size={32} className="text-emerald-600" />, title: 'Authentication Security', desc: 'Your data is encrypted and synced securely with Firebase cloud.' },
              { icon: <Globe size={32} className="text-amber-600" />, title: 'Global Access', desc: 'Track in multiple currencies and languages across all your devices.' },
              { icon: <MessageSquareText size={32} className="text-blue-600" />,title: 'Automated Bank SMS Sync',desc: 'Securely capture bank SMS alerts in real-time into categorized transactions.'}
            ].map((feature, i) => (
              <div key={i} className="space-y-4 p-8 rounded-[40px] hover:bg-slate-50 transition-colors">
                <div className="w-16 h-16 rounded-[24px] bg-white shadow-xl flex items-center justify-center">{feature.icon}</div>
                <h3 className="text-xl font-black">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 max-w-7xl mx-auto flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">F</div>
          <span className="text-lg font-black tracking-tight">FinTrack</span>
        </div>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Master Your Future • Built for Everyone</p>
      </footer>
    </div>
  );
};

export default LandingPage;
