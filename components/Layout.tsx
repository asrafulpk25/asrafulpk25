import React from 'react';
import { Navbar } from './Navbar';
import { SupportChat } from './SupportChat';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
         <div className="blob blob-1"></div>
         <div className="blob blob-2"></div>
         <div className="blob blob-3"></div>
      </div>

      <main className="relative z-10 w-full pb-20 md:pb-0">
        {children}
      </main>
      <Navbar />
      <SupportChat />
    </div>
  );
};