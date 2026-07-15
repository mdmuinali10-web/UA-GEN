import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Upload, X, FileCode2, Image as ImageIcon, ExternalLink, Trash2, Edit } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import localforage from 'localforage';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface OfferLandingPage {
  id: string;
  title: string;
  thumbnail: string; // base64 string
  code: string;      // HTML string
  category: string;
  createdAt: number;
}

const CATEGORIES = ['All', 'Gift Card', 'Loan', 'Finance', 'Dating', 'Job', 'Entertainment', 'Gaming'];

interface OfferDirectoryProps {
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
  onBack?: () => void;
  currentUser?: { uid: string; name: string; email: string; role: string } | null;
}

export default function OfferDirectory({ onShowToast, onBack, currentUser }: OfferDirectoryProps) {
  const [offers, setOffers] = useState<OfferLandingPage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Per-user overrides state
  const [overrides, setOverrides] = useState<Record<string, { customTitle?: string; customCtaLink?: string }>>({});
  const [editingOffer, setEditingOffer] = useState<OfferLandingPage | null>(null);
  
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'sub-admin';
  
  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await localforage.getItem<OfferLandingPage[]>('offer_directory_pages');
        if (data) {
          setOffers(data);
        }
      } catch (err) {
        console.error('Failed to load offers:', err);
      }
    };
    loadData();
  }, []);

  // Load user overrides from Firestore
  useEffect(() => {
    if (!currentUser?.uid) {
      setOverrides({});
      return;
    }
    const q = query(collection(db, 'user_offers'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOverrides: Record<string, { customTitle?: string; customCtaLink?: string }> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        newOverrides[data.offerId] = {
          customTitle: data.customTitle || undefined,
          customCtaLink: data.customCtaLink || undefined,
        };
      });
      setOverrides(newOverrides);
    }, (err) => {
      console.error('Error loading overrides:', err);
    });
    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Save data whenever it changes
  useEffect(() => {
    localforage.setItem('offer_directory_pages', offers).catch(err => {
      console.error('Failed to save offers:', err);
    });
  }, [offers]);

  const filteredOffers = offers.filter(offer => {
    const displayTitle = overrides[offer.id]?.customTitle || offer.title;
    const matchesSearch = displayTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || offer.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) {
      onShowToast('Only admin can delete landing pages!', 'error');
      return;
    }
    setDeletingId(id);
  };

  const handleOpenPage = (offer: OfferLandingPage) => {
    try {
      let htmlContent = offer.code;
      const override = currentUser?.uid ? overrides[offer.id] : null;
      
      try {
        const parser = new DOMParser();
        const docObj = parser.parseFromString(htmlContent, 'text/html');
        
        // 1. Inject the gorgeous floating Back Button
        const backButtonContainer = docObj.createElement('div');
        backButtonContainer.id = 'lp-back-button-container';
        backButtonContainer.setAttribute('style', "position: fixed; top: 16px; left: 16px; z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; pointer-events: auto;");
        backButtonContainer.innerHTML = `
          <button id="lp-back-button-elem" onclick="if(window.opener){window.close();}else{window.location.href=window.location.origin+'/tools';}" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: rgba(11, 19, 38, 0.9); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 9999px; color: #ffffff; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.4); transition: all 0.2s ease; outline: none; margin: 0; box-sizing: border-box; padding: 0;" onmouseover="this.style.background='rgba(23, 31, 51, 0.95)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='rgba(11, 19, 38, 0.9)'; this.style.transform='translateY(0)'">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
        `;
        docObj.body.appendChild(backButtonContainer);

        // 2. Adjust link targets to open in the same tab (always)
        const allAnchors = Array.from(docObj.querySelectorAll('a'));
        allAnchors.forEach(a => {
          const href = a.getAttribute('href');
          // If override CTA exists, replace the URL
          if (override?.customCtaLink && href && !href.startsWith('#')) {
            a.setAttribute('href', override.customCtaLink);
          }
          // Force same tab
          a.setAttribute('target', '_self');
        });

        // 3. Statically replace onClick handlers of buttons and other common clickable targets (excluding our back button)
        const allButtons = Array.from(docObj.querySelectorAll('button:not(#lp-back-button-elem), [role="button"]:not(#lp-back-button-elem), .btn, .button, .cta, [id*="cta" i], [class*="cta" i]'));
        allButtons.forEach(btn => {
          if (override?.customCtaLink) {
            if (btn.tagName === 'A') {
              btn.setAttribute('href', override.customCtaLink);
            } else {
              btn.setAttribute('onclick', `window.location.href='${override.customCtaLink}'`);
            }
          }
          // Ensure buttons that might have target="_blank" attributes are cleaned
          btn.setAttribute('target', '_self');
        });

        // 4. Inject fail-safe script to force everything to open in the same tab and intercept other redirects
        const scriptEl = docObj.createElement('script');
        scriptEl.textContent = `
          (function() {
            const overrideUrl = ${override?.customCtaLink ? JSON.stringify(override.customCtaLink) : 'null'};
            
            function doRedirect(e) {
              if (e.currentTarget.id === 'lp-back-button-elem') return;
              const url = overrideUrl || e.currentTarget.getAttribute('href') || e.currentTarget.getAttribute('data-href');
              if (url && !url.startsWith('#')) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = url;
              }
            }

            function init() {
              // Intercept all anchor clicks to open in the same tab
              document.querySelectorAll('a').forEach(a => {
                if (a.id === 'lp-back-button-elem') return;
                const href = a.getAttribute('href');
                if (overrideUrl && href && !href.startsWith('#')) {
                  a.href = overrideUrl;
                }
                // Force target _self
                a.setAttribute('target', '_self');
                a.target = '_self';
                
                a.addEventListener('click', function(e) {
                  const currentHref = this.getAttribute('href');
                  if (currentHref && !currentHref.startsWith('#')) {
                    if (overrideUrl) {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = overrideUrl;
                    }
                  }
                });
              });

              // Intercept clicks on all button-like elements to redirect in same window (except back button)
              document.querySelectorAll('button:not(#lp-back-button-elem), [role="button"]:not(#lp-back-button-elem), input[type="button"], input[type="submit"], .btn, .button, .cta, [class*="btn"], [class*="button"], [class*="cta"]').forEach(btn => {
                if (btn.id === 'lp-back-button-elem') return;
                btn.removeAttribute('target');
                btn.setAttribute('target', '_self');
                if (overrideUrl) {
                  btn.removeAttribute('onclick');
                  btn.addEventListener('click', doRedirect);
                }
              });

              // Intercept any direct form submits as well
              document.querySelectorAll('form').forEach(form => {
                if (overrideUrl) {
                  form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    window.location.href = overrideUrl;
                  });
                } else {
                  form.setAttribute('target', '_self');
                }
              });
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', init);
            } else {
              init();
            }
          })();
        `;
        docObj.body.appendChild(scriptEl);
        
        htmlContent = docObj.documentElement.outerHTML;
      } catch (parseError) {
        console.error("Error formatting landing page HTML:", parseError);
      }
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      console.error('Error opening page:', e);
      onShowToast('Failed to open landing page', 'error');
    }
  };

  const handleSaveOverride = async (customTitle: string, customCtaLink: string) => {
    if (!currentUser?.uid) {
      onShowToast('You must be logged in to save overrides', 'error');
      return;
    }
    if (!editingOffer) return;

    const docId = `${currentUser.uid}_${editingOffer.id}`;
    const docRef = doc(db, 'user_offers', docId);

    try {
      await setDoc(docRef, {
        userId: currentUser.uid,
        offerId: editingOffer.id,
        customTitle: customTitle.trim() || null,
        customCtaLink: customCtaLink.trim() || null,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Optimistically update overrides state
      setOverrides(prev => ({
        ...prev,
        [editingOffer.id]: {
          customTitle: customTitle.trim() || undefined,
          customCtaLink: customCtaLink.trim() || undefined
        }
      }));

      onShowToast('Landing page overrides saved successfully!', 'success');
      setEditingOffer(null);
    } catch (err: any) {
      console.error("Error saving override:", err);
      onShowToast(`Failed to save override: ${err.message || err}`, 'error');
    }
  };

  return (
    <div className="flex flex-col bg-[#0b1326]/50 rounded-2xl border border-white/5 shadow-2xl relative mb-10">
      {/* Header */}
      <div className="shrink-0 p-6 sm:p-8 border-b border-white/5 bg-[#0b1326]/80 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center relative z-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-[#131b2e] hover:bg-white/5 border border-white/10 text-[#c2c6d6] hover:text-white transition-all shadow-sm flex items-center justify-center shrink-0"
              title="Back to Tools"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              <span className="bg-gradient-to-r from-[#f59e0b] to-[#ec4899] bg-clip-text text-transparent">Directory</span> Offers
            </h1>
            <p className="text-sm text-[#c2c6d6]/60 mt-1">
              Store, categorize, and preview your CPA/affiliate landing pages securely in your browser.
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ec4899] hover:from-[#d97706] hover:to-[#db2777] text-white font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add Landing Page</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="shrink-0 p-4 sm:p-6 border-b border-white/5 bg-[#131b2e]/60 flex flex-col gap-4 relative z-10">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c2c6d6]/50" />
          <input
            type="text"
            placeholder="Search offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1326] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#c2c6d6]/40 focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                  : 'bg-[#0b1326] text-[#c2c6d6]/60 border border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-6 sm:p-8 relative z-10">
        {filteredOffers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-[#c2c6d6]/40">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <FileCode2 className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-bold text-white mb-2">No landing pages found</p>
            <p className="text-sm max-w-xs">
              {searchQuery || selectedCategory !== 'All' 
                ? 'Try adjusting your filters or search query.'
                : 'Click "+ Add Landing Page" to upload or paste your first offer page.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredOffers.map(offer => (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-[#171f33] rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:border-[#f59e0b]/50 hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)] transition-all"
                  onClick={() => handleOpenPage(offer)}
                >
                  {/* Custom Delete Confirmation Overlay */}
                  <AnimatePresence>
                    {deletingId === offer.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#060e20]/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Trash2 className="w-10 h-10 text-red-500 mb-2 animate-bounce" />
                        <h4 className="text-sm font-bold text-white mb-1">Delete page?</h4>
                        <p className="text-xs text-[#c2c6d6]/60 mb-4 max-w-[180px] line-clamp-2">"{offer.title}" will be permanently removed.</p>
                        <div className="flex gap-2 w-full justify-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOffers(prev => prev.filter(o => o.id !== offer.id));
                              onShowToast('Landing page deleted successfully', 'info');
                              setDeletingId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeletingId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#c2c6d6] hover:text-white text-xs font-bold transition-all active:scale-95"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="aspect-[4/3] bg-[#0b1326] relative overflow-hidden">
                    {offer.thumbnail ? (
                      <img src={offer.thumbnail} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                      <ExternalLink className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                    
                    {/* Top Right Action Button Overlay */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                      {currentUser && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingOffer(offer);
                          }}
                          className="p-1.5 rounded-lg bg-blue-500/80 text-white opacity-0 group-hover:opacity-100 hover:bg-blue-600 transition-all shadow-md active:scale-95 flex items-center justify-center"
                          title="Edit Personal Override"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={(e) => handleDelete(offer.id, e)}
                          className="p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-md active:scale-95 flex items-center justify-center"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="absolute top-2 left-2 px-2 py-1 rounded md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md uppercase tracking-widest border border-white/10">
                      {offer.category}
                    </div>
                  </div>
                  <div className="p-4 border-t border-[#171f33]">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-white truncate flex-1" title={overrides[offer.id]?.customTitle || offer.title}>
                        {overrides[offer.id]?.customTitle || offer.title}
                      </h3>
                      {overrides[offer.id] && (
                        <span className="text-[10px] text-[#f59e0b] font-medium bg-[#f59e0b]/10 px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-wider">
                          Customized
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#c2c6d6]/50 mt-1">
                      Added {new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddLandingPageModal 
            onClose={() => setIsModalOpen(false)}
            onSave={(newOffer) => {
              if (!isAdmin) {
                onShowToast('Only admin can add landing pages!', 'error');
                return;
              }
              setOffers(prev => [newOffer, ...prev]);
              onShowToast('Landing page added successfully!', 'success');
              setIsModalOpen(false);
            }}
            onShowToast={onShowToast}
          />
        )}
        {editingOffer && (
          <EditOverrideModal 
            offer={editingOffer}
            initialTitle={overrides[editingOffer.id]?.customTitle || ''}
            initialCtaLink={overrides[editingOffer.id]?.customCtaLink || ''}
            onClose={() => setEditingOffer(null)}
            onSave={handleSaveOverride}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// ADD LANDING PAGE MODAL
// -------------------------------------------------------------
interface AddLandingPageModalProps {
  onClose: () => void;
  onSave: (offer: OfferLandingPage) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

function AddLandingPageModal({ onClose, onSave, onShowToast }: AddLandingPageModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Gift Card');
  const [codeSource, setCodeSource] = useState<'upload' | 'paste'>('upload');
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [thumbnail, setThumbnail] = useState<string>(''); // base64

  // Code dropzone (for .html)
  const onCodeDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCode(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps: getCodeRootProps, getInputProps: getCodeInputProps, isDragActive: isCodeDragActive } = useDropzone({ 
    onDrop: onCodeDrop,
    accept: { 'text/html': ['.html', '.htm'] },
    maxFiles: 1
  } as any);

  // Thumbnail dropzone (for images)
  const onThumbDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setThumbnail(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps: getThumbRootProps, getInputProps: getThumbInputProps, isDragActive: isThumbDragActive } = useDropzone({
    onDrop: onThumbDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1
  } as any);

  const handleSave = () => {
    if (!title.trim()) {
      onShowToast('Please enter a title', 'error');
      return;
    }
    if (!code.trim()) {
      onShowToast('Please provide HTML code (upload or paste)', 'error');
      return;
    }
    
    const newOffer: OfferLandingPage = {
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      thumbnail,
      code,
      category,
      createdAt: Date.now(),
    };
    onSave(newOffer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#060e20]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-[#0b1326] rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#131b2e]/50">
          <h2 className="text-xl font-bold text-white">Add New Landing Page</h2>
          <button onClick={onClose} className="text-[#c2c6d6]/60 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#c2c6d6] uppercase tracking-wider">Title</label>
              <input
                type="text"
                placeholder="e.g. MatchVerse"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#131b2e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#c2c6d6] uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#131b2e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 transition-colors appearance-none"
              >
                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* HTML Code Source */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#c2c6d6] uppercase tracking-wider">Landing Page Source (HTML)</label>
              <div className="flex bg-[#131b2e] p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setCodeSource('upload')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    codeSource === 'upload' ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'text-[#c2c6d6]/60 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setCodeSource('paste')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    codeSource === 'paste' ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'text-[#c2c6d6]/60 hover:text-white'
                  }`}
                >
                  Paste Code
                </button>
              </div>
            </div>

            {codeSource === 'upload' ? (
              <div 
                {...getCodeRootProps()} 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  isCodeDragActive ? 'border-[#3b82f6] bg-[#3b82f6]/5' : 'border-white/10 bg-[#131b2e]/50 hover:border-white/20 hover:bg-[#131b2e]'
                }`}
              >
                <input {...getCodeInputProps()} />
                <Upload className="w-8 h-8 text-[#c2c6d6]/40 mb-3" />
                {fileName ? (
                  <div>
                    <p className="text-sm font-bold text-[#3b82f6]">{fileName}</p>
                    <p className="text-xs text-[#c2c6d6]/60 mt-1">HTML loaded successfully. Click to replace.</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Drag & drop your .html file here</p>
                    <p className="text-xs text-[#c2c6d6]/60">Or click to select a file from your computer</p>
                  </div>
                )}
              </div>
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="<!DOCTYPE html>&#10;<html>...&#10;</html>"
                className="w-full bg-[#131b2e] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-[#3b82f6]/50 transition-colors h-40 resize-none custom-scrollbar"
              />
            )}
          </div>

          {/* Thumbnail */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#c2c6d6] uppercase tracking-wider">Thumbnail Image</label>
            <div 
              {...getThumbRootProps()} 
              className={`border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                thumbnail ? 'border-transparent' : isThumbDragActive ? 'border-[#ec4899] bg-[#ec4899]/5' : 'border-white/10 bg-[#131b2e]/50 hover:border-white/20 hover:bg-[#131b2e]'
              }`}
            >
              <input {...getThumbInputProps()} />
              {thumbnail ? (
                <div className="relative w-full h-40 group">
                  <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-bold text-white">Click or drop to replace</p>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <ImageIcon className="w-8 h-8 text-[#c2c6d6]/40 mb-3 mx-auto" />
                  <p className="text-sm font-bold text-white mb-1">Upload a preview thumbnail</p>
                  <p className="text-xs text-[#c2c6d6]/60">Drag & drop a .jpg, .png, or .webp image</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-[#131b2e]/50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-[#c2c6d6] hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !code.trim()}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-95"
          >
            Save & Publish
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// EDIT LANDING PAGE OVERRIDE MODAL
// -------------------------------------------------------------
interface EditOverrideModalProps {
  offer: OfferLandingPage;
  initialTitle?: string;
  initialCtaLink?: string;
  onClose: () => void;
  onSave: (customTitle: string, customCtaLink: string) => Promise<void>;
}

function EditOverrideModal({ offer, initialTitle = '', initialCtaLink = '', onClose, onSave }: EditOverrideModalProps) {
  const [customTitle, setCustomTitle] = useState(initialTitle);
  const [customCtaLink, setCustomCtaLink] = useState(initialCtaLink);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(customTitle, customCtaLink);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#060e20]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-[#0b1326] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#131b2e]/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#f59e0b]" />
              <span>Edit Page Override</span>
            </h2>
            <p className="text-xs text-[#c2c6d6]/60 mt-0.5">Customize fields for your account only</p>
          </div>
          <button type="button" onClick={onClose} className="text-[#c2c6d6]/60 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#c2c6d6] uppercase tracking-wider block">
              Custom Title
            </label>
            <input
              type="text"
              placeholder={`Original: ${offer.title}`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-[#131b2e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
            />
            <span className="text-[10px] text-[#c2c6d6]/40 block">Leave empty to use original title.</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#c2c6d6] uppercase tracking-wider block">
              Custom CTA Link (URL)
            </label>
            <input
              type="url"
              placeholder="e.g. https://yourtracklink.com/offer-page"
              value={customCtaLink}
              onChange={(e) => setCustomCtaLink(e.target.value)}
              className="w-full bg-[#131b2e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
            />
            <span className="text-[10px] text-[#c2c6d6]/40 block">This will dynamically replace CTA links inside the HTML preview.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg text-xs font-bold text-[#c2c6d6] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Override</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
