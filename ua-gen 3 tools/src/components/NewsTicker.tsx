import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface NewsTickerProps {
  layoutMode: 'desktop-inline' | 'mobile-bar';
}

interface TickerConfig {
  text: string;
  enabled: boolean;
  updatedAt: any;
  updatedBy: string;
}

export default function NewsTicker({ layoutMode }: NewsTickerProps) {
  const [ticker, setTicker] = useState<TickerConfig | null>(null);

  useEffect(() => {
    const tickerRef = doc(db, 'settings', 'ticker');
    const unsubscribe = onSnapshot(
      tickerRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setTicker(snapshot.data() as TickerConfig);
        } else {
          setTicker({
            text: '',
            enabled: false,
            updatedAt: null,
            updatedBy: ''
          });
        }
      },
      (error) => {
        console.error('Error fetching real-time announcement ticker:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  if (!ticker || !ticker.enabled || !ticker.text.trim()) {
    return null;
  }

  // Speed calculation based on character count for premium pacing
  const textLength = ticker.text.length;
  const duration = Math.max(8, Math.min(35, textLength * 0.25));

  // Colorful bullet dots and heart divider
  const PrefixElement = () => (
    <div className="flex items-center gap-1 shrink-0 select-none mr-2">
      <span className="text-[10px] text-red-500 animate-pulse">❤️</span>
      <span className="text-[10px] font-black tracking-tighter text-[#22d3ee] uppercase ml-1">NEWS :</span>
    </div>
  );

  const TickerItem = () => (
    <div className="flex items-center gap-2 shrink-0 pr-16 select-none">
      <PrefixElement />
      <span className="text-white font-medium tracking-wide text-xs flex items-center gap-1">
        {ticker.text} <span className="text-red-500 animate-pulse ml-1 text-xs">❤️</span>
      </span>
    </div>
  );

  const TickerItemMobile = () => (
    <div className="flex items-center gap-2 shrink-0 pr-12 select-none">
      <PrefixElement />
      <span className="text-white/90 font-medium tracking-wide text-[11px] flex items-center gap-1">
        {ticker.text} <span className="text-red-500 animate-pulse ml-1 text-xs">❤️</span>
      </span>
    </div>
  );

  if (layoutMode === 'desktop-inline') {
    return (
      <div className="hidden lg:flex items-center w-full h-8 bg-white/[0.01] border border-white/5 rounded-full px-3 relative overflow-hidden group select-none">
        {/* Hardware-accelerated, seamless 3-copy translation logic */}
        <style>{`
          @keyframes ticker-seamless-loop {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.3333%, 0, 0); }
          }
          .animate-ticker-seamless {
            animation: ticker-seamless-loop var(--ticker-duration, 15s) linear infinite;
          }
          .animate-ticker-seamless:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Marquee Window */}
        <div className="flex-1 min-w-0 overflow-hidden relative flex items-center h-full">
          <div 
            className="flex animate-ticker-seamless w-max whitespace-nowrap py-0"
            style={{ '--ticker-duration': `${duration}s` } as React.CSSProperties}
          >
            <TickerItem />
            <TickerItem />
            <TickerItem />
          </div>
        </div>
      </div>
    );
  }

  // Mobile/Tablet full-width bar (placed right below header)
  return (
    <div className="lg:hidden w-full bg-gradient-to-r from-[#11192e]/90 via-[#0f172a]/95 to-[#11192e]/90 border-b border-white/[0.06] py-1.5 px-4 overflow-hidden relative flex items-center shrink-0 z-20 select-none">
      <style>{`
        @keyframes ticker-seamless-loop-mobile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333%, 0, 0); }
        }
        .animate-ticker-seamless-mobile {
          animation: ticker-seamless-loop-mobile var(--ticker-duration, 15s) linear infinite;
        }
      `}</style>

      {/* Scrolling container */}
      <div className="flex-1 overflow-hidden relative flex items-center">
        <div 
          className="flex animate-ticker-seamless-mobile w-max whitespace-nowrap"
          style={{ '--ticker-duration': `${duration}s` } as React.CSSProperties}
        >
          <TickerItemMobile />
          <TickerItemMobile />
          <TickerItemMobile />
        </div>
      </div>
    </div>
  );
}
