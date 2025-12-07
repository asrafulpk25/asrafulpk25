import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const GameWheel: React.FC = () => {
  const { balance, addGameResult, adminSettings } = useApp();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState('');

  const segments = [2, 0, 3, 0, 2, 0, 10, 0];

  const handleSpin = () => {
    if (betAmount > balance) return setMessage('Insufficient Balance');
    
    setIsSpinning(true);
    setMessage('');
    
    const random = Math.random() * 100;
    const userWins = random < adminSettings.winPercentage;
    let targetIndex;
    
    if (userWins) {
        const winningIndices = [0, 2, 4, 6]; 
        targetIndex = winningIndices[Math.floor(Math.random() * winningIndices.length)];
    } else {
        const losingIndices = [1, 3, 5, 7];
        targetIndex = losingIndices[Math.floor(Math.random() * losingIndices.length)];
    }

    const segmentAngle = 360 / segments.length;
    const targetAngle = 360 * 5 + (360 - (targetIndex * segmentAngle)); 
    
    setRotation(targetAngle);

    setTimeout(() => {
        setIsSpinning(false);
        const multiplier = segments[targetIndex];
        const winAmount = betAmount * multiplier;
        
        addGameResult({
            gameId: Date.now().toString(),
            gameType: 'WHEEL',
            betAmount,
            winAmount,
            result: winAmount > 0 ? 'Win' : 'Loss',
            outcome: `${multiplier}x`,
            timestamp: Date.now()
        });

        if (winAmount > 0) {
            setMessage(`🔥 Big Win! ${multiplier}x -> ৳${winAmount}`);
        } else {
            setMessage('😢 Bad Luck! 0x');
        }
    }, 3000);
  };

  return (
    <div className="p-4 md:pt-10 max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
          <Link to="/" className="glass-panel px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-arrow-left mr-2"></i> Back
          </Link>
          <div className="glass-panel px-4 py-2 rounded-lg text-purple-500 font-mono font-bold">
              ৳ {balance.toFixed(2)}
          </div>
        </div>
        
        <div className="glass-panel w-full rounded-3xl p-6 border border-purple-500/20 text-center shadow-[0_0_50px_rgba(168,85,247,0.1)] relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-8 tracking-wider">DX SUPER WHEEL</h2>
            
            <div className="relative w-72 h-72 mx-auto mb-10">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 z-20">
                    <i className="fas fa-caret-down text-4xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"></i>
                </div>

                {/* Outer Ring */}
                <div className="absolute inset-[-10px] rounded-full border-4 border-slate-700/50"></div>

                {/* Wheel */}
                <div 
                    className="w-full h-full rounded-full border-4 border-slate-800 relative overflow-hidden transition-transform duration-[3000ms] cubic-bezier(0.2, 0.8, 0.2, 1) shadow-2xl"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                     {/* Gradient Wheel */}
                     <div className="w-full h-full rounded-full" style={{
                         background: `conic-gradient(
                            #3b82f6 0deg 45deg, 
                            #ef4444 45deg 90deg, 
                            #22c55e 90deg 135deg, 
                            #ef4444 135deg 180deg, 
                            #3b82f6 180deg 225deg, 
                            #ef4444 225deg 270deg, 
                            #eab308 270deg 315deg, 
                            #ef4444 315deg 360deg
                         )`
                     }}></div>
                     
                     {/* Labels */}
                     {segments.map((mult, idx) => (
                         <div key={idx} className="absolute top-1/2 left-1/2 w-full h-6 -mt-3 origin-center text-right pr-6 font-bold text-white text-lg shadow-black drop-shadow-md" style={{ transform: `rotate(${idx * 45 + 22.5}deg) translateX(-50%)`}}>
                             {mult}x
                         </div>
                     ))}
                     
                     {/* Center Cap */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 rounded-full border-2 border-slate-600 flex items-center justify-center z-10 shadow-lg">
                        <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                     </div>
                </div>
            </div>

            <div className="mb-6 relative max-w-xs mx-auto">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
                <input 
                    type="number" 
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="glass-input w-full rounded-xl py-3 pl-8 pr-4 text-center text-xl font-mono text-white outline-none focus:border-purple-500" 
                />
            </div>

            <button 
                onClick={handleSpin}
                disabled={isSpinning}
                className={`w-full max-w-xs py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${isSpinning ? 'bg-slate-700 text-slate-400' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/30 active:scale-[0.98]'}`}
            >
                {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
            </button>
            
            {message && (
                 <div className={`mt-6 p-3 rounded-lg font-bold border backdrop-blur-md ${message.includes('Win') ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-700/50 text-slate-300'}`}>
                    {message}
                </div>
            )}
        </div>
    </div>
  );
};