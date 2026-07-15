import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneratorTab from '../components/GeneratorTab';
import { UserAgentItem, EngineSettings } from '../types';

interface UAGeneratorPageProps {
  currentUser: any;
  onGenerate: (
    browser: any,
    os: any,
    device: string,
    density: number,
    randomize: boolean,
    browserVersionOverride?: string,
    osVersionOverride?: string,
    deviceModelOverride?: string,
    socialMedia?: string
  ) => void;
  settings: EngineSettings;
  onUpdateSettings: (settings: EngineSettings) => void;
  onShowToast: (message: string, type?: any) => void;
  results: UserAgentItem[];
  onClearResults: () => void;
}

export default function UAGeneratorPage({
  currentUser,
  onGenerate,
  settings,
  onUpdateSettings,
  onShowToast,
  results,
  onClearResults,
}: UAGeneratorPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/tools')}
        className="group flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase text-white bg-white/5 rounded-xl border border-white/10 hover:bg-[#22d3ee]/10 hover:text-[#22d3ee] hover:border-[#22d3ee]/30 transition-all duration-300 active:scale-95"
      >
        &larr; Back to All Tools
      </button>
      <GeneratorTab
        onGenerate={onGenerate}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onShowToast={onShowToast}
        results={results}
        onClearResults={onClearResults}
      />
    </div>
  );
}
