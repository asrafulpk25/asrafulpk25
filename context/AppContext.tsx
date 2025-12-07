import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, TransactionType, TransactionStatus, AdminSettings, GameResult, Task } from '../types';

interface AppContextType {
  user: User | null;
  allUsers: User[];
  login: (phone: string, password: string) => Promise<boolean>;
  register: (phone: string, username: string, email: string, password: string, referCode: string) => Promise<boolean>;
  logout: () => void;
  balance: number;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => void;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
  gameHistory: GameResult[];
  addGameResult: (result: GameResult) => void;
  adminSettings: AdminSettings;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  toggleUserStatus: (userId: string) => void;
  adminUpdateBalance: (userId: string, newBalance: number) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SETTINGS: AdminSettings = {
  winPercentage: 45, // House edge
  minDeposit: 500,
  minWithdraw: 1000,
  noticeText: "Welcome to BetPro! 50% Bonus on 1st Deposit via Bkash/Nagad.",
  paymentNumber: "01700000000",
  enableFakeHistory: true,
};

const INITIAL_ADMIN: User = { 
  id: 'admin_001', 
  username: 'SuperAdmin', 
  email: 'admin@betpro.com',
  phone: '581993', 
  password: 'Dxadmin', 
  balance: 0, 
  isAdmin: true, 
  status: 'active',
  referCode: 'ADMIN'
};

// Helper to load from storage safely
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state with smart merging for settings and users
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const loaded = loadFromStorage('betpro_settings', INITIAL_SETTINGS);
    // Merge loaded settings with INITIAL to ensure new fields (like paymentNumber) exist
    return { ...INITIAL_SETTINGS, ...loaded };
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
      const loaded = loadFromStorage<User[]>('betpro_users', []);
      const adminIndex = loaded.findIndex(u => u.id === INITIAL_ADMIN.id);
      
