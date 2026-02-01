
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
  LENT = 'LENT',
  BORROWED = 'BORROWED'
}

export enum TransactionSubtype {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING'
}

export interface Account {
  id: string;
  name: string;
  type: 'Cash' | 'Bank' | 'Credit Card' | 'Investment';
  balance: number;
  cardNumber?: string;
  color?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  toAccountId?: string; // For transfers
  person?: string;      // For lending/borrowing
  type: TransactionType;
  subtype: TransactionSubtype;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon?: string;
}

export interface FinancialBudget {
  id: string;
  category: string;
  limit: number;
  currentAmount: number;
  icon?: string;
}

export interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  goals: FinancialGoal[];
  budget: FinancialBudget[];
  userName: string;
  currency: string;
  language: 'en' | 'es' | 'fr' | 'hi';
}
