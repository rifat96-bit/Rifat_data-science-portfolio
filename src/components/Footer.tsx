import React from 'react';
import { Terminal, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  onToggleAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onToggleAdmin }) => {
  const { isAdmin } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#060910] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">
                Rifat &bull; Portfolio & Roadmap
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                CSE Undergraduate &bull; Aspiring Data Scientist
              </p>
            </div>
          </div>

          {/* Quick links & Back to Top */}
          <div className="flex items-center gap-6">
            <button
              onClick={onToggleAdmin}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Admin Console' : 'Admin Sign In'}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Scroll to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Credits & Integrity */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-mono text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Rifat. Built with React, TypeScript, Tailwind CSS, & Cloud Firestore.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Zero-fabricated metrics &bull; Real reproducible learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
