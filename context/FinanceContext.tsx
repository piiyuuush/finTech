
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { FinanceState, Account, Transaction, FinancialGoal, FinancialBudget, TransactionType, TransactionSubtype } from '../types';

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
  | { type: 'ADD_BUDGET'; payload: FinancialBudget }
  | { type: 'UPDATE_BUDGET'; payload: FinancialBudget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Pick<FinanceState, 'userName' | 'currency' | 'language'>> }
  | { type: 'LOAD_DATA'; payload: FinanceState };

const initialState: FinanceState = {
  accounts: [
    { id: '1', name: 'Personal Account', type: 'Bank', balance: 145200, cardNumber: '**** **** **** 9010', color: 'bg-indigo-600' },
    { id: '2', name: 'Business Card', type: 'Credit Card', balance: 8400, cardNumber: '**** **** **** 1288', color: 'bg-slate-800' }
  ],
  transactions: [
  {
    id: 'txn-001',
    accountId: '1',
    type: TransactionType.INCOME,
    subtype: TransactionSubtype.RECURRING,
    category: 'Salary',
    amount: 65000,
    date: '2026-01-01',
    description: 'Monthly salary credit'
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
  userName: 'Piyush Bhandari',
  language: 'en'
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
    case 'ADD_BUDGET':
      return { ...state, budget: [...state.budget, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budget: state.budget.map(b => b.id === action.payload.id ? action.payload : b)
      };
    case 'DELETE_BUDGET':
      return { ...state, budget: state.budget.filter(b => b.id !== action.payload) };
    case 'UPDATE_SETTINGS':
      return { ...state, ...action.payload };
    case 'LOAD_DATA':
      return { ...action.payload };
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
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_DATA', payload: parsed });
      } catch(e) {
        console.error("Failed to parse data", e);
      }
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
