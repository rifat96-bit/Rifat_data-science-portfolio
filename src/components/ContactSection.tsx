import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  AlertCircle 
} from 'lucide-react';
import { ProfileSettings } from '../types';

interface ContactSectionProps {
  profile: ProfileSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const email = profile.email || 'rifatred283@gmail.com';
  const phone = profile.phone || '01708574065';
  const location = profile.location || 'Dhaka, Bangladesh';
  const github = profile.githubUrl || 'https://github.com/rifat96-bit';
  const linkedin = profile.linkedinUrl || 'https://www.linkedin.com/in/md-raisul-islam-rifat-772852286';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <section id="contact" className="py-20 border-t border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Communication</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get In Touch
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Open to discussing data science, internships, open-source projects, and collaborative studies. Reach out directly.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-5">
          
          {/* Main Dual Cards: Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-[#0c121e] border border-slate-800 flex flex-col justify-between gap-5 shadow-xl hover:border-slate-700 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Primary Email
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white font-mono truncate" title={email}>
                    {email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={handleCopyEmail}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${email}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
                >
                  <span>Compose</span>
                  <Send className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="p-6 rounded-2xl bg-[#0c121e] border border-slate-800 flex flex-col justify-between gap-5 shadow-xl hover:border-slate-700 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Phone / WhatsApp
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white font-mono">
                    {phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={handleCopyPhone}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-teal-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400 transition-colors"
                >
                  <span>Call Directly</span>
                  <Phone className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Location & Social Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Location Card */}
            <div className="p-5 rounded-2xl bg-[#0c121e] border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Location
                </span>
                <p className="text-sm font-bold text-white font-mono">
                  {location}
                </p>
              </div>
            </div>

            {/* GitHub Card */}
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#0c121e] border border-slate-800 hover:border-slate-700 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 group-hover:text-white">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    GitHub
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    @rifat96-bit
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </a>

            {/* LinkedIn Card */}
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#0c121e] border border-slate-800 hover:border-slate-700 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 group-hover:text-emerald-400">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    LinkedIn
                  </h4>
                  <span className="text-xs text-slate-400 font-mono truncate max-w-[150px] block" title={linkedin}>
                    md-raisul-islam-rifat-772852286
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </a>

          </div>

          {/* Technical Note */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              Direct contact mechanisms: Authenticated <code className="text-emerald-400 font-mono">mailto:</code> and <code className="text-teal-400 font-mono">tel:</code> links ensure your messages and calls arrive directly to Md. Raisul Islam Rifat without intermediary mock form submission drops.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
