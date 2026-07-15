import React from 'react';
import { Layers, Facebook, Instagram, MessageCircle, Send, Youtube, Home, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomeFooter() {
  const navigate = useNavigate();

  const socialIcons = [
    { name: 'Facebook', icon: Facebook, color: 'hover:bg-[#1877F2]', url: '#' },
    { name: 'Instagram', icon: Instagram, color: 'hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-500 hover:to-orange-400', url: '#' },
    { name: 'WhatsApp', icon: MessageCircle, color: 'hover:bg-[#25D366]', url: '#' },
    { name: 'Telegram', icon: Send, color: 'hover:bg-[#0088cc]', url: 'https://t.me/M_MuiN' },
    { name: 'YouTube', icon: Youtube, color: 'hover:bg-[#FF0000]', url: '#' },
  ];

  const handleLinkClick = (label: string, path: string) => {
    if (label === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (label === 'Tools') {
      const element = document.getElementById('tools-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(path);
      }
    } else if (label === 'Features') {
      const element = document.getElementById('features');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-[#0b1326] text-[#c2c6d6] pt-16 md:pt-32 pb-6 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 mb-4">
        
        {/* Col 1 */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22d3ee] via-[#3b82f6] to-[#8b5cf6] shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">UA <span className="text-[#22d3ee]">GEN</span></span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            Powerful, secure, client-side web tools for developers and creators. No data stored, no tracking.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {socialIcons.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target={social.url !== '#' ? '_blank' : undefined}
                rel={social.url !== '#' ? 'noopener noreferrer' : undefined}
                className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-transparent group ${social.color}`}
              >
                <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold text-white tracking-widest uppercase">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { label: 'Home', icon: Home, path: '/' },
              { label: 'Features', icon: Zap, path: '/#features' },
              { label: 'Tools', icon: Settings, path: '/tools' },
            ].map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleLinkClick(link.label, link.path)}
                  className="flex items-center gap-2 text-sm hover:text-[#22d3ee] transition-all hover:translate-x-1 cursor-pointer"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold text-white tracking-widest uppercase">Legal</h4>
          <ul className="space-y-3 text-sm">
            {['Privacy Policy', 'Terms of Use', 'Contact Us'].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#22d3ee] transition-all hover:translate-x-1 block">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest">
        <p className="text-slate-500">
          © 2026 UA GEN. All rights reserved.
        </p>
        <p className="text-slate-500">
          Made by <span className="text-[#22d3ee] font-bold">@M_MuiN</span>
        </p>
      </div>
    </footer>
  );
}
