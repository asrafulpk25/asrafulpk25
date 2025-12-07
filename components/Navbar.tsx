import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { user, balance, logout } = useApp();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path 
    ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
    : 'text-slate-400 hover:text-white hover:bg-white/5';

  return (
    <nav className="fixed bottom-4 left-4 right-4 md:top-0 md:bottom-auto md:left-0 md:right-0 z-50">
      <div className="glass-panel rounded-2xl md:rounded-none md:border-b md:border-t-0 border-slate-700/50 p-3 md:px-8 md:py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo (Hidden on mobile, visible on desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Icon Box */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10 overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="font-black text-white italic text-lg z-10 tracking-tighter">DX</span>
            </div>
            {/* Text */}
            <div className="flex flex-col justify-center h-full">
                <span className="text-lg font-bold text-white tracking-tight leading-none">
                    BetPro
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] leading-none">
                        Live
                    </span>
                </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center justify-between w-full md:w-auto md:gap-4">
            <Link to="/" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive('/')}`}>
                <i className="fas fa-home text-xl md:text-lg mb-1 md:mb-0"></i>
                <span className="text-[10px] md:text-sm font-medium">Home</span>
            </Link>
            
            {!user.isAdmin && (
                <Link to="/wallet" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive('/wallet')}`}>
                    <i className="fas fa-wallet text-xl md:text-lg mb-1 md:mb-0"></i>
                    <span className="text-[10px] md:text-sm font-medium">Wallet</span>
                </Link>
            )}

            {user.isAdmin && (
                 <Link to="/admin" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive('/admin')}`}>
                 <i className="fas fa-shield-halved text-xl md:text-lg mb-1 md:mb-0"></i>
                 <span className="text-[10px] md:text-sm font-medium">Admin</span>
             </Link>
            )}

            {/* Mobile Logout (Icon only) */}
             <button onClick={logout} className="md:hidden flex flex-col items-center gap-1 px-4 py-2 text-red-400 hover:text-red-300">
                <i className="fas fa-power-off text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Exit</span>
             </button>
          </div>

          {/* Desktop Right Side (Balance + Logout) */}
          <div className="hidden md:flex items-center gap-6">
             {!user.isAdmin && (
                <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <span className="text-emerald-400 font-bold text-lg">৳</span>
                    <span className="font-mono text-white text-lg font-semibold tracking-wide">{balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
             )}
             <button onClick={logout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
                <span className="text-sm font-medium">Logout</span>
                <i className="fas fa-arrow-right-from-bracket"></i>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};