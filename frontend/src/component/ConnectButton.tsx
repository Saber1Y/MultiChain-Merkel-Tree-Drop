"use client";

import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { useState, useEffect } from "react";

export default function ConnectWalletButton() {
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);


  useEffect(() => {
    if (status === "connecting" || status === "reconnecting") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);


  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  
  const handleClick = () => {
    if (isConnected && !showDisconnect) {
      setShowDisconnect(true);
    } else if (!isConnected) {
      open({ view: "Connect" });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDisconnect(false);
  };


  useEffect(() => {
    const handleClickOutside = () => {
      if (showDisconnect) {
        setShowDisconnect(false);
      }
    };

    if (showDisconnect) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDisconnect]);

  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className="group relative px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative flex items-center gap-2">
         
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>


            <span className="text-sm font-semibold">
              {formatAddress(address)}
            </span>

    
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                showDisconnect ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

  
          <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 w-6 group-hover:animate-[shimmer_1.5s_ease-out] pointer-events-none"></div>
        </button>

  
        {showDisconnect && (
          <div className="absolute top-full mt-2 right-0 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="p-3 border-b border-gray-700">
              <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                Connected Wallet
              </div>
              <div className="text-sm text-white font-mono break-all">
                {address}
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>

      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <>

            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm">Connecting...</span>
          </>
        ) : (
          <>
        
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Connect Wallet</span>
          </>
        )}
      </div>

      {/* Shimmer effect */}
      {!isLoading && (
        <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 w-6 group-hover:animate-[shimmer_1.5s_ease-out] pointer-events-none"></div>
      )}
    </button>
  );
}

/* Add these custom animations to your global CSS file */
/*
@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(12deg); }
  100% { transform: translateX(200%) skewX(12deg); }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(-4px); }
  100% { opacity: 1; transform: translateY(0); }
}
*/
