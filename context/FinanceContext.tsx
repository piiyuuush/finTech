import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { FinanceState, Account, Transaction, FinancialGoal, TransactionType, TransactionSubtype } from '../types';

type FinanceAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'UPDATE_ACCOUNT_BALANCE'; payload: { id: string; amount: number } }
  | { type: 'ADD_GOAL'; payload: FinancialGoal }
  | { type: 'UPDATE_GOAL'; payload: FinancialGoal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'LOAD_DATA'; payload: FinanceState };

const initialState: FinanceState = {
  accounts: [
    { id: '1', name: 'Personal Account', type: 'Bank', balance: 145200, cardNumber: '**** **** **** 9010', color: 'bg-indigo-600' },
    { id: '2', name: 'Business Card', type: 'Credit Card', balance: 8400, cardNumber: '**** **** **** 1288', color: 'bg-slate-800' }
  ],
  transactions: [
  // ===== INCOME =====
  {
    id: 'txn-001',
    accountId: 'acc-bank-001',
    type: TransactionType.INCOME,
    subtype: TransactionSubtype.RECURRING,
    category: 'Salary',
    amount: 65000,
    date: '2026-01-01',
    description: 'Monthly salary credit'
  },
  {
    id: 'txn-002',
    accountId: 'acc-bank-001',
    type: TransactionType.INCOME,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Freelance',
    amount: 12000,
    date: '2026-01-10',
    description: 'Website development project'
  },
  {
    id: 'txn-003',
    accountId: 'acc-wallet-001',
    type: TransactionType.INCOME,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Cashback',
    amount: 450,
    date: '2026-01-15',
    description: 'Credit card cashback'
  },

  // ===== EXPENSE =====
  {
    id: 'txn-004',
    accountId: 'acc-bank-001',
    type: TransactionType.EXPENSE,
    subtype: TransactionSubtype.RECURRING,
    category: 'Rent',
    amount: 18000,
    date: '2026-01-05',
    description: 'House rent'
  },
  {
    id: 'txn-005',
    accountId: 'acc-wallet-001',
    type: TransactionType.EXPENSE,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Food',
    amount: 850,
    date: '2026-01-12',
    description: 'Dinner at restaurant'
  },
  {
    id: 'txn-006',
    accountId: 'acc-bank-001',
    type: TransactionType.EXPENSE,
    subtype: TransactionSubtype.RECURRING,
    category: 'Internet',
    amount: 999,
    date: '2026-01-20',
    description: 'Monthly broadband bill'
  },
  {
    id: 'txn-007',
    accountId: 'acc-wallet-001',
    type: TransactionType.EXPENSE,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Shopping',
    amount: 3200,
    date: '2026-01-22',
    description: 'Clothing purchase'
  },

  // ===== TRANSFER =====
  {
    id: 'txn-008',
    accountId: 'acc-bank-001',
    toAccountId: 'acc-wallet-001',
    type: TransactionType.TRANSFER,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Self Transfer',
    amount: 5000,
    date: '2026-01-08',
    description: 'Bank to wallet transfer'
  },
  {
    id: 'txn-009',
    accountId: 'acc-wallet-001',
    toAccountId: 'acc-bank-001',
    type: TransactionType.TRANSFER,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Self Transfer',
    amount: 2000,
    date: '2026-01-18',
    description: 'Wallet to bank transfer'
  },
  {
    id: 'txn-010',
    accountId: 'acc-bank-001',
    toAccountId: 'acc-invest-001',
    type: TransactionType.TRANSFER,
    subtype: TransactionSubtype.RECURRING,
    category: 'Investment',
    amount: 3000,
    date: '2026-01-25',
    description: 'Monthly SIP transfer'
  },

  // ===== LENT =====
  {
    id: 'txn-011',
    accountId: 'acc-bank-001',
    person: 'Rahul',
    type: TransactionType.LENT,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Personal Loan',
    amount: 5000,
    date: '2026-01-14',
    description: 'Lent money to friend'
  },
  {
    id: 'txn-012',
    accountId: 'acc-wallet-001',
    person: 'Sister',
    type: TransactionType.LENT,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Family',
    amount: 2000,
    date: '2026-01-21',
    description: 'Emergency support'
  },
  {
    id: 'txn-013',
    accountId: 'acc-bank-001',
    person: 'Office Colleague',
    type: TransactionType.LENT,
    subtype: TransactionSubtype.RECURRING,
    category: 'Shared Expenses',
    amount: 1500,
    date: '2026-01-28',
    description: 'Monthly shared cab expense'
  },

  // ===== BORROWED =====
  {
    id: 'txn-014',
    accountId: 'acc-bank-001',
    person: 'Father',
    type: TransactionType.BORROWED,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Family',
    amount: 10000,
    date: '2026-01-03',
    description: 'Borrowed for laptop purchase'
  },
  {
    id: 'txn-015',
    accountId: 'acc-wallet-001',
    person: 'Friend',
    type: TransactionType.BORROWED,
    subtype: TransactionSubtype.ONE_TIME,
    category: 'Personal',
    amount: 1500,
    date: '2026-01-16',
    description: 'Short-term borrow'
  },
  {
    id: 'txn-016',
    accountId: 'acc-bank-001',
    person: 'Roommate',
    type: TransactionType.BORROWED,
    subtype: TransactionSubtype.RECURRING,
    category: 'Utilities',
    amount: 1200,
    date: '2026-01-30',
    description: 'Electricity bill split'
  }
],
  goals: [
    { id: 'g1', name: 'New Tesla', targetAmount: 180000, currentAmount: 45000, deadline: '2025-12-01', icon: '🚗' },
    { id: 'g2', name: 'Home Downpay', targetAmount: 500000, currentAmount: 120000, deadline: '2026-06-01', icon: '🏠' }
  ],
  budget: [
    { id: 'b1', category: 'Grocery', limit: 12000, currentAmount: 5000, icon: '🛒' },
    { id: 'b2', category: 'Entertainment', limit: 5000, currentAmount: 2500, icon: '🎬' }
  ],

  currency: '₹',
  userName: 'Piyush Bhandari'
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return { 
        ...state, 
        transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) 
      };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(acc => acc.id === action.payload.id ? action.payload : acc)
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(acc => acc.id !== action.payload),
        transactions: state.transactions.filter(t => t.accountId !== action.payload && t.toAccountId !== action.payload)
      };
    case 'UPDATE_ACCOUNT_BALANCE':
      return {
        ...state,
        accounts: state.accounts.map(acc => 
          acc.id === action.payload.id ? { ...acc, balance: acc.balance + action.payload.amount } : acc
        )
      };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g)
      };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
};

const FinanceContext = createContext<{
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
} | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('finpulse_data_v2');
    if (saved) {
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(saved) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('finpulse_data_v2', JSON.stringify(state));
  }, [state]);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
