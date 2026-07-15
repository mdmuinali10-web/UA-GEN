import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Mail, Lock, User, ShieldCheck, AlertCircle, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  showToast: (message: string, type: 'success' | 'info' | 'error') => void;
  initialTab?: 'login' | 'register';
}

export default function Auth({ onAuthSuccess, showToast, initialTab = 'login' }: AuthProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration Pending Notification
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Optional: force account selection
      provider.setCustomParameters({ prompt: 'select_account' });
      
      // Setup a conditional timeout to prevent infinite hanging only inside constrained iframes
      const isInIframe = window.self !== window.top;
      const userCredential = await (isInIframe 
        ? Promise.race([
            signInWithPopup(auth, provider),
            new Promise<never>((_, reject) => {
              setTimeout(() => {
                reject({ code: 'auth/popup-blocked', message: 'Popup timed out.' });
              }, 30000); // 30 seconds for iframe environment
            })
          ])
        : signInWithPopup(auth, provider)
      );
      const user = userCredential.user;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.status === 'pending') {
          await signOut(auth);
          setPendingMessage('Your account is not approved yet. Please wait for an administrator to approve your request.');
          showToast('Your account is still pending approval!', 'info');
          setIsLoading(false);
          return;
        }
        if (userData.status === 'rejected') {
          await signOut(auth);
          showToast('Your account registration request has been rejected!', 'error');
          setIsLoading(false);
          return;
        }
        
        // Approved existing user
        showToast('Logged in successfully with Google!', 'success');
        onAuthSuccess({ ...user, ...userData });
      } else {
        // New user registering via Google Sign-In
        const formattedEmail = user.email ? user.email.trim().toLowerCase() : '';
        const isAdmin = formattedEmail === 'mdmuinali2006@gmail.com';
        const initialStatus = isAdmin ? 'approved' : 'pending';
        const initialRole = isAdmin ? 'admin' : 'user';

        const userData = {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: formattedEmail,
          status: initialStatus,
          role: initialRole,
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', user.uid), userData);

        if (isAdmin) {
          showToast('Admin account created and logged in with Google successfully!', 'success');
          onAuthSuccess({ ...user, ...userData });
        } else {
          setPendingMessage('Your account has been registered via Google. Please wait for an administrator to approve your registration request.');
          showToast('Google registration successful! Waiting for admin approval.', 'success');
          await signOut(auth);
        }
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      let errMsg = 'Google Sign-In failed!';
      if (error.code === 'auth/popup-closed-by-user') {
        errMsg = 'Google sign-in popup was closed before completion.';
      } else if (error.code === 'auth/network-request-failed') {
        errMsg = 'Network request failed. Check your internet connection!';
      } else if (error.code === 'auth/popup-blocked') {
        errMsg = 'লগইন পপআপ ব্লক বা হ্যাং হয়েছে! অনুগ্রহ করে New Tab-এ ওপেন করুন অথবা Guest Mode ট্রাই করুন!';
      } else if (error.code === 'permission-denied' || (error.message && error.message.includes('insufficient permissions'))) {
        errMsg = 'Security Error: Firestore profile creation denied. Please contact admin.';
      }
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields!', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Fetch user role & status from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await signOut(auth);
        showToast('Your account was not found!', 'error');
        setIsLoading(false);
        return;
      }

      const userData = userDocSnap.data();
      
      // Check account status
      if (userData.status === 'pending') {
        await signOut(auth);
        setPendingMessage('Your account is not approved yet. Please wait for an administrator to approve your request.');
        showToast('Your account is still pending approval!', 'info');
        setIsLoading(false);
        return;
      }

      if (userData.status === 'rejected') {
        await signOut(auth);
        showToast('Your account registration request has been rejected!', 'error');
        setIsLoading(false);
        return;
      }

      // Success (approved)
      showToast('Logged in successfully!', 'success');
      onAuthSuccess({ ...user, ...userData });
    } catch (error: any) {
      console.error(error);
      let errMsg = 'Login failed! Incorrect email or password.';
      if (error.code === 'auth/user-not-found') {
        errMsg = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errMsg = 'Incorrect password! Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address!';
      }
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields!', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const formattedEmail = email.trim().toLowerCase();
      // Auto-assign admin if email matches
      const isAdmin = formattedEmail === 'mdmuinali2006@gmail.com';
      const initialStatus = isAdmin ? 'approved' : 'pending';
      const initialRole = isAdmin ? 'admin' : 'user';

      const userCredential = await createUserWithEmailAndPassword(auth, formattedEmail, password);
      const user = userCredential.user;

      // Save user to Firestore
      const userData = {
        uid: user.uid,
        name: name.trim(),
        email: formattedEmail,
        status: initialStatus,
        role: initialRole,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      if (isAdmin) {
        showToast('Admin account created and logged in successfully!', 'success');
        onAuthSuccess({ ...user, ...userData });
      } else {
        showToast('Registration successful! Waiting for admin approval.', 'success');
        setPendingMessage('Your account has been created successfully. Please wait for an administrator to approve your registration request.');
        
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Switch to login tab after success
        setTab('login');
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      let errMsg = 'Registration failed! Please try again.';
      
      // Handle Firebase Auth errors
      if (error.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already in use! Try logging in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format!';
      } else if (error.code === 'auth/weak-password') {
        errMsg = 'Password is too weak! Must be at least 6 characters.';
      } 
      // Handle Firestore Permission errors (Security Rules failure)
      else if (error.code === 'permission-denied' || (error.message && error.message.includes('insufficient permissions'))) {
        errMsg = 'Security Error: You do not have permission to create this account. Please contact @M_MuiN on Telegram.';
      }
      
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#11192e]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 md:p-8"
      >
        {pendingMessage ? (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <ShieldCheck className="w-8 h-8 text-[#22d3ee]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Awaiting Approval</h3>
            <p className="text-sm text-[#c2c6d6] leading-relaxed mb-6">
              {pendingMessage}
            </p>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6 text-xs text-left">
              <p className="text-[#acedff] font-semibold mb-2">To request account approval, contact:</p>
              <div className="flex flex-col gap-2 font-mono">
                <a 
                  href="https://t.me/M_MuiN" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-[#22d3ee]/10 text-[#dae2fd] border border-white/5 hover:border-[#22d3ee]/20 transition-colors"
                >
                  <span>Telegram: @M_MuiN</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <button 
              onClick={() => {
                setPendingMessage(null);
                setTab('login');
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 text-[#dae2fd] border border-white/10 hover:bg-white/10 transition-colors font-semibold text-sm"
            >
              Go to Login Page
            </button>
          </div>
        ) : (
          <>
            {/* Header Tabs */}
            <div className="flex border-b border-white/5 mb-6">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 pb-3 text-center font-bold text-sm transition-colors border-b-2 ${
                  tab === 'login' 
                    ? 'border-[#22d3ee] text-[#22d3ee]' 
                    : 'border-transparent text-[#c2c6d6]/60 hover:text-[#c2c6d6]'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 pb-3 text-center font-bold text-sm transition-colors border-b-2 ${
                  tab === 'register' 
                    ? 'border-[#22d3ee] text-[#22d3ee]' 
                    : 'border-transparent text-[#c2c6d6]/60 hover:text-[#c2c6d6]'
                }`}
              >
                Register
              </button>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#c2c6d6]/80 font-medium">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c2c6d6]/40 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#c2c6d6]/80 font-medium">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c2c6d6]/40 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white font-bold text-sm shadow-[0_4px_15px_rgba(34,211,238,0.2)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#c2c6d6]/80 font-medium">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c2c6d6]/40 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#c2c6d6]/80 font-medium">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c2c6d6]/40 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#c2c6d6]/80 font-medium">Password (At least 6 characters)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c2c6d6]/40 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#c2c6d6]/80 font-medium">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c2c6d6]/40 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white font-bold text-sm shadow-[0_4px_15px_rgba(34,211,238,0.2)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Register'
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#11192e] px-3 text-[#c2c6d6]/40 font-mono">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1a233a] border border-white/10 text-white font-medium text-sm hover:bg-[#202c49] hover:border-[#22d3ee]/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <svg className="w-4 h-4 animate-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
