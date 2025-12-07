import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const GameHeadTail: React.FC = () => {
  const { balance, addGameResult, adminSettings } = useApp();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selection, setSelection] = useState<'HEAD' | 'TAIL' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleFlip = () => {
    if (!selection) return setMessage('Please select Head or Tail');
    if (betAmount > balance) return setMessage('Insufficient Balance!');
    if (betAmount < 10) return setMessage('Minimum bet is 10');

    setIsFlipping(true);
    setMessage('');
    setLastResult(null);

    setTimeout(() => {
      const random = Math.random() * 100;
      const isWin = random < adminSettings.winPercentage;
      
      let outcome = '';
      if (isWin) {
        outcome = selection;
      } else {
        outcome = selection === 'HEAD' ? 'TAIL' : 'HEAD';
      }

      setLastResult(outcome);
      
      const winAmount = isWin ? betAmount * 1.9 : 0;

      addGameResult({
        gameId: Date.now().toString(),
        gameType: 'HEAD_TAIL',
        betAmount,
        winAmount,
        result: isWin ? 'Win' : 'Loss',
        outcome,
        timestamp: Date.now()
      });

      setIsFlipping(false);
      
      if (isWin) {
          setMessage(`🎉 You Won ৳${winAmount.toFixed(0)}!`);
      } else {
          setMessage('😞 You Lost! Try again.');
      }
    }, 2000);
  };

  return (
    <div className="p-4 md:pt-10 max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
          <Link to="/" className="glass-panel px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-arrow-left mr-2"></i> Back
          </Link>
          <div className="glass-panel px-4 py-2 rounded-lg text-yellow-500 font-mono font-bold">
              ৳ {balance.toFixed(2)}
          </div>
      </div>
      
      <div className="glass-panel w-full rounded-3xl p-8 border border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.1)] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 mb-8 tracking-wider">HEAD OR TAIL</h2>

        {/* Coin Animation Container */}
        <div className="flex justify-center mb-12 relative h-40">
           <div className={`w-32 h-32 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-[0_0_40px_rgba(234,179,8,0.6)] flex items-center justify-center text-5xl font-bold text-yellow-900 backface-hidden ${isFlipping ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
               {isFlipping ? '?' : (lastResult ? (lastResult === 'HEAD' ? 'H' : 'T') : '$')}
           </div>
        </div>

        {/* Selection Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setSelection('HEAD')}
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 ${selection === 'HEAD' ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/40 transform scale-105' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-yellow-500/50 hover:text-white'}`}
          >
            <i className="fas fa-user-astronaut text-3xl"></i>
            <span className="font-bold tracking-wider">HEAD</span>
          </button>
          <button 
            onClick={() => setSelection('TAIL')}
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 ${selection === 'TAIL' ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/40 transform scale-105' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-yellow-500/50 hover:text-white'}`}
          >
            <i className="fas fa-cannabis text-3xl"></i>
            <span className="font-bold tracking-wider">TAIL</span>
          </button>
        </div>

        {/* Betting Input */}
        <div className="mb-6 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
            <input 
                type="number" 
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="glass-input w-full rounded-xl py-4 pl-8 pr-4 text-center text-2xl font-mono font-bold text-white outline-none focus:border-yellow-500 transition-colors"
            />
            <p className="text-center text-xs text-slate-500 mt-2">Win Rate: 1.9x</p>
        </div>

        <button 
            onClick={handleFlip}
            disabled={isFlipping}
            className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-widest transition-all shadow-xl ${isFlipping ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-orange-500/30 active:scale-[0.98]'}`}
        >
            {isFlipping ? 'Flipping...' : 'PLACE BET'}
        </button>

        {message && (
            <div className={`mt-6 p-4 rounded-xl text-center font-bold border backdrop-blur-md animate-bounce ${message.includes('Won') ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                {message}
            </div>
        )}
      </div>
    </div>
  );
};