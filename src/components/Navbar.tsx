import React, { useState } from 'react';
import { 
  Database, 
  Menu, 
  X, 
  ShieldCheck, 
  Code2, 
  Terminal, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  isAdminView: boolean;
  onToggleAdminView: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdminView,
  onToggleAdminView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Roadmap', href: '#journey' },
    { label: 'Projects', href: '#projects' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = () => {
    if (isAdminView) {
      onToggleAdminView();
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#080c14]/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <a 
          href="#home" 
          onClick={handleNavClick}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:bg-emerald-500/20 transition-all duration-300">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              Rifat
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 -mt-1 tracking-wider uppercase">
              CSE · Data Science
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        {!isAdminView && (
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Action button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onToggleAdminView}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all duration-200 ${
              isAdminView
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : isAdmin
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40 shadow-sm shadow-emerald-950'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {isAdminView ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                <span>Return to Portfolio</span>
              </>
            ) : (
              <>
                <ShieldCheck className={`w-3.5 h-3.5 ${isAdmin ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{isAdmin ? 'Admin Console' : 'Admin Portal'}</span>
                {isAdmin && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950 animate-pulse"></span>
                )}
              </>
            )}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleAdminView}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            title={isAdminView ? 'Return to site' : 'Admin'}
          >
            <ShieldCheck className={`w-4 h-4 ${isAdmin ? 'text-emerald-400' : 'text-slate-400'}`} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0c121e] px-4 pt-2 pb-5 space-y-2">
          {!isAdminView && (
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={handleNavClick}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onToggleAdminView();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium bg-slate-800/80 text-emerald-300 border border-emerald-500/30"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isAdminView ? 'Back to Public Portfolio' : 'Open Admin Portal'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
