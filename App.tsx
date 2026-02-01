
import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionManager from './components/TransactionManager';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import GoalsManager from './components/GoalsManager';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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
    <FinanceProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </FinanceProvider>
  );
};

export default App;
