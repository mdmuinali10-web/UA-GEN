/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Chrome,
  Globe,
  Compass,
  Cpu,
  Monitor,
  Tablet,
  Smartphone,
  Zap,
  Sliders,
  Wrench,
} from 'lucide-react';
import { BrowserType, OSType, EngineSettings, UserAgentItem } from '../types';
import ResultsTab from './ResultsTab';
import { DEVICE_MODELS, getDeviceOSRange, getIosDeviceOSRange, IPHONE_OS_MAPPINGS, ANDROID_MODEL_NAMES } from '../utils/generator';

const renderBrowserLogo = (id: string) => {
  switch (id) {
    case 'chrome':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="white" />
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 9.4 21 7 19.3 5.3L14.7 13.3C14.3 14 13.7 14.5 13 14.8L9.5 20.9C10.3 21.6 11.1 22 12 22Z" fill="#34A853" />
          <path d="M19.3 5.3C17.4 3.2 14.8 2 12 2C7.3 2 3.4 5.3 2.4 9.7L7 17.7C7.1 16.9 7.5 16.2 8.1 15.6L12.7 7.6C13.4 7.2 14.2 7 15 7H19.3V5.3Z" fill="#EA4335" />
          <path d="M2.4 9.7C2.1 10.4 2 11.2 2 12C2 16.6 5.1 20.4 9.5 20.9L14.1 12.9C14.1 12.1 13.9 11.3 13.5 10.7L8.9 2.7C5.8 4.1 3.6 6.6 2.4 9.7Z" fill="#FBBC05" />
          <circle cx="12" cy="12" r="5" fill="white" />
          <circle cx="12" cy="12" r="3.8" fill="#4285F4" />
        </svg>
      );
    case 'firefox':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#1e293b" className="opacity-40" />
          <path fill="#e65100" d="M19.7 13c.1-.4.2-.8.2-1.2 0-3.9-3.1-7-7-7-2 0-3.8.8-5.1 2.1L7.5 7c.6-.7 1.4-1.2 2.3-1.5-.7-.4-1.5-.5-2.3-.5C4.3 5 1.5 7.8 1.5 11.2c0 2.3 1.3 4.3 3.2 5.3-.4-.5-.7-1.2-.7-2 0-2.1 1.7-3.8 3.8-3.8.3 0 .6 0 .9.1-.5-.8-.8-1.7-.8-2.7 0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 1-.3 1.9-.8 2.7.3-.1.6-.1.9-.1 2.1 0 3.8 1.7 3.8 3.8 0 .8-.3 1.5-.7 2 1.9-1 3.2-3 3.2-5.3z" />
          <path fill="#ff9100" d="M12.4 6.7c-.5-.5-1.2-.7-1.9-.7-.5 0-1 .1-1.4.3.4.4.7 1 .7 1.6 0 .8-.5 1.4-1.1 1.7-.3.1-.6.2-1 .2-.3 0-.6-.1-.9-.2.3.8.9 1.4 1.7 1.7-.4.5-.6 1.1-.6 1.8 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-.7-.3-1.3-.8-1.8.8-.4 1.3-1.2 1.3-2.2 0-1-.5-1.9-1.2-2.4z" />
          <circle cx="10.5" cy="11.5" r="2.5" fill="#1e3a8a" />
          <circle cx="10.5" cy="11.5" r="1.5" fill="#60a5fa" />
        </svg>
      );
    case 'safari':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#0284C7" />
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="white" strokeWidth="0.8" />
          <path d="M12 4v1.5M12 18.5v1.5M4 12h1.5M18.5 12H20M6.34 6.34l1.06 1.06M16.6 16.6l1.06 1.06M6.34 17.66l1.06-1.06M16.6 7.4l1.06-1.06" stroke="white" strokeWidth="0.8" opacity="0.8" />
          <path d="M12 12l2.5-5.5L12 12z" fill="#EF4444" />
          <path d="M12 12l-2.5 5.5L12 12z" fill="#F3F4F6" />
          <path d="M12 12l-2.5-2.5L12 12z" fill="#D1D5DB" />
          <path d="M12 12l2.5 2.5L12 12z" fill="#DC2626" />
          <circle cx="12" cy="12" r="1" fill="white" />
        </svg>
      );
    case 'edge':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="edge-g1" x1="10%" y1="90%" x2="90%" y2="10%">
              <stop offset="0%" stopColor="#0a549f" />
              <stop offset="50%" stopColor="#00a1e6" />
              <stop offset="100%" stopColor="#00bda3" />
            </linearGradient>
            <linearGradient id="edge-g2" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#3fe166" />
              <stop offset="50%" stopColor="#00bda3" />
              <stop offset="100%" stopColor="#00a1e6" />
            </linearGradient>
          </defs>
          <path d="M16 2C8.28 2 2 8.28 2 16c0 5.4 3.02 10.1 7.45 12.47C8.41 24.84 9.5 20.5 12.5 17.5c2.5-2.5 5.5-3 8.5-2 3.5 1.2 5 4.3 4.5 8s-3.5 6-7.5 6c-3 0-5.5-1.5-6.5-3.5-.8 1.2-1.2 2.7-1.2 4.1C11.5 30.1 13.7 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2z" fill="url(#edge-g1)" />
          <path d="M16 2c7.72 0 14 6.28 14 14s-6.28 14-14 14c-2.5 0-4.8-.66-6.8-1.8 1.1-1.2 2.5-2.2 2.8-2.2 1.5.5 3 .7 4.5.7 4.2 0 7.6-3.4 7.6-7.6s-3.4-7.6-7.6-7.6c-3.1 0-5.8 1.8-7 4.5C8.3 12 5.5 10.5 3 11 1.7 12 1 13.1 1 14.5c0-6.9 5.6-12.5 12.5-12.5H16z" fill="url(#edge-g2)" opacity="0.95" />
        </svg>
      );
    case 'opera':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="operaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff1a1a" />
              <stop offset="40%" stopColor="#cc0000" />
              <stop offset="100%" stopColor="#800000" />
            </linearGradient>
          </defs>
          <path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 17c-2.76 0-5-2.24-5-7s2.24-7 5-7 5 2.24 5 7-2.24 7-5 7z" 
            fill="url(#operaGrad)" 
          />
        </svg>
      );
    default:
      return <Globe className="w-6 h-6 shrink-0" />;
  }
};

