import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const GameDice: React.FC = () => {
  const { balance, addGameResult, adminSettings } = useApp();
  const [betAmount, setBetAmount] = useState<number>(50);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const handleRoll = () => {
    if (!selectedNumber) return setMessage('Select a number (1-6)');
    if (betAmount > balance) return setMessage('Insufficient Balance!');

    setIsRolling(true);
    setMessage('');
    
    setTimeout(() => {
       const random = Math.random() * 100;
       const isWin = random < (adminSettings.winPercentage / 6) * 5; 
       
       let outcome = Math.floor(Math.random() * 6) + 1;
       
       if (!isWin && outcome === selectedNumber) {
           outcome = outcome === 6 ? 1 : outcome + 1;
       }

       setDiceResult(outcome);
       const actualWin = outcome === selectedNumber;
       const winAmount = actualWin ? betAmount * 5 : 0; 

       addGameResult({
        gameId: Date.now().toString(),
        gameType: 'DICE',
        betAmount,
        winAmount,
        result: actualWin ? 'Win' : 'Loss',
        outcome: outcome.toString(),
        timestamp: Date.now()
      });

      setIsRolling(false);
      setMessage(actualWin ? `🎉 You Won ৳${winAmount}!` : `Rolled ${outcome}. You Lost.`);
    }, 1500);
  };

  return (
    <div className="p-4 md:pt-10 max-w-2xl mx-auto flex flex-col items-center">
       <div className="w-full flex justify-between items-center mb-6">
          <Link to="/" className="glass-panel px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-arrow-left mr-2"></i> Back
          </Link>
          <div className="glass-panel px-4 py-2 rounded-lg text-red-500 font-mono font-bold">
              ৳ {balance.toFixed(2)}
          </div>
      </div>

      <div className="glass-panel w-full rounded-3xl p-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 mb-8 tracking-wider">LUCKY DICE</h2>

        {/* Dice Visual */}
        <div className="flex justify-center mb-10 min-h-[120px] items-center perspective-1000">
            {isRolling ? (
                 <i className="fas fa-dice text-9xl text-white animate-spin-slow blur-sm opacity-80"></i>
            ) : (
                <div className="w-28 h-28 bg-gradient-to-br from-white to-slate-300 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.2)] transform rotate-12 transition-all hover:rotate-0 hover:scale-110">
                     {diceResult ? (
                         <i className={`fas fa-dice-${['one','two','three','four','five','six'][diceResult-1]} text-7xl text-red-600`}></i>
                     ) : (
                        <i className="fas fa-question text-5xl text-slate-400"></i>
                     )}
                </div>
            )}
        </div>

        {/* Number Selection */}
        <p className="text-center text-slate-400 text-sm mb-4">Pick your lucky number</p>
        <div className="grid grid-cols-6 gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                    key={num}
                    onClick={() => setSelectedNumber(num)}
                    className={`aspect-square rounded-xl font-bold text-xl border transition-all duration-200 ${selectedNumber === num ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/40 scale-110' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-red-500/50 hover:text-white'}`}
                >
                    {num}
                </button>
            ))}
        </div>

        {/* Betting Input */}
        <div className="mb-6 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
            <input 
                type="number" 
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="glass-input w-full rounded-xl py-4 pl-8 pr-4 text-center text-2xl font-mono font-bold text-white outline-none focus:border-red-500 transition-colors"
                placeholder="Bet Amount"
            />
            <p className="text-center text-xs text-slate-500 mt-2">Payout: 5x</p>
        </div>

        <button 
            onClick={handleRoll}
            disabled={isRolling}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-xl ${isRolling ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-red-500/30 active:scale-[0.98]'}`}
        >
            {isRolling ? 'Rolling...' : 'ROLL TO WIN'}
        </button>

        {message && (
             <div className={`mt-6 p-4 rounded-xl text-center font-bold border backdrop-blur-md animate-pulse ${message.includes('Won') ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600'}`}>
                {message}
            </div>
        )}
      </div>
    </div>
  );
};