      // Ensure admin exists and has correct critical flags
      if (adminIndex === -1) {
          return [INITIAL_ADMIN, ...loaded];
      } else {
          // Update existing admin to ensure they have latest schema properties
          const updatedUsers = [...loaded];
          updatedUsers[adminIndex] = { ...updatedUsers[adminIndex], ...INITIAL_ADMIN, password: INITIAL_ADMIN.password, phone: INITIAL_ADMIN.phone }; 
          return updatedUsers;
      }
  });

  const [user, setUser] = useState<User | null>(() => {
     const savedUser = loadFromStorage<User | null>('betpro_current_user', null);
     // Re-validate against allUsers to ensure up-to-date balance/status
     if (savedUser) {
        // We need to look up in the computed allUsers list, but we can't access state variable here.
        // We'll re-sync in useEffect.
        return savedUser;
     }
     return null;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage('betpro_transactions', []));
  const [gameHistory, setGameHistory] = useState<GameResult[]>(() => loadFromStorage('betpro_games', []));
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage('betpro_tasks', []));

  // Persistence Effects
  useEffect(() => { localStorage.setItem('betpro_users', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('betpro_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('betpro_games', JSON.stringify(gameHistory)); }, [gameHistory]);
  useEffect(() => { localStorage.setItem('betpro_settings', JSON.stringify(adminSettings)); }, [adminSettings]);
  useEffect(() => { localStorage.setItem('betpro_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { 
      if (user) {
          localStorage.setItem('betpro_current_user', JSON.stringify(user)); 
      } else {
          localStorage.removeItem('betpro_current_user');
      }
  }, [user]);

  // Sync current user balance/status if modified externally (by admin or gameplay)
  useEffect(() => {
    if (user) {
      const dbUser = allUsers.find(u => u.id === user.id);
      if (dbUser) {
        // Only update if something changed to avoid infinite loops
        if (dbUser.balance !== user.balance || dbUser.status !== user.status || dbUser.isAdmin !== user.isAdmin) {
             setUser(dbUser);
        }
      }
    }
  }, [allUsers]); 

  // Fake History Generator
  useEffect(() => {
    if (!adminSettings.enableFakeHistory) return;

    const interval = setInterval(() => {
      const fakeNames = ['King_01', 'LuckyBoy', 'Dhaka_Don', 'WinMaster', 'BetLover', 'Rony_XXX', 'Tania_Q', 'Boss_BD'];
      const games: ('HEAD_TAIL' | 'DICE' | 'WHEEL')[] = ['HEAD_TAIL', 'DICE', 'WHEEL'];
      const amounts = [100, 200, 500, 1000, 50, 2000];

      const randomGame = games[Math.floor(Math.random() * games.length)];
      const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      
      let winAmount = 0;
      let outcome = '';

      if (randomGame === 'HEAD_TAIL') {
        winAmount = randomAmount * 1.9;
        outcome = Math.random() > 0.5 ? 'HEAD' : 'TAIL';
      } else if (randomGame === 'DICE') {
        winAmount = randomAmount * 5;
        outcome = (Math.floor(Math.random() * 6) + 1).toString();
      } else {
        winAmount = randomAmount * 2;
        outcome = '2x';
      }

      const fakeResult: GameResult = {
        gameId: `fake_${Date.now()}`,
        gameType: randomGame,
        username: randomName,
        betAmount: randomAmount,
        winAmount: winAmount,
        result: 'Win',
        outcome: outcome,
        timestamp: Date.now()
      };

      setGameHistory(prev => [fakeResult, ...prev].slice(0, 50)); // Keep last 50
    }, 4000); 

    return () => clearInterval(interval);
  }, [adminSettings.enableFakeHistory]);

  const login = async (phone: string, password: string): Promise<boolean> => {
    const existingUser = allUsers.find(u => u.phone === phone);
    
    if (existingUser) {
      if (existingUser.password !== password) {
          alert("Incorrect Password");
          return false;
      }
      if (existingUser.status === 'banned') {
        alert("Your account has been BANNED. Contact Admin.");
        return false;
      }
      setUser(existingUser);
      return true;
    } 
    alert("User not found. Please Sign Up.");
    return false;
  };

  const register = async (phone: string, username: string, email: string, password: string, referCode: string): Promise<boolean> => {
      if (allUsers.find(u => u.phone === phone)) {
          alert("Phone number already registered!");
          return false;
      }
      if (allUsers.find(u => u.username === username)) {
          alert("Username taken!");
          return false;
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        email,
        phone,
        password,
        referCode,
        balance: 0,
        isAdmin: false,
        status: 'active'
      };
      
      setAllUsers(prev => [...prev, newUser]);
      setUser(newUser);
      return true;
  }

  const logout = () => {
    setUser(null);
  };

  const updateBalance = (userId: string, delta: number) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, balance: Math.max(0, u.balance + delta) };
      }
      return u;
    }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: TransactionStatus.PENDING,
    };
    
    // Immediate balance deduction for Withdrawal requests
    if (tx.type === TransactionType.WITHDRAW) {
        updateBalance(tx.userId, -tx.amount);
    }

    // Auto-process bets
    if (tx.type === TransactionType.BET_WIN || tx.type === TransactionType.BET_LOSS) {
      newTx.status = TransactionStatus.COMPLETED;
      if (tx.type === TransactionType.BET_WIN) {
        updateBalance(tx.userId, tx.amount);
      } else {
        updateBalance(tx.userId, -tx.amount);
      }
    }

    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransactionStatus = (id: string, status: TransactionStatus) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === id) {
          if (status === TransactionStatus.APPROVED && tx.status !== TransactionStatus.APPROVED) {
            if (tx.type === TransactionType.DEPOSIT) {
              updateBalance(tx.userId, tx.amount);
            } 
            // Withdraw already deducted on request, so we don't deduct again on approval
          }
          if (status === TransactionStatus.REJECTED && tx.status !== TransactionStatus.REJECTED) {
              if (tx.type === TransactionType.WITHDRAW) {
                  // Refund the user if withdraw is rejected
                  updateBalance(tx.userId, tx.amount);
              }
          }
          return { ...tx, status };
        }
        return tx;
      })
    );
  };

  const addGameResult = (result: GameResult) => {
    setGameHistory((prev) => [{...result, username: user?.username}, ...prev].slice(0, 50));
    
    if (!user) return;

    if (result.result === 'Win') {
      addTransaction({
        userId: user.id,
        type: TransactionType.BET_WIN,
        amount: result.winAmount - result.betAmount,
      });
    } else {
      addTransaction({
        userId: user.id,
        type: TransactionType.BET_LOSS,
        amount: result.betAmount,
      });
    }
  };

  const updateAdminSettings = (settings: Partial<AdminSettings>) => {
    setAdminSettings((prev) => ({ ...prev, ...settings }));
  };

  const toggleUserStatus = (userId: string) => {
     setAllUsers(prev => prev.map(u => {
         if(u.id === userId && !u.isAdmin) {
             return { ...u, status: u.status === 'active' ? 'banned' : 'active' };
         }
         return u;
     }));
  };

  const adminUpdateBalance = (userId: string, newBalance: number) => {
      setAllUsers(prev => prev.map(u => {
          if(u.id === userId) return { ...u, balance: newBalance };
          return u;
      }));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      const newTask: Task = {
          ...taskData,
          id: `task_${Date.now()}`,
          createdAt: Date.now()
      };
      setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        allUsers,
        login,
        register,
        logout,
        balance: user?.balance || 0,
        transactions,
        addTransaction,
        updateTransactionStatus,
        gameHistory,
        addGameResult,
        adminSettings,
        updateAdminSettings,
        toggleUserStatus,
        adminUpdateBalance,
        tasks: tasks || [], // Safety Check
        addTask,
        updateTaskStatus,
        deleteTask
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};