const renderOSLogo = (id: string, isSelected: boolean) => {
  switch (id) {
    case 'windows':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5.543l7.377-1.004v7.078H3V5.543zm0 7.727h7.377v7.068L3 19.334v-6.064zm8.31-8.85L21 3v8.342h-9.69V4.42zm9.69 8.85v8.32l-9.69-1.32v-7H21z" fill={isSelected ? "#acedff" : "#3b82f6"} />
        </svg>
      );
    case 'macos':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" fill="#000000" stroke={isSelected ? "#acedff" : "#3b82f6"} strokeWidth={isSelected ? "1" : "0"} />
          <text 
            x="12" 
            y="10.5" 
            textAnchor="middle" 
            fill="#ffffff" 
            fontSize="6.5" 
            fontWeight="bold" 
            fontFamily="Inter, system-ui, sans-serif"
            letterSpacing="-0.2"
          >
            mac
          </text>
          <text 
            x="12" 
            y="17.5" 
            textAnchor="middle" 
            fill="#ffffff" 
            fontSize="8" 
            fontWeight="900" 
            fontFamily="Inter, system-ui, sans-serif"
          >
            OS
          </text>
        </svg>
      );
    case 'linux':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.2.5 2.3 1.3 3C7 11.2 5 14.5 5 17.5c0 2.5 3.1 4.5 7 4.5s7-2 7-4.5c0-3-2-6.3-3.8-8 .8-.7 1.3-1.8 1.3-3C16.5 4 14.5 2 12 2z" fill="#0f172a" />
          <path d="M12 8.5c-1.8 0-3-1-3-2s1.2-2 3-2 3 1 3 2-1.2 2-3 2z" fill="#ffffff" />
          <circle cx="10.5" cy="6" r="0.8" fill="#000" />
          <circle cx="13.5" cy="6" r="0.8" fill="#000" />
          <path d="M11 7l1 1 1-1z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
          <path d="M12 12.5c-2.8 0-5 2-5 4.5s2.2 4.5 5 4.5 5-2 5-4.5-2.2-4.5-5-4.5z" fill="#ffffff" />
          <path d="M8 21.5c-1 0-1.8.5-1.8 1.2S7 24 9 24s2-.8 2-1.3-.8-1.2-3-1.2zm8 0c-1 0-1.8.5-1.8 1.2s.8 1.3 2.8 1.3 2-.8 2-1.3-.8-1.2-3-1.2z" fill="#f59e0b" />
        </svg>
      );
    case 'android':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          {/* Antenna Left */}
          <rect x="6.8" y="2.5" width="1.5" height="4.5" rx="0.75" fill="#3DDC84" transform="rotate(-25 7.55 4.75)" />
          {/* Antenna Right */}
          <rect x="15.7" y="2.5" width="1.5" height="4.5" rx="0.75" fill="#3DDC84" transform="rotate(25 16.45 4.75)" />
          {/* Head dome */}
          <path d="M4 14a8 8 0 0116 0H4z" fill="#3DDC84" />
          {/* Eyes */}
          <circle cx="9" cy="11" r="1" fill="#1c1917" />
          <circle cx="15" cy="11" r="1" fill="#1c1917" />
        </svg>
      );
    case 'ios':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill={isSelected ? "#acedff" : "#e2e8f0"} xmlns="http://www.w3.org/2000/svg">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39" />
        </svg>
      );
    default:
      return <Monitor className="w-6 h-6 shrink-0" />;
  }
};

