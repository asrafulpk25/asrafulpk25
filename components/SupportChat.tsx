import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hello! I am your AI support assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // In a real production app, ensure API_KEY is set in environment variables
      const apiKey = process.env.API_KEY || 'YOUR_API_KEY_HERE'; 
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful support agent for a betting app called BetPro. 
        Rules: 
        1. Deposits are processed via Bkash/Nagad within 5 minutes.
        2. Withdrawals take up to 24 hours.
        3. Minimum deposit 500 BDT, minimum withdraw 1000 BDT.
        4. Be polite and concise.
        
        User Query: ${userMessage}`,
      });

      const text = response.text;
      setMessages(prev => [...prev, { role: 'model', text: text || "I'm having trouble connecting right now." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am currently offline (API Key missing or error)." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg z-50 transition-all"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-headset'} text-xl`}></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 md:bottom-24 md:right-8 w-80 h-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-slate-900 p-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-white"><i className="fas fa-robot mr-2 text-blue-400"></i>AI Support</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
               <div className="bg-slate-700 text-slate-200 p-2 rounded-lg text-sm">
                 <i className="fas fa-circle-notch fa-spin"></i> Typing...
               </div>
             </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for help..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button onClick={handleSend} disabled={isLoading} className="text-blue-400 hover:text-blue-300 px-2">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};