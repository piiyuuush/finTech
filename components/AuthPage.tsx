
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface Props {
  onBack: () => void;
}

const AuthPage: React.FC<Props> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCred.user, { displayName: formData.name });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Visual Sidebar */}
      <div className="hidden md:flex md:w-[40%] bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
           <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl mb-12">F</div>
           <h2 className="text-4xl font-black leading-tight tracking-tight">Start your journey to <br /> financial freedom.</h2>
           <p className="mt-6 text-indigo-100 font-medium text-lg max-w-xs">Join our community for managing your wealth with FinTrack.</p>
        </div>
        <div className="relative z-10 p-8 rounded-[32px] bg-white/5 backdrop-blur-md border border-white/10">
           <p className="text-sm font-medium italic">"The smartest way to track your money. Simple, elegant, and powerful."</p>
           <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-indigo-400" />
              <p className="text-xs font-bold uppercase tracking-widest">Piyush Bhandari</p>
           </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[120px] opacity-50" />
      </div>

      {/* Auth Form Container */}
      <div className="flex-1 flex flex-col p-8 md:p-20 max-w-2xl mx-auto w-full">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors mb-16"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="space-y-2 mb-10">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-slate-400 font-medium">{isLogin ? 'Access your financial dashboard' : 'Join FinTrack and master your money'}</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <input 
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full p-5 pl-12 rounded-3xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold text-sm"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <input 
                required
                type="email"
                placeholder="hello@example.com"
                className="w-full p-5 pl-12 rounded-3xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold text-sm"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative">
              <input 
                required
                type="password"
                placeholder="••••••••"
                className="w-full p-5 pl-12 rounded-3xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold text-sm"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Login Now' : 'Sign Up'} <ChevronRight size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-slate-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:underline"
          >
            {isLogin ? 'Create Account' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
