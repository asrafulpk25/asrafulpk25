import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';

export const Wallet: React.FC = () => {
  const { user, balance, transactions, addTransaction, adminSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bkash');
  const [phone, setPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !phone) return;
    if (!user) return;

    if (activeTab === 'withdraw' && Number(amount) > balance) {
        alert("Insufficient Balance!");
        return;
    }
    if (activeTab === 'withdraw' && Number(amount) < adminSettings.minWithdraw) {
        alert(`Minimum withdrawal is ৳${adminSettings.minWithdraw}`);
        return;
    }
    if (activeTab === 'deposit' && Number(amount) < adminSettings.minDeposit) {
        alert(`Minimum deposit is ৳${adminSettings.minDeposit}`);
        return;
    }

    addTransaction({
      userId: user.id,
      type: activeTab === 'deposit' ? TransactionType.DEPOSIT : TransactionType.WITHDRAW,
      amount: Number(amount),
      method,
      number: phone,
      trxId: activeTab === 'deposit' ? trxId : undefined,
    });

    setAmount('');
    setPhone('');
    setTrxId('');
    alert(activeTab === 'deposit' ? 'Deposit Request Submitted! Check history.' : 'Withdrawal Request Submitted!');
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(adminSettings.paymentNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:pt-8 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-wallet text-blue-500"></i> My Wallet
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Balance Card */}
          <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20">
             <div className="absolute top-0 right-0 p-4 opacity-20">
                 <i className="fas fa-coins text-8xl text-white"></i>
             </div>
             <p className="text-blue-200 text-sm font-medium mb-1">CURRENT BALANCE</p>
             <div className="text-5xl font-mono font-bold text-white mb-2 tracking-tight">
                 ৳ {balance.toLocaleString()}
             </div>
             <p className="text-xs text-slate-400">Safe & Secure Transactions</p>
          </div>

          {/* Action Tabs */}
          <div className="glass-panel p-2 rounded-2xl flex items-center bg-black/20">
             <button 
                onClick={() => setActiveTab('deposit')}
                className={`flex-1 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'deposit' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
             >
                <i className="fas fa-plus-circle"></i> Deposit
             </button>
             <button 
                onClick={() => setActiveTab('withdraw')}
                className={`flex-1 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'withdraw' ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
             >
                <i className="fas fa-arrow-circle-down"></i> Withdraw
             </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
            <div className="glass-panel rounded-3xl p-6 border border-white/5">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    {activeTab === 'deposit' ? <span className="text-emerald-400">Add Funds</span> : <span className="text-rose-400">Cash Out</span>}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                {activeTab === 'deposit' && (
                    <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-xl mb-6">
                        <p className="text-xs text-yellow-200 mb-2 font-bold uppercase tracking-wide">Send Money To (Personal)</p>
                        <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/10">
                            <span className="font-mono text-xl text-yellow-400 font-bold tracking-wider">{adminSettings.paymentNumber}</span>
                            <button type="button" onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                                {copied ? <span className="text-green-400 text-xs font-bold">Copied!</span> : <i className="fas fa-copy"></i>}
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">* Minimum deposit: ৳{adminSettings.minDeposit}. Use "Send Money" only.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 text-xs font-bold mb-1 ml-1 uppercase">Method</label>
                        <select value={method} onChange={(e) => setMethod(e.target.value)} className="glass-input w-full rounded-xl p-3 text-white outline-none">
                            <option className="bg-slate-900">Bkash</option>
                            <option className="bg-slate-900">Nagad</option>
                            <option className="bg-slate-900">Rocket</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs font-bold mb-1 ml-1 uppercase">Amount (৳)</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="glass-input w-full rounded-xl p-3 text-white outline-none" placeholder={`Min ${activeTab === 'deposit' ? adminSettings.minDeposit : adminSettings.minWithdraw}`} required />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-bold mb-1 ml-1 uppercase">{activeTab === 'deposit' ? 'Sender Number' : 'Receiver Number'}</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="glass-input w-full rounded-xl p-3 text-white outline-none" placeholder="017xxxxxxxx" required />
                </div>

                {activeTab === 'deposit' && (
                    <div>
                        <label className="block text-slate-400 text-xs font-bold mb-1 ml-1 uppercase">Transaction ID</label>
                        <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="glass-input w-full rounded-xl p-3 text-white outline-none" placeholder="e.g. 8H3K9L..." required />
                    </div>
                )}

                <button type="submit" className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition-all active:scale-[0.98] mt-4 ${activeTab === 'deposit' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/20' : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-rose-500/20'}`}>
                    {activeTab === 'deposit' ? 'Submit Deposit Request' : 'Request Withdrawal'}
                </button>
                </form>
            </div>
        </div>

        {/* History Section */}
        <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4 ml-1">Recent Activity</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {transactions.filter(t => t.userId === user?.id).length === 0 && (
                    <div className="text-center py-8 glass-panel rounded-2xl">
                        <i className="fas fa-history text-4xl text-slate-600 mb-2"></i>
                        <p className="text-slate-500 text-sm">No transactions yet.</p>
                    </div>
                )}
                
                {transactions.filter(t => t.userId === user?.id).map((tx) => (
                    <div key={tx.id} className="glass-panel p-4 rounded-2xl flex justify-between items-center group hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === TransactionType.DEPOSIT ? 'bg-emerald-500/20 text-emerald-400' : (tx.type === TransactionType.WITHDRAW ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400')}`}>
                                <i className={`fas ${tx.type === TransactionType.DEPOSIT ? 'fa-arrow-down' : (tx.type === TransactionType.WITHDRAW ? 'fa-arrow-up' : 'fa-exchange-alt')}`}></i>
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm capitalize">{tx.type.toLowerCase().replace('_', ' ')}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{new Date(tx.timestamp).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-bold font-mono">৳{tx.amount}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tx.status === 'COMPLETED' || tx.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : (tx.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400' : 'bg-yellow-500/10 text-yellow-400')}`}>
                                {tx.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};