/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UserAgentItem, EngineSettings, ToastState } from './types';
import { getInitialSettings, generateUserAgentsBulk } from './utils/generator';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';

// Firebase & Auth imports
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { Loader2 } from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ToolsPage from './pages/ToolsPage';
import UAGeneratorPage from './pages/UAGeneratorPage';
import PhotoResizePage from './pages/PhotoResizePage';
import AdminPage from './pages/AdminPage';

// Seed realistic default results matching the user's design screenshots
const SEED_TIMESTAMP = 1719878400000; // standard constant date
const INITIAL_SEEDED_RESULTS: UserAgentItem[] = [
  {
    id: 'seed-1',
    browser: 'chrome',
    browserVersion: 'Chrome 122.0',
    os: 'macos',
    osVersion: 'macOS Sonoma',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    timestamp: SEED_TIMESTAMP,
    starred: false,
  },
  {
    id: 'seed-2',
    browser: 'safari',
    browserVersion: 'Safari 17.4',
    os: 'ios',
    osVersion: 'iOS 17.4',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    device: 'iPhone15,2',
    timestamp: SEED_TIMESTAMP - 60000,
    starred: false,
  },
  {
    id: 'seed-3',
    browser: 'firefox',
    browserVersion: 'Firefox 123.0',
    os: 'windows',
    osVersion: 'Windows 11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
    timestamp: SEED_TIMESTAMP - 120000,
    starred: false,
  },
  {
    id: 'seed-4',
    browser: 'edge',
    browserVersion: 'Edge 121.0',
    os: 'linux',
    osVersion: 'Linux x86_64',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
    timestamp: SEED_TIMESTAMP - 180000,
    starred: false,
  },
];

