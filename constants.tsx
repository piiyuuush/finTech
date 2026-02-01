
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

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'transactions', label: 'Transactions', icon: <FileText size={20} /> },
  { id: 'goals', label: 'Goals', icon: <Target size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <PieChart size={20} /> },
];

export const ACCOUNT_TYPES = ['Cash', 'Bank', 'Credit Card', 'Investment'];