const renderSocialMediaLogo = (id: string, isSelected: boolean) => {
  switch (id) {
    case 'none':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" stroke={isSelected ? "#acedff" : "#8e9bb4"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" fill="#1877f2" />
          <path d="M14 12h-2v7h-3v-7H8V9h1V7.5C9 5.3 10.1 4 12.8 4H15v3h-1.4C12.8 7 12.5 7.4 12.5 8v1H15l-.5 3z" fill="#ffffff" />
        </svg>
      );
    case 'fblite':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" fill="#ffffff" stroke="#1877f2" strokeWidth="1.5" />
          <path d="M14 12h-2v7h-3v-7H8V9h1V7.5C9 5.3 10.1 4 12.8 4H15v3h-1.4C12.8 7 12.5 7.4 12.5 8v1H15l-.5 3z" fill="#1877f2" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="igGrad" cx="30%" cy="107%" r="130%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <rect width="22" height="22" x="1" y="1" rx="6" fill="url(#igGrad)" />
          <rect width="12" height="12" x="6" y="6" rx="3" fill="none" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="none" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="15.5" cy="8.5" r="1" fill="#ffffff" />
        </svg>
      );
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="22" height="22" x="1" y="1" rx="5" fill="#000000" stroke="#ffffff" strokeWidth="0.5" />
          <path d="M16.5 6h2l-4.5 5.2L19 18h-4l-3.1-4.1L8.3 18h-2l4.8-5.5L6.5 6h4.1l2.8 3.7L16.5 6zm-1.2 10.5h1.1L8.7 7.5H7.5l7.8 9z" fill="#ffffff" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <rect width="22" height="22" x="1" y="1" rx="4" fill="#0a66c2" />
          <rect x="5" y="9.5" width="3" height="9" fill="#ffffff" />
          <circle cx="6.5" cy="6" r="1.8" fill="#ffffff" />
          <path d="M10 18.5V13c0-1.5.8-2.5 2.2-2.5 1.5 0 2 1 2 2.5v5.5h3v-6c0-3-1.8-4.5-3.8-4.5-1.8 0-2.6.9-3 1.5V9.5h-3v9h3z" fill="#ffffff" />
        </svg>
      );
    case 'snapchat':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <rect width="22" height="22" x="1" y="1" rx="5" fill="#fffc00" />
          <path d="M12 5c-2.4 0-4 1.8-4 3.8s1 2.8 1 3.5c0 .5-.8 1-1.2 1.5-.4.5-.4.9 0 1 .5.1 1.8-.4 2.2-.4s.8.4.8.9c0 1.2-1.3 1.8-1.3 2.5 0 .5.5.8 1.5.8s2.2-.5 3-.5 2 .5 3 .5 1.5-.3 1.5-.8c0-.7-1.3-1.3-1.3-2.5 0-.5.4-.9.8-.9s1.7.5 2.2.4c.4-.1.4-.5 0-1-.4-.5-1.2-1-1.2-1.5 0-.7 1-1.5 1-3.5S14.4 5 12 5z" fill="#ffffff" stroke="#000000" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <rect width="22" height="22" x="1" y="1" rx="5" fill="#000000" />
          <g transform="translate(1, 0)">
            <path d="M15 6h-2.5v6.5c0 1.5-1.2 2.5-2.5 2.5s-2.5-1.2-2.5-2.5 1.2-2.5 2.5-2.5V7.5c-3 0-5 2.5-5 5s2.5 5 5 5 5-2.5 5-5V9.5c1 .5 2 1 3 1V8c-1.5 0-2.5-1-3-2z" fill="#00f2fe" opacity="0.8" />
            <path d="M15.5 6.5H13v6.5c0 1.5-1.2 2.5-2.5 2.5s-2.5-1.2-2.5-2.5 1.2-2.5 2.5-2.5V8c-3 0-5 2.5-5 5s2.5 5 5 5 5-2.5 5-5V10c1 .5 2 1 3 1V8.5c-1.5 0-2.5-1-3-2z" fill="#fe0979" opacity="0.8" />
          </g>
        </svg>
      );
    default:
      return null;
  }
};

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

interface GeneratorTabProps {
  onGenerate: (
    browser: BrowserType,
    os: OSType,
    device: string,
    density: number,
    randomize: boolean,
    browserVersionOverride?: string,
    osVersionOverride?: string,
    deviceModelOverride?: string,
    socialMedia?: string,
    iosModelOverride?: string
  ) => void;
  settings: EngineSettings;
  onUpdateSettings?: (settings: EngineSettings) => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
  results: UserAgentItem[];
  onClearResults: () => void;
}

