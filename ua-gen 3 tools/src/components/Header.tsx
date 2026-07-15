/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Layers, LogOut, ShieldAlert, User } from 'lucide-react';
import NewsTicker from './NewsTicker';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  currentUser: { name: string; email: string; role: string } | null;
  isAdminView?: boolean;
  onToggleAdminView?: () => void;
  onLogout: () => void;
  onLogoClick?: () => void;
}

export default function Header({
  currentUser,
  isAdminView: propIsAdminView,
  onToggleAdminView,
  onLogout,
  onLogoClick,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminView = propIsAdminView !== undefined ? propIsAdminView : location.pathname === '/admin';
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#0b1326]/60 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col">
      {/* Main Header Container */}
      <div className="flex items-center px-4 md:px-8 h-16 w-full max-w-7xl mx-auto relative gap-4">
        
        {/* Branding (Left) */}
        <div 
          onClick={() => {
            if (onLogoClick) {
              onLogoClick();
            } else {
              navigate('/');
            }
          }}
          className="flex items-center gap-3 group transition-all cursor-pointer hover:opacity-90 relative z-10 shrink-0"
        >
          {/* Logo Icon with gradient, rounded corners, glow, and scale-up hover */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#22d3ee] via-[#3b82f6] to-[#8b5cf6] shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 group-hover:scale-105 active:scale-95">
            <Layers className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex items-center hidden sm:block">
            <h1 className="text-xl font-extrabold tracking-widest leading-tight flex items-center gap-1.5 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.65)] group-hover:drop-shadow-[0_0_16px_rgba(139,92,246,0.85)] transition-all duration-300 select-none">
              <span className="text-white">UA</span>
              <span className="bg-gradient-to-r from-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent">GEN</span>
            </h1>
          </div>
        </div>

        {/* Desktop News Ticker (Middle of Header - uses flex-1 to take available space) */}
        {currentUser ? (
          <div className="hidden lg:flex flex-1 justify-center items-center pointer-events-auto z-10 overflow-hidden px-4">
            <div className="w-full max-w-4xl">
              <NewsTicker layoutMode="desktop-inline" />
            </div>
          </div>
        ) : (
          /* Navigation Menu (Middle of Header) - Only for public pages (not logged in) */
          location.pathname !== '/login' && (
            <div className="hidden md:flex flex-1 justify-center items-center pointer-events-auto z-10">
              <nav className="flex items-center gap-8 px-6 py-2">
                <button 
                  onClick={() => {
                    if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                    else navigate('/');
                  }} 
                  className="group relative text-sm font-semibold text-[#c2c6d6] hover:text-[#22d3ee] transition-colors active:scale-95"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#22d3ee] transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => {
                    if (location.pathname === '/') {
                      document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      navigate('/');
                      setTimeout(() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                    }
                  }} 
                  className="group relative text-sm font-semibold text-[#c2c6d6] hover:text-[#22d3ee] transition-colors active:scale-95"
                >
                  Tools
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#22d3ee] transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => {
                    if (location.pathname === '/') {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      navigate('/');
                      setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                    }
                  }} 
                  className="group relative text-sm font-semibold text-[#c2c6d6] hover:text-[#22d3ee] transition-colors active:scale-95"
                >
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#22d3ee] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </nav>
            </div>
          )
        )}

        {/* Mobile/Tablet filler when no middle content */}
        <div className="flex-1 lg:hidden"></div>

        {/* Utility Actions (Right) */}
        {currentUser ? (
          <div className="flex items-center gap-2.5 sm:gap-4 relative z-10">
            {/* User info display on desktop */}
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1 text-xs">
              <User className="w-3.5 h-3.5 text-[#22d3ee]" />
              <span className="text-white font-medium">{currentUser.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-white/5 rounded text-[#c2c6d6]/60 font-mono tracking-wide uppercase">
                {currentUser.role}
              </span>
            </div>

            {/* Admin Toggle button (if user is admin or sub-admin) */}
            {(currentUser.role === 'admin' || currentUser.role === 'sub-admin') && (
              <button
                onClick={() => {
                  if (onToggleAdminView) {
                    onToggleAdminView();
                  } else {
                    if (isAdminView) {
                      navigate('/tools');
                    } else {
                      navigate('/admin');
                    }
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 hover:bg-[#22d3ee]/20 transition-all text-xs font-bold font-sans active:scale-95 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isAdminView ? 'Tool Panel' : 'Admin Panel'}
                </span>
                <span className="sm:hidden">
                  {isAdminView ? 'Tool' : 'Admin'}
                </span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500/25 transition-all text-xs font-bold hover:border-red-500/25 active:scale-95"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          location.pathname !== '/login' && (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-1.5 rounded-xl border border-white/20 text-white hover:bg-white/5 hover:-translate-y-0.5 transition-all text-sm font-semibold"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/login', { state: { initialTab: 'register' } })}
                className="px-4 py-1.5 rounded-xl bg-[#22d3ee] text-[#0b1326] hover:bg-[#4cd7f6] hover:-translate-y-0.5 transition-all text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              >
                Sign Up
              </button>
            </div>
          )
        )}
      </div>

      {/* Mobile News Ticker (Directly attached below main Header on mobile/tablet) */}
      {currentUser && (
        <NewsTicker layoutMode="mobile-bar" />
      )}
    </header>
  );
}
