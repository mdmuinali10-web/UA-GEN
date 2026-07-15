import { Layers, Image, ArrowRight, Briefcase } from 'lucide-react';

interface AllToolsPageProps {
  onSelectTool: (tool: 'ua-gen' | 'photo-resize' | 'offer-directory') => void;
  currentUser: { name: string; email: string; role: string } | null;
}

export default function AllToolsPage({ onSelectTool, currentUser }: AllToolsPageProps) {
  const tools = [
    {
      id: 'ua-gen' as const,
      name: 'UA Generator',
      description: 'Generate bulk, realistic, randomized User Agent strings across browsers, devices, and OS with advanced customization.',
      icon: Layers,
      color: 'from-[#22d3ee] via-[#3b82f6] to-[#8b5cf6]',
      glowColor: 'rgba(34,211,238,0.25)',
      accentColor: 'text-[#22d3ee]',
      glowBorder: 'group-hover:border-[#22d3ee]/30',
      glowBg: 'bg-[#22d3ee]/20',
      glowDot: 'group-hover:bg-[#22d3ee]',
      category: 'GENERATOR'
    },
    {
      id: 'photo-resize' as const,
      name: 'Photo Resize & Convert',
      description: 'Quickly resize, convert, and compress JPG, PNG, WebP, GIF, or HEIC files locally in your browser. Fast & secure.',
      icon: Image,
      color: 'from-[#d946ef] via-[#8b5cf6] to-[#3b82f6]',
      glowColor: 'rgba(217,70,239,0.25)',
      accentColor: 'text-[#d946ef]',
      glowBorder: 'group-hover:border-[#d946ef]/30',
      glowBg: 'bg-[#d946ef]/20',
      glowDot: 'group-hover:bg-[#d946ef]',
      category: 'UTILITY'
    },
    {
      id: 'offer-directory' as const,
      name: 'Offer Directory',
      description: 'Manage and preview CPA/affiliate landing pages. Store HTML codes, categorize, and preview directly in your browser.',
      icon: Briefcase,
      color: 'from-[#f59e0b] via-[#ef4444] to-[#ec4899]',
      glowColor: 'rgba(245,158,11,0.25)',
      accentColor: 'text-[#f59e0b]',
      glowBorder: 'group-hover:border-[#f59e0b]/30',
      glowBg: 'bg-[#f59e0b]/20',
      glowDot: 'group-hover:bg-[#f59e0b]',
      category: 'DIRECTORY'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto mb-12 md:mb-24 lg:mb-40 xl:mb-56">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-white/4 to-white/[0.01] border border-white/5 p-3.5 sm:p-4 shadow-lg">
        <div className="absolute top-0 right-0 w-[20%] h-full bg-gradient-to-l from-[#22d3ee]/5 to-transparent filter blur-xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col space-y-1">
          <div>
            <span className="text-[8px] bg-[#22d3ee]/10 text-[#22d3ee] px-2 py-0.5 rounded border border-[#22d3ee]/15 font-mono tracking-widest uppercase font-bold">
              System Panel
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent font-extrabold">{currentUser?.name || 'User'}</span>!
          </h2>
          <p className="text-[11px] text-[#c2c6d6]/60 leading-normal">
            Select a highly optimized web utility tool from the workspace repository below. All modules execute securely on the client side.
          </p>
        </div>
      </div>

      {/* Compact Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#0b1326]/50 border border-white/[0.04] p-5 cursor-pointer transition-all duration-300 hover:border-white/[0.08] hover:translate-y-[-2px] shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              style={{
                boxShadow: `inset 0 1px 1px rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.3)`
              }}
              id={`tool-card-${tool.id}`}
            >
              {/* Card Glow Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 140px at 100% 0%, ${tool.glowColor}, transparent 100%)`
                }}
              />

              <div>
                {/* Header Row: Icon & Interactive Glowing Dot */}
                <div className="flex items-start justify-between gap-4">
                  {/* Squircle App Icon */}
                  <div className={`flex items-center justify-center w-14 h-14 rounded-[20px] bg-gradient-to-br ${tool.color} shadow-[0_6px_16px_-4px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:scale-105`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Radar Target Dot on Upper Right */}
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border border-white/5 transition-all duration-300 ${tool.glowBorder}`}>
                    {/* Outer Glow Aura */}
                    <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-110 blur-sm transition-all duration-500 ${tool.glowBg}`} />
                    {/* Center Dot */}
                    <div className={`w-2 h-2 rounded-full bg-white/20 transition-all duration-300 ${tool.glowDot}`} />
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className={`text-lg font-bold text-white group-hover:${tool.accentColor} transition-colors mt-5`}>
                  {tool.name}
                </h3>
                <p className="text-xs text-[#c2c6d6]/60 mt-1.5 leading-relaxed min-h-[40px] line-clamp-2">
                  {tool.description}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="mt-5 border-t border-white/[0.04] pt-3.5 flex items-center justify-between">
                <span className="text-[10px] text-[#c2c6d6]/30 font-bold font-mono tracking-wider">
                  {tool.category}
                </span>

                <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#c2c6d6]/50 group-hover:text-white transition-colors">
                  Use Tool
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
