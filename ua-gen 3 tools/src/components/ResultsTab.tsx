/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Copy,
  Download,
  Trash2,
  Check,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { UserAgentItem } from '../types';
import { exportToCSV } from '../utils/generator';

interface ResultsTabProps {
  items: UserAgentItem[];
  onClear: () => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

const getFlagForLocale = (localeCode?: string): { flag: string; label: string } | null => {
  if (!localeCode) return null;
  const LANGUAGES = [
    { code: 'en-US', name: 'United States', flag: '🇺🇸', label: 'English (US)' },
    { code: 'en-GB', name: 'United Kingdom', flag: '🇬🇧', label: 'English (UK)' },
    { code: 'de-DE', name: 'Germany', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'fr-FR', name: 'France', flag: '🇫🇷', label: 'Français' },
    { code: 'es-ES', name: 'Spain', flag: '🇪🇸', label: 'Español' },
    { code: 'ja-JP', name: 'Japan', flag: '🇯🇵', label: '日本語' },
    { code: 'it-IT', name: 'Italy', flag: '🇮🇹', label: 'Italiano' },
    { code: 'zh-CN', name: 'China', flag: '🇨🇳', label: '简体中文' },
    { code: 'bn-BD', name: 'Bangladesh', flag: '🇧🇩', label: 'বাংলা' },
    { code: 'hi-IN', name: 'India', flag: '🇮🇳', label: 'हिन्दी' },
    { code: 'pt-BR', name: 'Brazil', flag: '🇧🇷', label: 'Português' },
    { code: 'ru-RU', name: 'Russia', flag: '🇷🇺', label: 'Русский' },
    { code: 'tr-TR', name: 'Turkey', flag: '🇹🇷', label: 'Türkçe' },
    { code: 'ko-KR', name: 'South Korea', flag: '🇰🇷', label: '한국어' },
  ];

  const found = LANGUAGES.find((lang) => lang.code === localeCode);
  return found ? { flag: found.flag, label: found.label } : null;
};

export default function ResultsTab({
  items,
  onClear,
  onShowToast,
}: ResultsTabProps) {
  const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobileOrTablet(window.innerWidth < 1024);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Directly use the items without filtering
  const filteredItems = items;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredItems.length]);

  const itemsPerPage = isMobileOrTablet ? 10 : filteredItems.length;
  const totalPages = itemsPerPage > 0 ? Math.ceil(filteredItems.length / itemsPerPage) : 1;
  
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopySingle = (item: UserAgentItem) => {
    navigator.clipboard.writeText(item.userAgent);
    setCopiedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(item.id);
      return newSet;
    });
    onShowToast('Copied string to clipboard', 'success');
  };

  const handleCopyAll = () => {
    if (filteredItems.length === 0) return;
    const allStrings = filteredItems.map((item) => item.userAgent).join('\n');
    navigator.clipboard.writeText(allStrings);
    onShowToast(`Copied all ${filteredItems.length} strings to clipboard`, 'success');
  };

  const handleDownloadCSV = () => {
    if (filteredItems.length === 0) return;
    const csvContent = exportToCSV(filteredItems);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `uagen_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Exported ${filteredItems.length} records to CSV file`, 'success');
  };

  return (
    <div className="space-y-6 lg:space-y-0 lg:flex lg:flex-col lg:flex-1 lg:min-h-0 lg:gap-6">
      {/* Bulk Actions & Sticky Count */}
      <section className="relative z-10 bg-[#0b1326]/80 backdrop-blur-sm py-2 rounded-xl border border-white/5 px-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="bg-[#4cd7f6]/10 text-[#4cd7f6] px-3 py-1.5 rounded-lg font-mono text-xs font-bold border border-[#4cd7f6]/20">
            {filteredItems.length} Results Found
          </span>
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 text-[#c2c6d6] hover:text-[#adc6ff] transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <Copy className="w-4 h-4" />
              <span>Copy All</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 text-[#c2c6d6] hover:text-[#adc6ff] transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        ) : null}
      </section>

      {/* Bento Grid / List of Cards */}
      <section className="relative z-10 space-y-4 lg:flex-1 lg:overflow-y-auto lg:pr-2 lg:custom-scrollbar lg:min-h-0">
        <AnimatePresence mode="popLayout">
          {displayedItems.length > 0 ? (
            displayedItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.02 }}
                className="bg-[#171f33]/40 border border-white/10 p-5 rounded-2xl hover:bg-white/[0.04] transition-all group relative overflow-hidden shadow-md"
              >
                {/* Border glowing highlight on group hover */}
                <div className="absolute inset-0 bg-[#adc6ff]/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="bg-[#adc6ff]/10 text-[#adc6ff] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {item.browserVersion}
                      </span>
                      <span className="bg-[#4cd7f6]/10 text-[#4cd7f6] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {item.osVersion}
                      </span>
                      {item.device && (
                        <span className="bg-white/5 text-[#c2c6d6] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                          {item.device}
                        </span>
                      )}
                      {item.locale && (() => {
                        const info = getFlagForLocale(item.locale);
                        if (!info) return null;
                        return (
                          <span className="bg-[#acedff]/10 text-[#acedff] px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#acedff]/20 shadow-sm">
                            <span className="text-sm leading-none">{info.flag}</span>
                            <span>{info.label}</span>
                          </span>
                        );
                      })()}
                      {item.socialMedia && (
                        <span className="bg-[#f43f5e]/10 text-[#f43f5e] px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#f43f5e]/20 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-pulse"></span>
                          <span>In-App: {item.socialMedia}</span>
                        </span>
                      )}
                    </div>
                    
                    <code className="block font-mono text-xs text-[#dae2fd] break-all select-all leading-relaxed bg-[#060e20]/40 p-3 rounded-lg border border-white/5 mt-3 shadow-inner">
                      {item.userAgent}
                    </code>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-col gap-2 shrink-0 self-center">
                    <button
                      onClick={() => handleCopySingle(item)}
                      className={`p-2.5 rounded-xl border transition-all active:scale-90 ${
                        copiedIds.has(item.id)
                          ? 'bg-[#4cd7f6]/20 border-[#4cd7f6] text-white'
                          : 'bg-[#131b2e]/60 border-white/5 text-[#c2c6d6] hover:text-[#4cd7f6] hover:border-[#4cd7f6]/30'
                      }`}
                      title="Copy User-Agent string"
                    >
                      {copiedIds.has(item.id) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center text-[#c2c6d6]/40"
            >
              <Database className="w-16 h-16 mb-4 stroke-1 text-[#c2c6d6]/20 animate-pulse" />
              <p className="text-lg font-bold font-sans text-white mb-1">
                No Simulated Identities Found
              </p>
              <p className="text-xs text-[#c2c6d6] max-w-md leading-relaxed">
                {items.length === 0
                  ? 'Your active generation session is empty. Tune parameters above to spin up real identities.'
                  : 'No results matched your search queries or active browser filters. Try loosening your terms.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-6 mt-4 border-t border-white/5">
            <button
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171f33] hover:bg-white/5 border border-white/10 rounded-lg text-sm text-[#c2c6d6] disabled:opacity-50 disabled:hover:bg-[#171f33] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <div className="flex items-center gap-2 font-mono text-xs text-[#c2c6d6]/80">
              Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
            </div>
            <button
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171f33] hover:bg-white/5 border border-white/10 rounded-lg text-sm text-[#c2c6d6] disabled:opacity-50 disabled:hover:bg-[#171f33] transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
