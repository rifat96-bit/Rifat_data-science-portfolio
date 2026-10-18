import React from 'react';
import { 
  ArrowRight, 
  Compass, 
  Github, 
  Linkedin, 
  Mail, 
  Phone,
  MapPin,
  Terminal, 
  Database, 
  Activity, 
  FileCode2, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ProfileSettings } from '../types';

interface HeroProps {
  profile: ProfileSettings;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Introduction & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Status chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CSE Student &bull; Aspiring Data Scientist</span>
            </div>

            {/* Main Name & Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">{profile.fullName || 'Rifat'}</span>.
            </h1>

            {/* Sub-headline */}
            <p className="text-xl sm:text-2xl font-semibold text-slate-200 mb-6 tracking-tight">
              {profile.headline}
            </p>

            {/* Short honest biography */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
              {profile.shortBio}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#journey"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:border-slate-600 transition-all active:scale-[0.98]"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>My Learning Journey</span>
              </a>
            </div>

            {/* Social & Contact Links */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80 w-full">
              <span className="text-xs uppercase tracking-wider font-mono text-slate-500 mr-2">
                Profiles:
              </span>
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-800 transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-800 transition-all"
                  aria-label="Send direct email"
                  title={profile.email}
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-teal-400 hover:border-teal-500/40 hover:bg-slate-800 transition-all"
                  aria-label="Call phone"
                  title={profile.phone}
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              {profile.location && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 ml-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{profile.location}</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Technical Data Dashboard Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#0d1424] border border-slate-800/90 p-6 shadow-2xl backdrop-blur-sm overflow-hidden">
              {/* Top card header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 font-mono text-xs text-slate-400">rifat_learning_env.py</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-[11px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active
                </div>
              </div>

              {/* Terminal Code simulation */}
              <div className="font-mono text-xs text-slate-300 space-y-3 mb-5 bg-[#090d18] p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400">
                  <span className="text-emerald-400">$</span> python -m portfolio.verify_principles
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Degree Track: B.Sc. Computer Science & Eng.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Focus: EDA &bull; Data Wrangling &bull; SQL</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Integrity: Zero unbacked or exaggerated claims</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Methodology: Code + Jupyter + Reproducibility</span>
                  </p>
                </div>
              </div>

              {/* Core technical pillars */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Current Focus
                  </span>
                  <span className="text-sm font-semibold text-emerald-300">
                    Pandas & Relational SQL
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Target Milestone
                  </span>
                  <span className="text-sm font-semibold text-teal-300">
                    Statistical Inference
                  </span>
                </div>
              </div>

              {/* Bottom notice */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Database: Cloud Firestore</span>
                <span className="text-emerald-400">Auth: Google Secured</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