export default function GeneratorTab({
  onGenerate,
  settings,
  onUpdateSettings,
  onShowToast,
  results,
  onClearResults,
}: GeneratorTabProps) {
  // Dynamic height matching state and refs
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const [leftPanelHeight, setLeftPanelHeight] = useState<number | null>(null);
  const [isLg, setIsLg] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const listener = () => setIsLg(media.matches);
    setIsLg(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const element = leftPanelRef.current;
    if (!element) return;

    const updateHeight = () => {
      setLeftPanelHeight(element.offsetHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(element);

    window.addEventListener('resize', updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Core config state
  const [selectedBrowsers, setSelectedBrowsers] = useState<BrowserType[]>([]);
  const [selectedOSs, setSelectedOSs] = useState<OSType[]>([]);
  const [deviceManufacturers, setDeviceManufacturers] = useState<string[]>(['all']);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<string[]>([]);
  const [isSocialMediaEnabled, setIsSocialMediaEnabled] = useState<boolean>(false);
  const [density, setDensity] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Specific device model state for Android
  const [selectedDeviceModel, setSelectedDeviceModel] = useState<string>('auto');

  // Specific device model state for iOS
  const [selectedIosModel, setSelectedIosModel] = useState<string>('auto');

  // Version overrides dropdown state
  const [browserVersion, setBrowserVersion] = useState<string>('auto');
  const [osVersion, setOsVersion] = useState<string>('auto');
  const [customAndroidVersion, setCustomAndroidVersion] = useState<string>('');

  const handleSocialMediaToggle = (id: string) => {
    if (id === 'none') {
      setSelectedSocialMedia(['none']);
    } else {
      setSelectedSocialMedia((prev) => {
        const filtered = prev.filter((item) => item !== 'none');
        if (filtered.includes(id)) {
          return filtered.filter((item) => item !== id);
        } else {
          return [...filtered, id];
        }
      });
    }
  };

  // Whenever selectedDeviceModel changes, validate osVersion to prevent impossible options
  useEffect(() => {
    if (selectedOSs.includes('android') && osVersion !== 'auto' && osVersion !== 'custom') {
      const verNum = parseInt(osVersion, 10);
      const activeManufacturer = deviceManufacturers.includes('all') ? 'Pixel' : (deviceManufacturers[0] || 'Pixel');
      const range = getDeviceOSRange(selectedDeviceModel, activeManufacturer);
      if (verNum < range.launch || verNum > range.max) {
        setOsVersion('auto');
      }
    }
  }, [selectedDeviceModel, deviceManufacturers, selectedOSs, osVersion]);

  // Whenever selectedIosModel changes, validate osVersion for iOS to prevent impossible options
  useEffect(() => {
    if (selectedOSs.includes('ios') && osVersion !== 'auto') {
      const verNum = parseInt(osVersion, 10);
      const range = getIosDeviceOSRange(selectedIosModel);
      if (verNum < range.launch || verNum > range.max) {
        setOsVersion('auto');
      }
    }
  }, [selectedIosModel, selectedOSs, osVersion]);

  const handleOSChange = (os: OSType) => {
    setSelectedOSs((prev) => {
      let updated: OSType[];
      if (prev.includes(os)) {
        updated = prev.filter((item) => item !== os);
      } else {
        updated = [...prev, os];
      }

      // If Android gets added, make sure selectedDeviceModel is initialized
      if (updated.includes('android') && !prev.includes('android')) {
        setSelectedDeviceModel('auto');
      }
      
      // If iOS gets added and safari is not selected, auto-select Safari for compatibility
      if (updated.includes('ios') && !selectedBrowsers.includes('safari')) {
        setSelectedBrowsers(bPrev => bPrev.includes('safari') ? bPrev : [...bPrev, 'safari']);
      }

      return updated;
    });
  };

  const handleBrowserChange = (browser: BrowserType) => {
    setSelectedBrowsers((prev) => {
      let updated: BrowserType[];
      if (prev.includes(browser)) {
        updated = prev.filter((item) => item !== browser);
      } else {
        updated = [...prev, browser];
      }

      // If Safari gets added and macOS/iOS is not selected, auto-select macOS
      if (updated.includes('safari') && !selectedOSs.includes('macos') && !selectedOSs.includes('ios')) {
        setSelectedOSs(oPrev => oPrev.includes('macos') ? oPrev : [...oPrev, 'macos']);
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBrowsers.length === 0) {
      onShowToast('Please select at least one Target Browser.', 'error');
      return;
    }
    if (selectedOSs.length === 0) {
      onShowToast('Please select at least one Operating System.', 'error');
      return;
    }
    if (selectedOSs.includes('android') && deviceManufacturers.length === 0) {
      onShowToast('Please select at least one Hardware Device Profile.', 'error');
      return;
    }
    setIsGenerating(true);
    
    setTimeout(() => {
      const socialMediaSelected = selectedSocialMedia.filter(id => id !== 'none');
      const socialMediaStr = (isSocialMediaEnabled && socialMediaSelected.length > 0) ? socialMediaSelected.join(',') : 'none';
      const browsersStr = selectedBrowsers.join(',');
      const ossStr = selectedOSs.join(',');
      const manufacturersList = ['Pixel', 'Samsung', 'OnePlus', 'Nothing', 'Xiaomi', 'Sony'];
      const manufacturersStr = deviceManufacturers.includes('all')
        ? manufacturersList.join(',')
        : deviceManufacturers.join(',');
      onGenerate(
        browsersStr as any,
        ossStr as any,
        manufacturersStr,
        density,
        true,
        browserVersion,
        osVersion === 'custom' ? customAndroidVersion : osVersion,
        selectedDeviceModel,
        socialMediaStr || 'none'
      );
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      
      {/* Left Column: Form & Telemetry monitors (Width: lg:col-span-5) */}
      <section className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Main Parameters Configuration */}
        <div 
          ref={leftPanelRef}
          className="bg-[#171f33]/40 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
        >
          <header className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight flex items-center gap-2">
              <Sliders className="w-6 h-6 text-[#adc6ff]" />
              Configuration Panel
            </h2>
            <p className="text-[#e2e8f0]/80 text-sm">
              Configure parameters to compile batch user agents in strict version pools.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Inputs container */}
            <div className="space-y-6 pb-4">
            {/* Target Browser */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                <Globe className="w-5 h-5" />
                Target Browser Group
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'chrome', label: 'Chrome' },
                  { id: 'firefox', label: 'Firefox' },
                  { id: 'safari', label: 'Safari' },
                  { id: 'edge', label: 'Edge' },
                  { id: 'opera', label: 'Opera' },
                ].map((item) => {
                  const isSelected = selectedBrowsers.includes(item.id as BrowserType);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleBrowserChange(item.id as BrowserType)}
                      className={`relative rounded-xl p-3.5 flex flex-col items-center gap-2.5 border transition-all active:scale-95 text-center justify-center ${
                        isSelected
                          ? 'bg-[#acedff]/20 border-[#acedff] text-[#acedff] shadow-lg shadow-[#acedff]/10'
                          : 'bg-[#131b2e]/40 border-white/5 text-[#e2e8f0] hover:border-white/20 hover:text-white'
                      }`}
                      title={item.label}
                    >
                      {renderBrowserLogo(item.id)}
                      <span className="text-xs font-bold tracking-wider uppercase font-sans truncate max-w-full">
                        {item.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#4cd7f6]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Operating System */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                <Monitor className="w-5 h-5" />
                Operating System Base
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'windows', label: 'Windows' },
                  { id: 'macos', label: 'macOS' },
                  { id: 'linux', label: 'Linux' },
                  { id: 'android', label: 'Android' },
                  { id: 'ios', label: 'iOS' },
                ].map((item) => {
                  const isSelected = selectedOSs.includes(item.id as OSType);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleOSChange(item.id as OSType)}
                      className={`relative rounded-xl p-3.5 flex flex-col items-center gap-2.5 border transition-all active:scale-95 text-center justify-center ${
                        isSelected
                          ? 'bg-[#acedff]/20 border-[#acedff] text-[#acedff] shadow-lg shadow-[#acedff]/10'
                          : 'bg-[#131b2e]/40 border-white/5 text-[#e2e8f0] hover:border-white/20 hover:text-white'
                      }`}
                      title={item.label}
                    >
                      {renderOSLogo(item.id, isSelected)}
                      <span className="text-xs font-bold tracking-wider uppercase font-sans truncate max-w-full">
                        {item.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#4cd7f6]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-App Browser (Social Media) */}
            <div className={`space-y-4 p-4 rounded-xl border transition-all duration-300 ${isSocialMediaEnabled ? 'bg-[#acedff]/5 border-[#acedff]/30 shadow-[0_0_20px_rgba(172,237,255,0.05)]' : 'bg-[#131b2e]/30 border-white/10'}`}>
              <div className="flex items-center justify-between">
                <label className={`flex items-center gap-3 text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${isSocialMediaEnabled ? 'text-[#acedff]' : 'text-[#e2e8f0]'}`}>
                  <span className={`w-2 h-2 rounded-full transition-all duration-300 ${isSocialMediaEnabled ? 'bg-[#acedff] animate-pulse shadow-[0_0_8px_rgba(172,237,255,0.8)]' : 'bg-white/60'}`}></span>
                  In-App Browser (Social Media)
                </label>
                <button
                  type="button"
                  onClick={() => setIsSocialMediaEnabled(!isSocialMediaEnabled)}
                  className={`w-12 h-7 rounded-full transition-all duration-300 relative flex items-center cursor-pointer border ${isSocialMediaEnabled ? 'bg-[#acedff] border-[#acedff] shadow-[0_0_12px_rgba(172,237,255,0.4)]' : 'bg-[#131b2e] border-white/10'}`}
                >
                  <div className={`w-5 h-5 rounded-full transition-transform duration-300 absolute shadow-sm ${isSocialMediaEnabled ? 'translate-x-6 bg-[#060e20]' : 'translate-x-1 bg-white/60'}`} />
                </button>
              </div>
              
              {isSocialMediaEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-3 gap-2"
                >
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'facebook', label: 'Facebook' },
                    { id: 'instagram', label: 'Instagram' },
                    { id: 'twitter', label: 'X (Twitter)' },
                    { id: 'snapchat', label: 'Snapchat' },
                    { id: 'linkedin', label: 'LinkedIn' },
                  ].map((item) => {
                    const isSelected = selectedSocialMedia.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSocialMediaToggle(item.id)}
                        className={`relative rounded-xl p-3.5 flex flex-col items-center gap-2.5 border transition-all active:scale-95 text-center justify-center ${
                          isSelected
                            ? 'bg-[#acedff]/20 border-[#acedff] text-[#acedff] shadow-lg shadow-[#acedff]/10'
                            : 'bg-[#131b2e]/40 border-white/5 text-[#e2e8f0] hover:border-white/20 hover:text-white'
                        }`}
                        title={item.label}
                      >
                        {renderSocialMediaLogo(item.id, isSelected)}
                        <span className="text-xs font-bold tracking-wider uppercase font-sans truncate max-w-full">
                          {item.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#4cd7f6]" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Device Profile (strict conditional logic - only active manufacturer models) */}
            {selectedOSs.includes('android') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 overflow-hidden"
              >
                <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                  <Cpu className="w-5 h-5" />
                  Hardware Device Profile
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'all', label: '⚡ All Profiles' },
                    { id: 'Pixel', label: 'Google Pixel' },
                    { id: 'Samsung', label: 'Samsung Galaxy' },
                    { id: 'OnePlus', label: 'OnePlus' },
                    { id: 'Nothing', label: 'Nothing Phone' },
                    { id: 'Xiaomi', label: 'Xiaomi' },
                    { id: 'Sony', label: 'Sony Xperia' },
                  ].map((item) => {
                    const isSelected = item.id === 'all'
                      ? deviceManufacturers.includes('all')
                      : deviceManufacturers.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (item.id === 'all') {
                            setDeviceManufacturers(['all']);
                          } else {
                            if (deviceManufacturers.includes('all')) {
                              setDeviceManufacturers([item.id]);
                            } else {
                              setDeviceManufacturers((prev) => {
                                let updated: string[];
                                if (prev.includes(item.id)) {
                                  updated = prev.filter((x) => x !== item.id);
                                } else {
                                  updated = [...prev, item.id];
                                }
                                return updated;
                              });
                            }
                          }
                          setSelectedDeviceModel('auto');
                        }}
                        className={`px-2 py-1.5 text-sm rounded-lg border font-semibold text-center transition-all ${
                          isSelected
                            ? 'bg-[#acedff]/20 border-[#acedff] text-[#acedff]'
                            : 'bg-[#131b2e]/30 border-white/5 text-[#e2e8f0] hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Specific Device Model Selector */}
                <div className="space-y-2 pt-1.5">
                  <label className="text-xs font-bold tracking-widest text-[#e2e8f0]/80 uppercase flex items-center gap-2.5">
                    <Smartphone className="w-3 h-3 text-[#adc6ff]" />
                    Specific Device Model
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDeviceModel}
                      onChange={(e) => setSelectedDeviceModel(e.target.value)}
                      className="w-full bg-[#060e20]/60 border border-[#adc6ff]/30 rounded-xl py-3.5 px-5 text-sm font-bold text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="auto" className="bg-[#0b1326] text-[#acedff]">
                        Auto (Random model)
                      </option>
                      {(() => {
                        const activeManufacturers = deviceManufacturers.includes('all')
                          ? ['Pixel', 'Samsung', 'OnePlus', 'Nothing', 'Xiaomi', 'Sony']
                          : (deviceManufacturers.length > 0 ? deviceManufacturers : ['Pixel']);
                        return activeManufacturers.flatMap((m) => DEVICE_MODELS[m] || []).map((model) => {
                          const name = ANDROID_MODEL_NAMES[model];
                          const displayName = name ? `${model} (${name})` : model;
                          return (
                            <option key={model} value={model} className="bg-[#0b1326] text-white">
                              {displayName}
                            </option>
                          );
                        });
                      })()}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* iOS Device Profile (only when iOS is selected) */}
            {selectedOSs.includes('ios') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 overflow-hidden"
              >
                <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                  <Cpu className="w-5 h-5" />
                  iPhone Device Profile
                </label>
                <div className="relative">
                  <select
                    value={selectedIosModel}
                    onChange={(e) => setSelectedIosModel(e.target.value)}
                    className="w-full bg-[#060e20]/60 border border-[#adc6ff]/30 rounded-xl py-3.5 px-5 text-sm font-bold text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="auto" className="bg-[#0b1326] text-[#acedff]">
                      Auto (Random iPhone model)
                    </option>
                    <optgroup label="iPhone 17 Series" className="bg-[#0b1326] text-white">
                      <option value="iPhone18,1" className="bg-[#0b1326] text-white">iPhone 17 Pro (iPhone18,1)</option>
                      <option value="iPhone18,2" className="bg-[#0b1326] text-white">iPhone 17 Pro Max (iPhone18,2)</option>
                      <option value="iPhone18,3" className="bg-[#0b1326] text-white">iPhone 17 (iPhone18,3)</option>
                      <option value="iPhone18,4" className="bg-[#0b1326] text-white">iPhone 17 Air (iPhone18,4)</option>
                    </optgroup>
                    <optgroup label="iPhone 16 Series" className="bg-[#0b1326] text-white">
                      <option value="iPhone17,1" className="bg-[#0b1326] text-white">iPhone 16 Pro (iPhone17,1)</option>
                      <option value="iPhone17,2" className="bg-[#0b1326] text-white">iPhone 16 Pro Max (iPhone17,2)</option>
                      <option value="iPhone17,3" className="bg-[#0b1326] text-white">iPhone 16 (iPhone17,3)</option>
                      <option value="iPhone17,4" className="bg-[#0b1326] text-white">iPhone 16 Plus (iPhone17,4)</option>
                    </optgroup>
                    <optgroup label="iPhone 15 Series" className="bg-[#0b1326] text-white">
                      <option value="iPhone16,1" className="bg-[#0b1326] text-white">iPhone 15 Pro (iPhone16,1)</option>
                      <option value="iPhone16,2" className="bg-[#0b1326] text-white">iPhone 15 Pro Max (iPhone16,2)</option>
                      <option value="iPhone15,4" className="bg-[#0b1326] text-white">iPhone 15 (iPhone15,4)</option>
                      <option value="iPhone15,5" className="bg-[#0b1326] text-white">iPhone 15 Plus (iPhone15,5)</option>
                    </optgroup>
                    <optgroup label="iPhone 14 Series" className="bg-[#0b1326] text-white">
                      <option value="iPhone15,2" className="bg-[#0b1326] text-white">iPhone 14 Pro (iPhone15,2)</option>
                      <option value="iPhone15,3" className="bg-[#0b1326] text-white">iPhone 14 Pro Max (iPhone15,3)</option>
                      <option value="iPhone14,7" className="bg-[#0b1326] text-white">iPhone 14 (iPhone14,7)</option>
                      <option value="iPhone14,8" className="bg-[#0b1326] text-white">iPhone 14 Plus (iPhone14,8)</option>
                    </optgroup>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Version Constraint Selectors */}
            <div className="grid grid-cols-2 gap-4">
              {/* Browser Version Selection Dropdown */}
              {(selectedBrowsers.includes('chrome') || selectedBrowsers.includes('edge') || selectedBrowsers.includes('opera')) && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                    <Chrome className="w-5 h-5" />
                    Chromium Pool Version
                  </label>
                  <div className="relative">
                    <select
                      value={browserVersion}
                      onChange={(e) => setBrowserVersion(e.target.value)}
                      className="w-full bg-[#060e20]/60 border border-[#adc6ff]/30 rounded-xl py-3.5 px-5 text-sm font-bold text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="auto" className="bg-[#0b1326] text-white">Auto (Latest)</option>
                      <option value="150" className="bg-[#0b1326] text-white">Version 150 (Latest)</option>
                      <option value="149" className="bg-[#0b1326] text-white">Version 149</option>
                      <option value="148" className="bg-[#0b1326] text-white">Version 148</option>
                      <option value="147" className="bg-[#0b1326] text-white">Version 147</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {selectedBrowsers.includes('firefox') && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                    <Globe className="w-5 h-5" />
                    Firefox Version
                  </label>
                  <div className="relative">
                    <select
                      value={browserVersion}
                      onChange={(e) => setBrowserVersion(e.target.value)}
                      className="w-full bg-[#060e20]/60 border border-[#adc6ff]/30 rounded-xl py-3.5 px-5 text-sm font-bold text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="auto" className="bg-[#0b1326] text-white">Auto (Latest)</option>
                      <option value="152" className="bg-[#0b1326] text-white">Firefox 152 (Latest)</option>
                      <option value="151" className="bg-[#0b1326] text-white">Firefox 151</option>
                      <option value="150" className="bg-[#0b1326] text-white">Firefox 150</option>
                      <option value="149" className="bg-[#0b1326] text-white">Firefox 149</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {selectedBrowsers.includes('safari') && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                    <Compass className="w-5 h-5" />
                    Safari WebKit Version
                  </label>
                  <div className="relative">
                    <select
                      value={browserVersion}
                      onChange={(e) => setBrowserVersion(e.target.value)}
                      className="w-full bg-[#060e20]/60 border border-[#adc6ff]/30 rounded-xl py-3.5 px-5 text-sm font-bold text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="auto" className="bg-[#0b1326] text-white">Auto (Latest)</option>
                      <option value="605" className="bg-[#0b1326] text-white">Safari 18 (WebKit 605.1.15)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* OS Version Selection Dropdown */}
              {selectedOSs.includes('windows') && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                    <Monitor className="w-5 h-5" />
                    Windows Version
                  </label>
                  <div className="relative">
                    <select
                      value={osVersion}
                      onChange={(e) => setOsVersion(e.target.value)}
                      className="w-full bg-[#060e20]/60 border border-[#adc6ff]/30 rounded-xl py-3.5 px-5 text-sm font-bold text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="auto" className="bg-[#0b1326] text-white">Auto (Latest)</option>
                      <option value="11" className="bg-[#0b1326] text-white">Windows 11</option>
                      <option value="10" className="bg-[#0b1326] text-white">Windows 10</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {selectedOSs.includes('android') && (() => {
                const range = getDeviceOSRange(selectedDeviceModel, deviceManufacturers[0] || 'Pixel');
                return (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                      <Smartphone className="w-5 h-5" />
                      Android Version
                    </label>
                    <div className="relative">
                      <select
                        value={osVersion}
                        onChange={(e) => setOsVersion(e.target.value)}
                        className="w-full bg-[#060e20]/60 border border-[#adc6ff]/30 rounded-xl py-3.5 px-5 text-sm font-bold text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="auto" className="bg-[#0b1326] text-white">Auto (Latest: Android {range.max})</option>
                        {[16, 15, 14, 13, 12, 11, 10].map((v) => {
                          const isSupported = v >= range.launch && v <= range.max;
                          if (!isSupported) return null;
                          return (
                            <option key={v} value={v.toString()} className="bg-[#0b1326] text-white">
                              Android {v}
                            </option>
                          );
                        })}
                        <option value="custom" className="bg-[#0b1326] text-white">Custom</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                    {osVersion === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 space-y-1"
                      >
                        <input
                          type="text"
                          placeholder="e.g. 15.0.0"
                          value={customAndroidVersion}
                          onChange={(e) => setCustomAndroidVersion(e.target.value)}
                          className="w-full bg-[#060e20]/60 border border-[#adc6ff]/20 rounded-xl py-2 px-4 text-sm text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all placeholder:text-[#e2e8f0]/30"
                        />
                      </motion.div>
                    )}
                  </div>
                );
              })()}

              {selectedOSs.includes('ios') && (() => {
                const range = getIosDeviceOSRange(selectedIosModel);
                const versions = [
                  { value: '26', label: 'iOS 26 (Latest)' },
                  { value: '18', label: 'iOS 18' },
                  { value: '17', label: 'iOS 17' },
                  { value: '16', label: 'iOS 16' },
                ];
                return (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                      <Tablet className="w-5 h-5" />
                      iOS Version
                    </label>
                    <div className="relative">
                      <select
                        value={osVersion}
                        onChange={(e) => setOsVersion(e.target.value)}
                        className="w-full bg-[#060e20]/60 border border-[#adc6ff]/30 rounded-xl py-3.5 px-5 text-sm font-bold text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="auto" className="bg-[#0b1326] text-[#acedff]">Auto (Latest)</option>
                        {versions.map((v) => {
                          const vNum = parseInt(v.value, 10);
                          const isSupported = vNum >= range.launch && vNum <= range.max;
                          if (!isSupported) return null;
                          return (
                            <option key={v.value} value={v.value} className="bg-[#0b1326] text-white">
                              {v.label}
                            </option>
                          );
                        })}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Country / Language Profile dropdown */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                <Globe className="w-5 h-5 text-[#acedff]" />
                Country / Language Profile
              </label>
              <div className="relative">
                <select
                  value={settings.locale || 'en-US'}
                  onChange={(e) => {
                    if (onUpdateSettings) {
                      onUpdateSettings({ ...settings, locale: e.target.value });
                    }
                  }}
                  className="w-full bg-[#060e20]/60 border border-[#adc6ff]/30 rounded-xl py-3.5 px-5 text-sm font-bold text-white focus:ring-2 focus:ring-[#acedff]/10 focus:border-[#acedff] outline-none transition-all cursor-pointer appearance-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#0b1326] text-white">
                      {lang.flag} {lang.label} ({lang.name})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* String Density slider */}
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-3 text-sm font-bold tracking-widest text-[#acedff] uppercase">
                  <Sliders className="w-5 h-5" />
                  Batch Generation Count
                </label>
                <span className="text-sm font-bold text-[#acedff] font-mono bg-[#acedff]/10 border border-[#acedff]/20 px-2.5 py-0.5 rounded-lg">
                  {density}
                </span>
              </div>
              
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={density}
                onChange={(e) => setDensity(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none bg-white/10 accent-[#adc6ff] hover:accent-[#4cd7f6] transition-all"
              />

              <div className="flex justify-between text-xs text-[#e2e8f0]/80 font-semibold tracking-wider uppercase font-mono">
                <span>Min: 10</span>
                <span>Max: 500</span>
              </div>
            </div>

          </div>

            {/* Generate Action Button */}
            <div className="pt-4 border-t border-white/10 shrink-0">
              <button
                type="submit"
                disabled={isGenerating}
                className={`relative w-full bg-gradient-to-r from-[#adc6ff] to-[#4d8eff] text-[#002e6a] py-4 rounded-xl font-bold uppercase text-base tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-[#571bc1]/15 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#002e6a]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing Compilation...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Compile Batch List
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Right Column: Real Batch Results (Width: lg:col-span-7) */}
      <section 
        className="lg:col-span-7 lg:flex lg:flex-col lg:gap-4 lg:min-h-0"
        style={isLg && leftPanelHeight ? { height: `${leftPanelHeight}px` } : undefined}
      >
        <header className="mb-1 shrink-0">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            Generated Batch List
          </h2>
          <p className="text-[#e2e8f0]/80 text-sm">
            Dynamic offline-compiled user agents. Filter, copy, and export directly.
          </p>
        </header>

        <ResultsTab
          items={results}
          onClear={onClearResults}
          onShowToast={onShowToast}
        />
      </section>
    </div>
  );
}
