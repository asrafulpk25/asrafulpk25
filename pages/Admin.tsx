import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionStatus, TransactionType } from '../types';

export const Admin: React.FC = () => {
  const { 
      transactions, 
      updateTransactionStatus, 
      adminSettings, 
      updateAdminSettings, 
      allUsers, 
      toggleUserStatus,
      adminUpdateBalance,
      tasks,
      addTask,
      updateTaskStatus,
      deleteTask
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'settings' | 'tasks'>('dashboard');
  const [editingUserBalance, setEditingUserBalance] = useState<{id: string, amount: string} | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM' as 'LOW'|'MEDIUM'|'HIGH' });

  // Safe defaults
  const pendingTransactions = (transactions || []).filter(t => t.status === TransactionStatus.PENDING);
  const userList = allUsers || [];
  const taskList = tasks || [];

  const handleAddTask = () => {
      if(!newTask.title) return alert("Task title required");
      addTask({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          status: 'PENDING'
      });
      setNewTask({ title: '', description: '', priority: 'MEDIUM' });
  };

  const TabButton = ({ id, label, icon }: { id: any, label: string, icon: string }) => (
      <button 
        onClick={() => setActiveTab(id)} 
        className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
      >
          <i className={`fas ${icon}`}></i> {label}
      </button>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto pb-24 md:pt-8">
       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
           <h1 className="text-3xl font-bold text-white"><i className="fas fa-shield-halved text-blue-500 mr-2"></i>Admin Dashboard</h1>
           
           <div className="glass-panel p-1.5 rounded-2xl flex overflow-x-auto max-w-full">
               <TabButton id="dashboard" label="Requests" icon="fa-inbox" />
               <TabButton id="users" label="Users" icon="fa-users" />
               <TabButton id="tasks" label="Tasks" icon="fa-list-check" />
               <TabButton id="settings" label="Config" icon="fa-sliders" />
           </div>
       </div>

       {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 gap-6">
             <div className="glass-panel p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    Pending Transactions
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                   {pendingTransactions.length === 0 && (
                       <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-slate-700">
                           <i className="fas fa-check-circle text-4xl text-emerald-500/50 mb-3"></i>
                           <p className="text-slate-500">All caught up! No pending requests.</p>
                       </div>
                   )}
                   
                   {pendingTransactions.map(tx => (
                       <div key={tx.id} className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-500/30 transition-colors">
                           <div>
                               <div className="flex items-center gap-3 mb-1">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === TransactionType.DEPOSIT ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {tx.type}
                                    </span>
                                    <span className="text-slate-400 text-sm">{tx.method}</span>
                               </div>
                               <div className="text-sm text-slate-300">
                                   <p><i className="fas fa-phone mr-1 text-slate-500"></i> {tx.number}</p>
                                   <p><i className="fas fa-hashtag mr-1 text-slate-500"></i> <span className="text-yellow-500 font-mono">{tx.trxId || 'N/A'}</span></p>
                               </div>
                           </div>
                           <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end bg-black/20 p-3 rounded-xl md:bg-transparent md:p-0">
                               <span className="text-2xl font-mono font-bold text-white">৳{tx.amount}</span>
                               <div className="flex gap-3">
                                   <button 
                                       onClick={() => updateTransactionStatus(tx.id, TransactionStatus.APPROVED)}
                                       className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-110 flex items-center justify-center"
                                       title="Approve"
                                   >
                                       <i className="fas fa-check"></i>
                                   </button>
                                   <button 
                                       onClick={() => updateTransactionStatus(tx.id, TransactionStatus.REJECTED)}
                                       className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-110 flex items-center justify-center"
                                       title="Reject"
                                   >
                                       <i className="fas fa-times"></i>
                                   </button>
                               </div>
                           </div>
                       </div>
                   ))}
                </div>
             </div>
          </div>
       )}

       {activeTab === 'users' && (
           <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
               <div className="p-6 border-b border-white/5 bg-white/5">
                   <h3 className="font-bold text-white text-lg">User Database</h3>
               </div>
               <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-slate-400">
                       <thead className="bg-black/30 text-slate-200 uppercase font-bold text-xs tracking-wider">
                           <tr>
                               <th className="px-6 py-4">User</th>
                               <th className="px-6 py-4">Contact</th>
                               <th className="px-6 py-4">Code</th>
                               <th className="px-6 py-4">Wallet</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4">Action</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                           {userList.map((u) => (
                               <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                   <td className="px-6 py-4 font-medium text-white">
                                       <div className="flex items-center gap-2">
                                           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${u.isAdmin ? 'bg-purple-600' : 'bg-slate-700'}`}>
                                               <i className={`fas ${u.isAdmin ? 'fa-user-shield' : 'fa-user'} text-xs text-white`}></i>
                                           </div>
                                           {u.username}
                                       </div>
                                   </td>
                                   <td className="px-6 py-4">
                                       <div className="flex flex-col">
                                           <span>{u.phone}</span>
                                           <span className="text-xs opacity-50">{u.email}</span>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 text-xs font-mono bg-black/20 rounded px-2">{u.referCode || 'N/A'}</td>
                                   <td className="px-6 py-4">
                                       {editingUserBalance?.id === u.id ? (
                                           <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-blue-500/50">
                                               <input 
                                                   type="number" 
                                                   value={editingUserBalance.amount} 
                                                   onChange={(e) => setEditingUserBalance({...editingUserBalance, amount: e.target.value})}
                                                   className="w-20 bg-transparent text-white outline-none text-right font-mono"
                                               />
                                               <button onClick={() => {
                                                   adminUpdateBalance(u.id, Number(editingUserBalance.amount));
                                                   setEditingUserBalance(null);
                                               }} className="text-emerald-400 hover:text-emerald-300"><i className="fas fa-check-circle"></i></button>
                                               <button onClick={() => setEditingUserBalance(null)} className="text-rose-400 hover:text-rose-300"><i className="fas fa-times-circle"></i></button>
                                           </div>
                                       ) : (
                                            <span 
                                                className="cursor-pointer font-mono text-white hover:text-blue-400 border-b border-dashed border-slate-600 pb-0.5"
                                                onClick={() => setEditingUserBalance({id: u.id, amount: u.balance.toString()})}
                                            >
                                                ৳ {u.balance}
                                            </span>
                                       )}
                                   </td>
                                   <td className="px-6 py-4">
                                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                           {u.status}
                                       </span>
                                   </td>
                                   <td className="px-6 py-4">
                                       {!u.isAdmin && (
                                           <button 
                                                onClick={() => toggleUserStatus(u.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${u.status === 'active' ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
                                           >
                                               {u.status === 'active' ? 'BAN USER' : 'ACTIVATE'}
                                           </button>
                                       )}
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
       )}

       {activeTab === 'tasks' && (
            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><i className="fas fa-plus-circle text-blue-500"></i> New Task</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Title</label>
                            <input 
                                type="text" 
                                value={newTask.title}
                                onChange={e => setNewTask({...newTask, title: e.target.value})}
                                className="glass-input w-full rounded-xl p-3 text-white outline-none"
                                placeholder="Task title..."
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Priority</label>
                            <select 
                                value={newTask.priority}
                                onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                                className="glass-input w-full rounded-xl p-3 text-white outline-none bg-slate-900"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleAddTask}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                        >
                            Create Task
                        </button>
                    </div>
                    <div className="mt-4">
                        <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Details</label>
                        <textarea 
                            value={newTask.description}
                            onChange={e => setNewTask({...newTask, description: e.target.value})}
                            className="glass-input w-full rounded-xl p-3 text-white text-sm outline-none h-20"
                            placeholder="Optional details..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                        <div key={status} className="glass-panel p-4 rounded-3xl border border-white/5 min-h-[300px] flex flex-col">
                            <h4 className="font-bold text-slate-300 mb-4 border-b border-white/5 pb-3 flex justify-between items-center text-sm uppercase tracking-wider">
                                {status.replace('_', ' ')}
                                <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white">
                                    {taskList.filter(t => t.status === status).length}
                                </span>
                            </h4>
                            <div className="space-y-3 flex-1">
                                {taskList.filter(t => t.status === status).map(task => (
                                    <div key={task.id} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 relative group hover:border-blue-500/30 transition-all hover:translate-y-[-2px]">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : task.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {task.priority}
                                            </span>
                                            <button onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-rose-400 transition-colors"><i className="fas fa-trash-alt"></i></button>
                                        </div>
                                        <h5 className="font-bold text-white text-sm mb-1">{task.title}</h5>
                                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
                                        
                                        <div className="flex gap-2 mt-auto">
                                            {status !== 'PENDING' && (
                                                <button onClick={() => updateTaskStatus(task.id, 'PENDING')} className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1.5 rounded-lg text-white transition-colors"><i className="fas fa-arrow-left"></i></button>
                                            )}
                                            {status !== 'COMPLETED' && (
                                                <button 
                                                    onClick={() => updateTaskStatus(task.id, status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED')} 
                                                    className={`text-xs px-2 py-1.5 rounded-lg text-white flex-1 font-bold transition-colors ${status === 'PENDING' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                                                >
                                                    {status === 'PENDING' ? 'Start' : 'Finish'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
       )}

       {activeTab === 'settings' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6"><i className="fas fa-gamepad text-purple-500 mr-2"></i>Game Logic (Rigging)</h3>
                    <div className="mb-8">
                        <label className="flex justify-between text-slate-300 mb-3 text-sm font-bold">
                            <span>Global Win Probability</span>
                            <span className="font-mono text-yellow-500">{adminSettings?.winPercentage ?? 45}%</span>
                        </label>
                        <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                             <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300"
                                style={{ width: `${adminSettings?.winPercentage ?? 45}%`}}
                             ></div>
                             <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={adminSettings?.winPercentage ?? 45}
                                onChange={(e) => updateAdminSettings({ winPercentage: Number(e.target.value) })}
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>User always loses</span>
                            <span>Fair (50%)</span>
                            <span>User always wins</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-white/5">
                        <div>
                            <p className="text-white font-bold text-sm">Fake Winners Feed</p>
                            <p className="text-xs text-slate-400">Generates dummy activity in ticker</p>
                        </div>
                        <button 
                            onClick={() => updateAdminSettings({ enableFakeHistory: !adminSettings?.enableFakeHistory })}
                            className={`w-14 h-8 rounded-full relative transition-all duration-300 ${adminSettings?.enableFakeHistory ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-md transition-all duration-300 ${adminSettings?.enableFakeHistory ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6"><i className="fas fa-cogs text-blue-500 mr-2"></i>Platform Config</h3>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2 uppercase">Payment Number (Bkash/Nagad)</label>
                            <div className="relative">
                                <i className="fas fa-mobile-alt absolute left-4 top-3.5 text-slate-500"></i>
                                <input 
                                    type="text"
                                    value={adminSettings?.paymentNumber || ''}
                                    onChange={(e) => updateAdminSettings({ paymentNumber: e.target.value })}
                                    className="glass-input w-full rounded-xl py-3 pl-10 pr-4 text-white font-mono outline-none"
                                />
                            </div>
                        </div>
                        
                        <div>
                           <label className="block text-slate-400 text-xs font-bold mb-2 uppercase">Notice Board Text</label>
                           <textarea 
                              className="glass-input w-full rounded-xl p-4 text-white text-sm outline-none h-24"
                              value={adminSettings?.noticeText || ''}
                              onChange={(e) => updateAdminSettings({ noticeText: e.target.value })}
                           ></textarea>
                        </div>
                    </div>
                </div>
           </div>
       )}
    </div>
  );
};