import React from 'react';
import { 
  X, 
  Github, 
  ExternalLink, 
  FileCode2, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#0d1424] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
      >
        {/* Modal Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0d1424]/95 border-b border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              {project.category}
            </span>
            {project.creationDate && (
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {project.creationDate}
              </span>
            )}
            {!project.published && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Draft / Private Preview
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close project view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          
          {/* Title & Short Summary */}
          <div>
            <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {project.title}
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Thumbnail banner if present */}
          {project.thumbnailUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video max-h-72 w-full">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1424] via-transparent to-transparent opacity-80" />
            </div>
          )}

          {/* Tools & Tech Chips */}
          {project.tools && project.tools.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Technologies & Libraries</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          {project.fullDescription && (
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h3 className="text-sm font-mono uppercase tracking-wider text-emerald-400 mb-2 font-bold">
                Detailed Context & Background
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                {project.fullDescription}
              </p>
            </div>
          )}

          {/* Grid: Problem Statement & Dataset Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {project.problemStatement && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Problem Statement</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.problemStatement}
                </p>
              </div>
            )}

            {project.datasetSource && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>Dataset & Data Source</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.datasetSource}
                </p>
              </div>
            )}
          </div>

          {/* Methodology & Analytical Steps */}
          {project.methodology && (
            <div className="p-5 rounded-2xl bg-[#090e18] border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>Methodology & Analytical Pipeline</span>
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                {project.methodology}
              </p>
            </div>
          )}

          {/* Key Findings & Insights */}
          {project.keyFindings && (
            <div className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-500/30 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Key Findings & Quantitative Learnings</span>
              </h4>
              <p className="text-sm text-emerald-200/90 leading-relaxed whitespace-pre-line">
                {project.keyFindings}
              </p>
            </div>
          )}

          {/* Action Links Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View GitHub Code</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            )}

            {project.notebookUrl && (
              <a
                href={project.notebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                <FileCode2 className="w-4 h-4" />
                <span>Open Notebook</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs sm:text-sm font-bold hover:bg-emerald-400 transition-colors"
              >
                <span>Live Interactive Demo</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
