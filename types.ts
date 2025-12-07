export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  BET_WIN = 'BET_WIN',
  BET_LOSS = 'BET_LOSS',
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  method?: string; // Bkash, Nagad
  number?: string; // Sender/Receiver number
  trxId?: string; // External TrxID
  status: TransactionStatus;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
  email?: string; 
  phone: string;
  password?: string; 
  referCode?: string; 
  balance: number;
  isAdmin: boolean;
  status: 'active' | 'banned';
}

export interface GameResult {
  gameId: string;
  gameType: 'HEAD_TAIL' | 'DICE' | 'WHEEL';
  username?: string; 
  betAmount: number;
  winAmount: number;
  result: string; // "Win" or "Loss"
  outcome: string; // "Head", "6", "Red"
  timestamp: number;
}

export interface AdminSettings {
  winPercentage: number; // 0-100
  minDeposit: number;
  minWithdraw: number;
  noticeText: string;
  paymentNumber: string; // The number users send money to
  enableFakeHistory: boolean; // Simulate activity
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: number;
}