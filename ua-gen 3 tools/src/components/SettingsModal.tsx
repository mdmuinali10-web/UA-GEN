/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, RefreshCw, HelpCircle, Shield, Sliders } from 'lucide-react';
import { EngineSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EngineSettings;
  onUpdateSettings: (settings: EngineSettings) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: SettingsModalProps) {
  const handleReset = () => {
    onUpdateSettings({
      chromeMinVersion: 114,
      chromeMaxVersion: 126,
      firefoxMinVersion: 115,
      firefoxMaxVersion: 126,
      safariMinVersion: 15,
      safariMaxVersion: 18,
      locale: 'en-US',
      includeLayoutEngine: true,
    });
  };

  const handleSliderChange = (
    key: keyof Pick<EngineSettings, 'chromeMinVersion' | 'chromeMaxVersion' | 'firefoxMinVersion' | 'firefoxMaxVersion' | 'safariMinVersion' | 'safariMaxVersion'>,
    val: number
  ) => {
    const updated = { ...settings, [key]: val };
    
    // Maintain min <= max invariants
    if (key === 'chromeMinVersion' && val > settings.chromeMaxVersion) {
      updated.chromeMaxVersion = val;
    } else if (key === 'chromeMaxVersion' && val < settings.chromeMinVersion) {
      updated.chromeMinVersion = val;
    } else if (key === 'firefoxMinVersion' && val > settings.firefoxMaxVersion) {
      updated.firefoxMaxVersion = val;
    } else if (key === 'firefoxMaxVersion' && val < settings.firefoxMinVersion) {
      updated.firefoxMinVersion = val;
    } else if (key === 'safariMinVersion' && val > settings.safariMaxVersion) {
      updated.safariMaxVersion = val;
    } else if (key === 'safariMaxVersion' && val < settings.safariMinVersion) {
      updated.safariMinVersion = val;
    }

    onUpdateSettings(updated);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 shadow-2xl overflow-y-auto bg-[#0b1326] border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/2 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#adc6ff]" />
                <h2 className="text-lg font-bold tracking-tight text-white font-sans">
                  Engine Parameters
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#c2c6d6] hover:text-white transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 p-6 space-y-8">
              {/* Info Disclaimer */}
              <div className="p-4 rounded-xl bg-[#571bc1]/10 border border-[#571bc1]/20 flex gap-3">
                <Shield className="w-5 h-5 text-[#adc6ff] shrink-0 mt-0.5" />
                <div className="text-xs text-[#c2c6d6] leading-relaxed">
                  <p className="font-semibold text-white mb-1">Authentic Entropy Tuning</p>
                  These parameters define the pool ranges that the engine uses to dynamically construct agent strings during bulk generation.
                </div>
              </div>

              {/* Chrome Pools */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#acedff]">
                    Chrome Version Range
                  </label>
                  <span className="font-mono text-xs text-white font-semibold bg-white/5 px-2 py-0.5 rounded">
                    v{settings.chromeMinVersion} – v{settings.chromeMaxVersion}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-[#c2c6d6] mb-1">
                      <span>Minimum Version</span>
                      <span>v{settings.chromeMinVersion}</span>
                    </div>
                    <input
                      type="range"
                      min="90"
                      max="140"
                      value={settings.chromeMinVersion}
                      onChange={(e) => handleSliderChange('chromeMinVersion', parseInt(e.target.value))}
                      className="w-full accent-[#adc6ff] cursor-pointer h-1 rounded-lg bg-white/10"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-[#c2c6d6] mb-1">
                      <span>Maximum Version</span>
                      <span>v{settings.chromeMaxVersion}</span>
                    </div>
                    <input
                      type="range"
                      min="90"
                      max="140"
                      value={settings.chromeMaxVersion}
                      onChange={(e) => handleSliderChange('chromeMaxVersion', parseInt(e.target.value))}
                      className="w-full accent-[#adc6ff] cursor-pointer h-1 rounded-lg bg-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Firefox Pools */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#acedff]">
                    Firefox Version Range
                  </label>
                  <span className="font-mono text-xs text-white font-semibold bg-white/5 px-2 py-0.5 rounded">
                    v{settings.firefoxMinVersion} – v{settings.firefoxMaxVersion}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-[#c2c6d6] mb-1">
                      <span>Minimum Version</span>
                      <span>v{settings.firefoxMinVersion}</span>
                    </div>
                    <input
                      type="range"
                      min="90"
                      max="140"
                      value={settings.firefoxMinVersion}
                      onChange={(e) => handleSliderChange('firefoxMinVersion', parseInt(e.target.value))}
                      className="w-full accent-[#adc6ff] cursor-pointer h-1 rounded-lg bg-white/10"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-[#c2c6d6] mb-1">
                      <span>Maximum Version</span>
                      <span>v{settings.firefoxMaxVersion}</span>
                    </div>
                    <input
                      type="range"
                      min="90"
                      max="140"
                      value={settings.firefoxMaxVersion}
                      onChange={(e) => handleSliderChange('firefoxMaxVersion', parseInt(e.target.value))}
                      className="w-full accent-[#adc6ff] cursor-pointer h-1 rounded-lg bg-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Safari Pools */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#acedff]">
                    Safari Version Range
                  </label>
                  <span className="font-mono text-xs text-white font-semibold bg-white/5 px-2 py-0.5 rounded">
                    v{settings.safariMinVersion} – v{settings.safariMaxVersion}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-[#c2c6d6] mb-1">
                      <span>Minimum Version</span>
                      <span>v{settings.safariMinVersion}</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      value={settings.safariMinVersion}
                      onChange={(e) => handleSliderChange('safariMinVersion', parseInt(e.target.value))}
                      className="w-full accent-[#adc6ff] cursor-pointer h-1 rounded-lg bg-white/10"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-[#c2c6d6] mb-1">
                      <span>Maximum Version</span>
                      <span>v{settings.safariMaxVersion}</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      value={settings.safariMaxVersion}
                      onChange={(e) => handleSliderChange('safariMaxVersion', parseInt(e.target.value))}
                      className="w-full accent-[#adc6ff] cursor-pointer h-1 rounded-lg bg-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Layout details toggle */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#acedff] block mb-1">
                      Layout Engine Specs
                    </label>
                    <p className="text-[11px] text-[#c2c6d6] leading-relaxed">
                      Expose complete layouts (e.g. Gecko/20100101, AppleWebKit/537.36) within simulated identities.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={settings.includeLayoutEngine}
                      onChange={(e) => onUpdateSettings({ ...settings, includeLayoutEngine: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#571bc1]" />
                  </label>
                </div>
              </div>

              {/* Language Locale option */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#acedff] block">
                  Language Locale Match
                </label>
                <select
                  value={settings.locale}
                  onChange={(e) => onUpdateSettings({ ...settings, locale: e.target.value })}
                  className="w-full bg-[#131b2e] border border-white/10 text-xs text-[#dae2fd] rounded-lg py-2 px-3 outline-none focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff]"
                >
                  <option value="en-US">English (US) - en-US</option>
                  <option value="en-GB">English (UK) - en-GB</option>
                  <option value="de-DE">German (Germany) - de-DE</option>
                  <option value="fr-FR">French (France) - fr-FR</option>
                  <option value="es-ES">Spanish (Spain) - es-ES</option>
                  <option value="ja-JP">Japanese (Japan) - ja-JP</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-white/10 bg-white/1 backdrop-blur-md flex gap-3">
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 flex-1 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-xs font-bold text-[#c2c6d6] active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Defaults
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center flex-1 px-4 py-2.5 rounded-lg bg-[#571bc1] hover:bg-[#571bc1]/80 transition-all text-xs font-bold text-white shadow-md active:scale-95"
              >
                Apply Specs
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
