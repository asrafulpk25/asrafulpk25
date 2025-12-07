import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { GameHeadTail } from './pages/GameHeadTail';
import { GameDice } from './pages/GameDice';
import { GameWheel } from './pages/GameWheel';
import { Wallet } from './pages/Wallet';
import { Admin } from './pages/Admin';

const LoginScreen: React.FC = () => {
    const { login, register } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    
    // Form States
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [referCode, setReferCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                if (phone && password) {
                    await login(phone, password);
                } else {
                    alert("Please fill all fields");
                }
            } else {
                if (username && email && phone && password) {
                    await register(phone, username, email, password, referCode);
                } else {
                    alert("Please fill all required fields");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Animation Blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>

            <div className="glass-panel w-full max-w-[450px] p-8 rounded-3xl shadow-2xl border border-white/10 relative z-10 backdrop-blur-xl my-auto">
                
                {/* BRAND LOGO AREA */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="relative w-24 h-24 mb-6 group cursor-default">
                        {/* Main Box Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-2xl shadow-blue-600/30"></div>
                        
                        {/* Inner Box */}
                        <div className="absolute inset-0 bg-slate-900 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 border border-white/10 flex items-center justify-center overflow-hidden">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                             <span className="text-5xl font-black text-white italic tracking-tighter z-10">DX</span>
                        </div>
                        
                        {/* Live Badge */}
                        <div className="absolute -top-2 -right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-slate-900 shadow-lg animate-bounce z-20">
                            LIVE
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        Dx BetPro <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Live</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="h-[1px] w-8 bg-slate-700"></span>
                        <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase">Premium Gaming</p>
                        <span className="h-[1px] w-8 bg-slate-700"></span>
                    </div>
                </div>

                <div className="flex bg-black/40 p-1.5 rounded-xl mb-8 relative">
                    <div 
                        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg transition-all duration-300 ${isLogin ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
                    ></div>
                    <button 
                        className={`flex-1 py-2.5 rounded-lg font-bold text-sm relative z-10 transition-colors ${isLogin ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button 
                        className={`flex-1 py-2.5 rounded-lg font-bold text-sm relative z-10 transition-colors ${!isLogin ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs text-blue-300 font-semibold ml-1">USERNAME</label>
                                <div className="relative">
                                    <i className="fas fa-user absolute left-4 top-3.5 text-slate-500"></i>
                                    <input 
                                        className="glass-input w-full rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder-slate-500"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-blue-300 font-semibold ml-1">EMAIL</label>
                                <div className="relative">
                                    <i className="fas fa-envelope absolute left-4 top-3.5 text-slate-500"></i>
                                    <input 
                                        type="email"
                                        className="glass-input w-full rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder-slate-500"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <div className="space-y-1">
                        <label className="text-xs text-blue-300 font-semibold ml-1">PHONE NUMBER</label>
                        <div className="relative">
                            <i className="fas fa-phone absolute left-4 top-3.5 text-slate-500"></i>
                            <input 
                                type="tel"
                                className="glass-input w-full rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder-slate-500"
                                placeholder="017xxxxxxxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-blue-300 font-semibold ml-1">PASSWORD</label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-3.5 text-slate-500"></i>
                            <input 
                                type="password"
                                className="glass-input w-full rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder-slate-500"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="space-y-1">
                             <label className="text-xs text-blue-300 font-semibold ml-1">REFER CODE</label>
                             <div className="relative">
                                <i className="fas fa-gift absolute left-4 top-3.5 text-slate-500"></i>
                                <input 
                                    type="text"
                                    className="glass-input w-full rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder-slate-500"
                                    placeholder="Optional (e.g. WIN100)"
                                    value={referCode}
                                    onChange={(e) => setReferCode(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    
                    <button 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 border border-white/10"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fas fa-circle-notch fa-spin"></i> Processing...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                {isLogin ? 'Login Now' : 'Create Account'} <i className="fas fa-arrow-right"></i>
                            </span>
                        )}
                    </button>
                </form>
            </div>
            
            <div className="mt-8 text-center relative z-10">
                <p className="text-slate-500 text-xs font-medium">© 2024 Dx BetPro Live. All rights reserved.</p>
                <p className="text-slate-600 text-[10px] mt-1 font-mono">v1.0.0 Release</p>
            </div>
        </div>
    );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useApp();
    if (!user) return <LoginScreen />;
    return <Layout>{children}</Layout>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useApp();
    if (!user || !user.isAdmin) return <Navigate to="/" />;
    return <Layout>{children}</Layout>;
};

const AppContent: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/game/head-tail" element={<ProtectedRoute><GameHeadTail /></ProtectedRoute>} />
                <Route path="/game/dice" element={<ProtectedRoute><GameDice /></ProtectedRoute>} />
                <Route path="/game/wheel" element={<ProtectedRoute><GameWheel /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            </Routes>
        </Router>
    );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}