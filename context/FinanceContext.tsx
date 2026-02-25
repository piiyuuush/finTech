
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { FinanceState, Account, Transaction, FinancialGoal, FinancialBudget, TransactionType, TransactionSubtype } from '../types';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

type FinanceAction =
  | { type: 'SET_USER'; payload: { uid: string; name: string; email: string } | null }
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
  | { type: 'TOGGLE_THEME' }
  | { type: 'SYNC_FROM_CLOUD'; payload: Partial<FinanceState> }
  | { type: 'LOGOUT' };

const initialState: FinanceState = {
  accounts: [],
  transactions: [],
  goals: [],
  budget: [],
  currency: '₹',
  userName: '',
  userEmail: '',
  userId: null,
  isAuthenticated: false,
  language: 'en',
  isDarkMode: false
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload 
        ? { ...state, userId: action.payload.uid, userName: action.payload.name, userEmail: action.payload.email, isAuthenticated: true }
        : { ...initialState };
    case 'SYNC_FROM_CLOUD':
      return { ...state, ...action.payload };
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
    case 'TOGGLE_THEME':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'LOGOUT':
      return initialState;
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

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ 
          type: 'SET_USER', 
          payload: { uid: user.uid, name: user.displayName || 'User', email: user.email || '' } 
        });
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync - Pull
  useEffect(() => {
    if (!state.userId) return;
    const docRef = doc(db, 'users', state.userId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        dispatch({ type: 'SYNC_FROM_CLOUD', payload: data as FinanceState });
      }
    });
    return () => unsubscribe();
  }, [state.userId]);

  // Firestore Sync - Push (Throttle locally for performance in real app)
  useEffect(() => {
    if (!state.userId) return;
    const updateCloud = async () => {
      const docRef = doc(db, 'users', state.userId!);
      // We only save functional data, not auth status or userId (they come from auth)
      const { isAuthenticated, userId, ...cloudData } = state;
      await setDoc(docRef, cloudData, { merge: true });
    };
    const timer = setTimeout(updateCloud, 2000); // Debounce sync
    return () => clearTimeout(timer);
  }, [state.accounts, state.transactions, state.goals, state.budget, state.userName, state.currency, state.language, state.isDarkMode]);

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
