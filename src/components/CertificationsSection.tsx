import React from 'react';
import { Award, ExternalLink, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Certification } from '../types';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  return (
    <section id="certifications" className="py-20 border-t border-slate-800/80 bg-[#070b13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Courses & Certifications
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Documented coursework, specialized micro-courses, and technical foundations completed alongside university studies.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group p-6 rounded-2xl bg-[#0c121e] border border-slate-800/90 hover:border-slate-700 hover:bg-[#0f1728] transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div className="space-y-1 flex-1">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    {cert.issuingOrg}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {cert.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Issued: {cert.issueDate}</span>
                  </div>
                </div>
              </div>

              {cert.credentialUrl && (
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-end">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
