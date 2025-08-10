import React from "react";
import type { Tab } from "~/components/Demo";

interface FooterProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  showWallet?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, setActiveTab, showWallet = false }) => (
  <div className="fixed bottom-0 left-0 right-0 mx-4 mb-4 z-50">
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200/20 dark:border-gray-700/20 px-2 py-3 rounded-2xl shadow-2xl">
      <div className="flex justify-around items-center h-12">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-200 ${
            activeTab === 'home' 
              ? 'text-purple-500 bg-purple-50 dark:bg-purple-500/20 scale-105' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="text-lg mb-0.5">🎨</span>
          <span className="text-[10px] font-medium">Studio</span>
        </button>
        
        <button
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-200 ${
            activeTab === 'account' 
              ? 'text-purple-500 bg-purple-50 dark:bg-purple-500/20 scale-105' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="text-lg mb-0.5">👤</span>
          <span className="text-[10px] font-medium">Account</span>
        </button>
        
        {showWallet && (
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-200 ${
              activeTab === 'wallet' 
                ? 'text-purple-500 bg-purple-50 dark:bg-purple-500/20 scale-105' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <span className="text-lg mb-0.5">👛</span>
            <span className="text-[10px] font-medium">Wallet</span>
          </button>
        )}
      </div>
    </div>
  </div>
);
