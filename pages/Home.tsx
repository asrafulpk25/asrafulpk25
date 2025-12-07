import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { adminSettings, gameHistory, user, balance } = useApp();

  const games = [
    {
      id: 'head-tail',
      name: 'Head & Tail',
      icon: 'fa-coins',
      color: 'from-yellow-400 to-orange-500',
      shadow: 'shadow-orange-500/20',
      desc: 'Flip & Double',
      path: '/game/head-tail'
    },
    {
      id: 'dice',
      name: 'Lucky Dice',
      icon: 'fa-dice',
      color: 'from-red-500 to-pink-600',
      shadow: 'shadow-pink-500/20',
      desc: 'Roll 1-6 & Win',
      path: '/game/dice'
    },
    {
      id: 'wheel',
      name: 'Dx Woin Wheel',
      icon: 'fa-dharmachakra',
      color: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-purple-500/20',
      desc: 'Spin for Big Prizes',
      path: '/game/wheel'
    }
  ];

  const winners = gameHistory.filter(g => g.result === 'Win');

  return (
    <div className="p-4 md:pt-8 max-w-6xl mx-auto">
      
      {/* Welcome & Balance Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
            <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white mb-1">
                    Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.username}</span>!
                </h1>
                <p className="text-slate-400 text-sm mb-6">Ready to test your luck today?</p>
                
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <i className="fas fa-bullhorn text-yellow-500 bg-yellow-500/10 p-2 rounded-lg"></i>
                         <p className="text-sm text-slate-300">{adminSettings.noticeText}</p>
                     </div>
                </div>
            </div>
        </div>

        {/* Mobile-Style Balance Card (Visible always now) */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-t border-white/10">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
             <p className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">Total Balance</p>
             <h2 className="text-4xl font-mono font-bold text-white mb-4">৳ {balance.toLocaleString()}</h2>
             <div className="flex gap-2">
                 <button onClick={() => navigate('/wallet')} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 rounded-lg text-sm transition-colors shadow-lg shadow-emerald-500/20">
                    <i className="fas fa-plus mr-1"></i> Deposit
                 </button>
                 <button onClick={() => navigate('/wallet')} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                    Withdraw
                 </button>
             </div>
        </div>
      </div>

      {/* Live Ticker */}
      {winners.length > 0 && (
          <div className="mb-8 glass-panel rounded-xl py-2 px-1 border-y border-white/5 overflow-hidden">
              <div className="flex items-center gap-2 mb-2 px-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live Winners</span>
              </div>
              <div className="relative flex overflow-x-hidden w-full mask-gradient">
                  <div className="animate-marquee whitespace-nowrap flex gap-3 px-4">
                      {winners.map((win, idx) => (
                          <div key={`${win.gameId}-${idx}`} className="flex items-center gap-3 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                              <span className="text-xs text-slate-300 font-medium">{win.username}:</span>
                              <span className="text-sm font-bold text-yellow-400">৳{win.winAmount.toFixed(0)}</span>
                              <i className={`fas ${win.gameType === 'HEAD_TAIL' ? 'fa-coins' : win.gameType === 'DICE' ? 'fa-dice' : 'fa-dharmachakra'} text-[10px] text-slate-500`}></i>
                          </div>
                      ))}
                      {/* Duplicate for smooth loop */}
                      {winners.map((win, idx) => (
                          <div key={`dup-${win.gameId}-${idx}`} className="flex items-center gap-3 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                              <span className="text-xs text-slate-300 font-medium">{win.username}:</span>
                              <span className="text-sm font-bold text-yellow-400">৳{win.winAmount.toFixed(0)}</span>
                              <i className={`fas ${win.gameType === 'HEAD_TAIL' ? 'fa-coins' : win.gameType === 'DICE' ? 'fa-dice' : 'fa-dharmachakra'} text-[10px] text-slate-500`}></i>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Games Grid */}
      <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-gamepad text-purple-500"></i> Featured Games
          </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <div 
            key={game.id}
            onClick={() => navigate(game.path)}
            className={`group glass-panel rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-white/20`}
          >
            <div className={`h-40 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute w-32 h-32 bg-white/20 rounded-full blur-2xl top-0 left-0 -translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
                
                <i className={`fas ${game.icon} text-7xl text-white drop-shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}></i>
            </div>
            
            <div className="p-5 relative">
              <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{game.name}</h3>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{game.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <i className="fas fa-play text-xs"></i>
                  </div>
              </div>
              
              <button className="mt-4 w-full bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-white py-3 rounded-xl font-semibold transition-all group-hover:shadow-lg">
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};