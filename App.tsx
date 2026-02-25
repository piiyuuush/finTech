
import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionManager from './components/TransactionManager';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import GoalsManager from './components/GoalsManager';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';

const AppContent: React.FC = () => {
  const { state } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authView, setAuthView] = useState<'landing' | 'auth'>('landing');

  // If not authenticated, show landing or auth pages
  if (!state.isAuthenticated) {
    if (authView === 'landing') {
      return <LandingPage onJoin={() => setAuthView('auth')} />;
    }
    return <AuthPage onBack={() => setAuthView('landing')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'transactions': return <TransactionManager />;
      case 'goals': return <GoalsManager />;
      case 'analytics': return <Analytics />;
      case 'profile': return <Profile />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className={state.isDarkMode ? 'dark' : ''}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
};

export default App;