import OfferDirectoryPage from './pages/OfferDirectoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ uid: string; name: string; email: string; role: string; status: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Core Data state
  const [results, setResults] = useState<UserAgentItem[]>(() => {
    try {
      const stored = localStorage.getItem('uagen_results');
      return stored ? JSON.parse(stored) : INITIAL_SEEDED_RESULTS;
    } catch {
      return INITIAL_SEEDED_RESULTS;
    }
  });

  const [settings, setSettings] = useState<EngineSettings>(() => {
    try {
      const stored = localStorage.getItem('uagen_settings');
      return stored ? JSON.parse(stored) : getInitialSettings();
    } catch {
      return getInitialSettings();
    }
  });

  // UI Toasts state
  const [toast, setToast] = useState<ToastState>({
    message: '',
    visible: false,
    type: 'success',
  });

  // Listen for Authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.status === 'approved') {
              setCurrentUser({
                uid: firebaseUser.uid,
                name: userData.name || 'User',
                email: firebaseUser.email || '',
                role: userData.role || 'user',
                status: userData.status
              });
            } else {
              // Account is pending or rejected
              setCurrentUser(null);
              // Only sign out if we're not just created to avoid race with Auth.tsx
              const creationTime = firebaseUser.metadata.creationTime;
              const isNewUser = creationTime ? (Date.now() - new Date(creationTime).getTime() < 15000) : false;
              if (!isNewUser) {
                await signOut(auth);
              }
            }
          } else {
            // Profile doc doesn't exist yet
            setCurrentUser(null);
            const creationTime = firebaseUser.metadata.creationTime;
            const isNewUser = creationTime ? (Date.now() - new Date(creationTime).getTime() < 30000) : false;
            
            if (!isNewUser) {
              await signOut(auth);
            }
          }
        } catch (error) {
          console.error("Auth check error:", error);
          await signOut(auth);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('uagen_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('uagen_settings', JSON.stringify(settings));
  }, [settings]);

  // Helpers
  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, visible: true, type });
  };

  const handleGenerate = (
    browser: any,
    os: any,
    device: string,
    density: number,
    randomize: boolean,
    browserVersionOverride?: string,
    osVersionOverride?: string,
    deviceModelOverride?: string,
    socialMedia?: string
  ) => {
    const newItems = generateUserAgentsBulk(
      browser,
      os,
      device,
      density,
      randomize,
      settings,
      browserVersionOverride,
      osVersionOverride,
      deviceModelOverride,
      socialMedia
    );
    // Replace old results with new results
    setResults(newItems);
    showToast(`Generated ${newItems.length} browser identities successfully!`, 'success');
  };

  const handleClearResults = () => {
    setResults([]);
    showToast('Session results completely purged', 'info');
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans antialiased overflow-x-hidden flex flex-col">
      {/* Dynamic Ambient Blur Backgrounds */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#adc6ff] filter blur-[100px] opacity-10 pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#571bc1] filter blur-[100px] opacity-10 pointer-events-none z-0"></div>

      {/* Header */}
      <Header 
        currentUser={currentUser}
        onLogout={async () => {
          await signOut(auth);
          setCurrentUser(null);
          showToast("Logged out successfully!", "info");
          navigate('/login');
        }}
      />

      {/* Main Container */}
      <main className={`relative z-10 pt-28 lg:pt-24 flex-grow flex flex-col w-full ${location.pathname === '/' ? '' : 'px-4 md:px-8 max-w-7xl mx-auto pb-4'}`}>
        {!authChecked ? (
          <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-[#22d3ee] animate-spin mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]" />
            <p className="text-xs text-[#c2c6d6]/60 font-mono tracking-widest uppercase">Initializing Secure Session...</p>
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-between">
            <div className="flex-grow flex flex-col">
              <Routes>
                {/* Default root path handling */}
                <Route 
                  path="/" 
                  element={
                    currentUser ? (
                      <Navigate to="/tools" replace />
                    ) : (
                      <HomePage />
                    )
                  } 
                />
                
                {/* Login Page Route */}
                <Route 
                  path="/login" 
                  element={
                    <LoginPage 
                      currentUser={currentUser} 
                      onAuthSuccess={(user) => setCurrentUser(user)} 
                      showToast={showToast} 
                    />
                  } 
                />

                {/* Dashboard / Tools Page Route */}
                <Route 
                  path="/tools" 
                  element={<ToolsPage currentUser={currentUser} />} 
                />

                {/* UA Generator Route */}
                <Route 
                  path="/tools/ua-generator" 
                  element={
                    <UAGeneratorPage 
                      currentUser={currentUser}
                      onGenerate={handleGenerate}
                      settings={settings}
                      onUpdateSettings={setSettings}
                      onShowToast={showToast}
                      results={results}
                      onClearResults={handleClearResults}
                    />
                  } 
                />

                {/* Photo Resize Route */}
                <Route 
                  path="/tools/photo-resize" 
                  element={
                    <PhotoResizePage 
                      currentUser={currentUser}
                      onShowToast={showToast}
                    />
                  } 
                />

                {/* Offer Directory Route */}
                <Route 
                  path="/tools/offer-directory" 
                  element={
                    <OfferDirectoryPage 
                      currentUser={currentUser}
                      onShowToast={showToast}
                    />
                  } 
                />

                {/* Admin Page Route */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminPage 
                      currentUser={currentUser}
                      showToast={showToast}
                    />
                  } 
                />

                {/* Fallback Catch All redirect */}
                <Route 
                  path="*" 
                  element={
                    currentUser ? (
                      <Navigate to="/tools" replace />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
              </Routes>
            </div>

            {/* Consistent Footer (not on login page and not on home page) */}
            {!isLoginPage && location.pathname !== '/' && (
              <footer className="mt-20 md:mt-40 py-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest">
                <div className="text-slate-500">
                  &copy; {new Date().getFullYear()} UA GEN. All rights reserved.
                </div>
                <div className="flex items-center gap-4">
                  {!currentUser && (
                    <div className="flex items-center gap-4 mr-4">
                      <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-[#22d3ee] transition-colors">Login</button>
                      <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-[#a78bfa] transition-colors">Sign Up</button>
                    </div>
                  )}
                  <span className="text-slate-500">Made by <a href="https://t.me/M_MuiN" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] font-bold hover:text-[#4cd7f6] transition-colors cursor-pointer">@M_MuiN</a></span>
                </div>
              </footer>
            )}
          </div>
        )}
      </main>

      {/* Settings Panel slide-over */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Animated Action Toasts */}
      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </div>
  );
}
