
import React from 'react';
import { 
  PieChart, 
  Target, 
  LayoutDashboard, 
  FileText
} from 'lucide-react';

export const CATEGORIES = {
  INCOME: ['Salary', 'Freelance', 'Gifts', 'Investments', 'Sales', 'Borrowed', 'Other'],
  EXPENSE: ['Food', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Subscriptions', 'Lent', 'Other'],
  TRANSFER: ['Self Transfer', 'Account Move'],
  LENT: ['Friend', 'Family', 'Business', 'Other'],
  BORROWED: ['Bank Loan', 'Friend', 'Family', 'Other']
};

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    goals: 'Goals',
    analytics: 'Analytics',
    profile: 'Profile',
    settings: 'Settings',
    userName: 'User Name',
    currency: 'Currency',
    language: 'Language',
    saveSettings: 'Save Settings',
    accounts: 'Accounts & Wallets',
    welcome: 'Welcome Back,',
    savingsGoals: 'Savings Goals',
    recentTransactions: 'Recent Transactions',
    darkTheme: 'Dark Theme'
  },
  es: {
    dashboard: 'Tablero',
    transactions: 'Transacciones',
    goals: 'Metas',
    analytics: 'Analítica',
    profile: 'Perfil',
    settings: 'Ajustes',
    userName: 'Nombre de usuario',
    currency: 'Moneda',
    language: 'Idioma',
    saveSettings: 'Guardar ajustes',
    accounts: 'Cuentas y billeteras',
    welcome: 'Bienvenido de nuevo,',
    savingsGoals: 'Metas de ahorro',
    recentTransactions: 'Transacciones recientes',
    darkTheme: 'Tema Oscuro'
  },
  fr: {
    dashboard: 'Tableau de bord',
    transactions: 'Transactions',
    goals: 'Objectifs',
    analytics: 'Analytique',
    profile: 'Profil',
    settings: 'Paramètres',
    userName: "Nom d'utilisateur",
    currency: 'Devise',
    language: 'Langue',
    saveSettings: 'Enregistrer les paramètres',
    accounts: 'Comptes et portefeuilles',
    welcome: 'Bon retour,',
    savingsGoals: "Objectifs d'épargne",
    recentTransactions: 'Transactions récentes',
    darkTheme: 'Thème Sombre'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    transactions: 'लेनदेन',
    goals: 'लक्ष्य',
    analytics: 'एनालिटिक्स',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    userName: 'उपयोगकर्ता का नाम',
    currency: 'मुद्रा',
    language: 'भाषा',
    saveSettings: 'सेटिंग्स सहेजें',
    accounts: 'खाते और वॉलेट',
    welcome: 'वापसी पर स्वागत है,',
    savingsGoals: 'बचत लक्ष्य',
    recentTransactions: 'हाल के लेनदेन',
    darkTheme: 'डार्क थीम'
  }
};

export const getNavItems = (lang: string = 'en') => [
  { id: 'dashboard', label: TRANSLATIONS[lang].dashboard, icon: <LayoutDashboard size={20} /> },
  { id: 'transactions', label: TRANSLATIONS[lang].transactions, icon: <FileText size={20} /> },
  { id: 'goals', label: TRANSLATIONS[lang].goals, icon: <Target size={20} /> },
  { id: 'analytics', label: TRANSLATIONS[lang].analytics, icon: <PieChart size={20} /> },
];

export const NAV_ITEMS = getNavItems('en'); // Fallback

export const ACCOUNT_TYPES = ['Cash', 'Bank', 'Credit Card', 'Investment'];
