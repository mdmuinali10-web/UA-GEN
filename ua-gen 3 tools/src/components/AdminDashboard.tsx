import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut as authSignOut } from 'firebase/auth';
import { db, firebaseConfig } from '../lib/firebase';
import { AppUser } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle, 
  Loader2, 
  Calendar,
  Mail,
  ShieldAlert,
  Search,
  ShieldCheck,
  UserCheck2,
  UserPlus,
  Plus,
  Lock,
  User,
  Megaphone,
  Save
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: { uid: string; name: string; email: string; role: string } | null;
  onBackToApp?: () => void;
  showToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

type AdminTab = 'pending' | 'approved' | 'rejected';

export default function AdminDashboard({ currentUser, onBackToApp, showToast }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('pending');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<AppUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Sub-Admin creation state
  const [showAddSubAdminModal, setShowAddSubAdminModal] = useState(false);
  const [newSubAdminName, setNewSubAdminName] = useState('');
  const [newSubAdminEmail, setNewSubAdminEmail] = useState('');
  const [newSubAdminPassword, setNewSubAdminPassword] = useState('');
  const [isCreatingSubAdmin, setIsCreatingSubAdmin] = useState(false);

  // News Ticker states
  const [tickerText, setTickerText] = useState('');
  const [tickerEnabled, setTickerEnabled] = useState(false);
  const [isSavingTicker, setIsSavingTicker] = useState(false);

  // Load current ticker settings from Firestore on mount
  useEffect(() => {
    const tickerRef = doc(db, 'settings', 'ticker');
    const unsubscribe = onSnapshot(tickerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTickerText(data.text || '');
        setTickerEnabled(!!data.enabled);
      }
    }, (error) => {
      console.error('Error fetching ticker in admin:', error);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSavingTicker(true);
    try {
      const tickerRef = doc(db, 'settings', 'ticker');
      await setDoc(tickerRef, {
        text: tickerText.trim(),
        enabled: tickerEnabled,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid
      });
      showToast('News Ticker updated successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving ticker:', error);
      showToast('Failed to save News Ticker!', 'error');
    } finally {
      setIsSavingTicker(false);
    }
  };

  // Load all users from Firestore
  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList: AppUser[] = [];
      snapshot.forEach((doc) => {
        usersList.push(doc.data() as AppUser);
      });
      // Sort by creation date (newest first)
      usersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUsers(usersList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      showToast("Failed to load user list!", "error");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (userUid: string, userName: string) => {
    try {
      const userRef = doc(db, 'users', userUid);
      await updateDoc(userRef, { status: 'approved' });
      showToast(`${userName}'s account has been successfully approved!`, 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to approve account!', 'error');
    }
  };

  const handleReject = async (userUid: string, userName: string) => {
    try {
      const userRef = doc(db, 'users', userUid);
      await updateDoc(userRef, { status: 'rejected' });
      showToast(`${userName}'s account request has been rejected!`, 'info');
    } catch (error) {
      console.error(error);
      showToast('Failed to reject account request!', 'error');
    }
  };

  const handleUpdateRole = async (userUid: string, newRole: 'user' | 'sub-admin', userName: string) => {
    try {
      const userRef = doc(db, 'users', userUid);
      await updateDoc(userRef, { role: newRole });
      showToast(`${userName}'s role has been successfully changed to ${newRole === 'sub-admin' ? 'Sub-Admin' : 'User'}!`, 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to update user role!', 'error');
    }
  };

  const handleDeleteClick = (user: AppUser) => {
    setConfirmDeleteUser(user);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteUser) return;
    setIsDeleting(true);
    try {
      const userRef = doc(db, 'users', confirmDeleteUser.uid);
      await deleteDoc(userRef);
      showToast(`${confirmDeleteUser.name}'s account has been successfully deleted!`, 'success');
      setConfirmDeleteUser(null);
    } catch (error) {
      console.error(error);
      showToast('Failed to delete user!', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubAdminName.trim() || !newSubAdminEmail.trim() || !newSubAdminPassword) {
      showToast('All fields are required!', 'error');
      return;
    }
    if (newSubAdminPassword.length < 6) {
      showToast('Password must be at least 6 characters long!', 'error');
      return;
    }
    setIsCreatingSubAdmin(true);
    try {
      // 1. Create a secondary Firebase app instance to register without logging out the Super-Admin
      let secondaryApp;
      const secondaryAppName = 'SubAdminCreatorInstance';
      const existingApps = getApps();
      const appExists = existingApps.find(app => app.name === secondaryAppName);
      if (appExists) {
        secondaryApp = appExists;
      } else {
        secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      }
      
      const secondaryAuth = getAuth(secondaryApp);
      const formattedEmail = newSubAdminEmail.trim().toLowerCase();
      
      // 2. Register user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formattedEmail, newSubAdminPassword);
      const user = userCredential.user;
      
      // 3. Immediately sign them out of the secondary auth instance
      await authSignOut(secondaryAuth);
      
      // 4. Create approved sub-admin profile in Firestore
      const newUserData = {
        uid: user.uid,
        name: newSubAdminName.trim(),
        email: formattedEmail,
        status: 'approved',
        role: 'sub-admin',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), newUserData);
      
      showToast(`Sub-Admin account for ${newSubAdminName.trim()} created successfully!`, 'success');
      
      // Reset form states and close modal
      setNewSubAdminName('');
      setNewSubAdminEmail('');
      setNewSubAdminPassword('');
      setShowAddSubAdminModal(false);
    } catch (error: any) {
      console.error('Error creating sub-admin:', error);
      let errMsg = 'Failed to create Sub-Admin!';
      if (error.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already registered!';
      } else if (error.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address!';
      } else if (error.code === 'auth/weak-password') {
        errMsg = 'Password is too weak!';
      }
      showToast(errMsg, 'error');
    } finally {
      setIsCreatingSubAdmin(false);
    }
  };

  // Filter users based on active tab and search query
  const filteredUsers = users.filter((user) => {
    const matchesTab = user.status === activeTab;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-[#22d3ee] shadow-[0_0_15px_rgba(34,211,238,0.2)]" />
            Admin Dashboard
          </h2>
          <p className="text-xs text-[#c2c6d6]/60 mt-1">
            Manage user registration requests, approve, reject, delete accounts, and assign roles.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setShowAddSubAdminModal(true)}
              className="px-4 py-2 rounded-xl bg-[#22d3ee]/10 hover:bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/25 transition-all text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Add Sub-Admin
            </button>
          )}
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="px-4 py-2 rounded-xl bg-white/5 text-[#22d3ee] border border-[#22d3ee]/20 hover:bg-[#22d3ee]/10 transition-colors text-xs font-bold font-mono uppercase tracking-wider"
            >
              Back to App
            </button>
          )}
        </div>
      </div>

      {/* News Ticker / Announcement Configuration Card */}
      <div className="bg-[#11192e]/80 border border-white/10 p-5 rounded-2xl mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <Megaphone className="w-5 h-5 text-[#22d3ee]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide">
                Global News Ticker / Announcements
              </h3>
              <p className="text-[11px] text-[#c2c6d6]/60 mt-0.5">
                Broadcast scrolling alerts and marquee messages instantly across all user workspaces in real-time. Supports emojis, Bengali, and English.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl self-start md:self-auto">
            <span className="text-xs font-semibold text-white/80">Status:</span>
            <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded ${tickerEnabled ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
              {tickerEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              type="button"
              onClick={() => setTickerEnabled(!tickerEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${tickerEnabled ? 'bg-[#22d3ee]' : 'bg-white/10'}`}
              title={tickerEnabled ? "Disable News Ticker" : "Enable News Ticker"}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#0b1326] shadow ring-0 transition duration-200 ease-in-out ${tickerEnabled ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveTicker} className="space-y-4">
          <div>
            <textarea
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
              placeholder="Type your announcement marquee text here... e.g. 📢 PixelConvert is now fully rebranded as ImageConvert! New compression formats added. 🚀 ❤️"
              rows={2}
              maxLength={1000}
              className="w-full p-3 bg-[#0b1326]/50 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] transition-all resize-y font-medium leading-relaxed"
            />
            <div className="flex justify-between items-center mt-1.5 text-[10px] text-[#c2c6d6]/40 font-mono">
              <span>Characters: {tickerText.length} / 1000</span>
              <span>Bengal / English & Emojis are supported</span>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-white/5">
            <button
              type="submit"
              disabled={isSavingTicker}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] text-white hover:opacity-95 transition-all text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-[0_2px_8px_rgba(34,211,238,0.2)] disabled:opacity-50"
            >
              {isSavingTicker ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving config...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Announcement
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11192e]/80 border border-white/10 p-4 rounded-2xl mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-2 md:flex gap-2 p-1 bg-white/5 rounded-xl self-start w-full md:w-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center justify-center md:justify-start gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all shrink-0 col-span-1 ${
              activeTab === 'pending'
                ? 'bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/30'
                : 'text-[#c2c6d6]/60 hover:text-white border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="truncate">Pending ({users.filter(u => u.status === 'pending').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex items-center justify-center md:justify-start gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all shrink-0 col-span-1 ${
              activeTab === 'approved'
                ? 'bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/30'
                : 'text-[#c2c6d6]/60 hover:text-white border border-transparent'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span className="truncate">Approved ({users.filter(u => u.status === 'approved').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex items-center justify-center md:justify-start gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all shrink-0 col-span-2 md:col-span-1 ${
              activeTab === 'rejected'
                ? 'bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/30'
                : 'text-[#c2c6d6]/60 hover:text-white border border-transparent'
            }`}
          >
            <UserX className="w-4 h-4" />
            <span className="truncate">Rejected ({users.filter(u => u.status === 'rejected').length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#c2c6d6]/40 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search user name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] transition-all"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#11192e]/40 border border-white/5 rounded-2xl">
          <Loader2 className="w-10 h-10 text-[#22d3ee] animate-spin mb-4" />
          <p className="text-xs text-[#c2c6d6]/60 font-mono">Loading user data...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#11192e]/40 border border-white/5 rounded-2xl text-center px-4">
          <Users className="w-12 h-12 text-[#c2c6d6]/20 mb-3" />
          <p className="text-sm font-semibold text-[#c2c6d6]/60">No users found!</p>
          <p className="text-xs text-[#c2c6d6]/40 mt-1 font-sans">Search with a valid name/email, or check another tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.uid}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#11192e]/80 border border-white/10 hover:border-[#22d3ee]/20 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-white tracking-wide">{user.name}</h3>
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full border font-mono tracking-wider font-semibold uppercase ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]' 
                        : user.role === 'sub-admin'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                        : 'bg-white/5 text-[#c2c6d6]/60 border-white/5'
                    }`}>
                      {user.role === 'sub-admin' ? 'Sub-Admin' : user.role}
                    </span>
                  </div>
                  
                  <div className="mt-3.5 space-y-1.5 text-xs text-[#c2c6d6]/80 font-mono">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#22d3ee]/60" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#22d3ee]/60" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-2 pt-3.5 border-t border-white/5">
                  {activeTab === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReject(user.uid, user.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-[11px] font-bold"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(user.uid, user.name)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] text-white shadow-[0_2px_8px_rgba(34,211,238,0.2)] hover:opacity-95 transition-all text-[11px] font-bold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    </>
                  )}

                  {activeTab === 'approved' && (
                    <div className="flex items-center gap-2 w-full justify-between sm:justify-end">
                      {/* Sub-Admin promotion/demotion tool - only visible for Super-Admin */}
                      {currentUser?.role === 'admin' && user.role !== 'admin' && (
                        <div className="flex items-center">
                          {user.role === 'sub-admin' ? (
                            <button
                              onClick={() => handleUpdateRole(user.uid, 'user', user.name)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-[10px] font-bold"
                              title="Demote to standard user"
                            >
                              <X className="w-3 h-3" />
                              Demote User
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateRole(user.uid, 'sub-admin', user.name)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 hover:bg-[#22d3ee]/20 transition-all text-[10px] font-bold"
                              title="Promote to Sub-Admin"
                            >
                              <UserCheck2 className="w-3 h-3" />
                              Make Sub-Admin
                            </button>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-red-400 border border-red-500/10 hover:bg-red-500/15 hover:border-red-500/20 transition-all text-[11px] font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}

                  {activeTab === 'rejected' && (
                    <>
                      <button
                        onClick={() => handleApprove(user.uid, user.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 hover:bg-[#22d3ee]/20 transition-all text-[11px] font-bold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Re-Approve
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-red-400 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-[11px] font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Permanently
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#11192e] border border-white/10 max-w-sm w-full rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-center"
            >
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Confirm Account Deletion</h3>
              <p className="text-xs text-[#c2c6d6]/80 leading-relaxed mb-6">
                Are you sure you want to permanently delete the account of <strong className="text-white">{confirmDeleteUser.name}</strong>? This action is irreversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteUser(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-[#dae2fd] hover:bg-white/10 transition-colors text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Sub-Admin Modal */}
      <AnimatePresence>
        {showAddSubAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#11192e] border border-white/10 max-w-md w-full rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#22d3ee]" />
                  Add New Sub-Admin
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSubAdminModal(false);
                    setNewSubAdminName('');
                    setNewSubAdminEmail('');
                    setNewSubAdminPassword('');
                  }}
                  className="p-1 rounded-lg text-[#c2c6d6]/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#c2c6d6]/80 tracking-wider uppercase mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#c2c6d6]/40 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={newSubAdminName}
                      onChange={(e) => setNewSubAdminName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#0b1326]/50 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#c2c6d6]/80 tracking-wider uppercase mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#c2c6d6]/40 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="sub-admin@domain.com"
                      value={newSubAdminEmail}
                      onChange={(e) => setNewSubAdminEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#0b1326]/50 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#c2c6d6]/80 tracking-wider uppercase mb-1.5">
                    Account Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#c2c6d6]/40 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={newSubAdminPassword}
                      onChange={(e) => setNewSubAdminPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#0b1326]/50 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#22d3ee] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-3">
                  <button
                    type="button"
                    disabled={isCreatingSubAdmin}
                    onClick={() => {
                      setShowAddSubAdminModal(false);
                      setNewSubAdminName('');
                      setNewSubAdminEmail('');
                      setNewSubAdminPassword('');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#dae2fd] hover:bg-white/10 transition-colors text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingSubAdmin}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] text-white hover:opacity-95 transition-all text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(34,211,238,0.2)] disabled:opacity-50"
                  >
                    {isCreatingSubAdmin ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Add Sub-Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
