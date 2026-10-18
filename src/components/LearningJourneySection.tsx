import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Github, 
  BookOpen, 
  Milestone,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Layers
} from 'lucide-react';
import { LearningJourneyItem, JourneyStatus } from '../types';

interface LearningJourneyProps {
  journey: LearningJourneyItem[];
}

export const LearningJourneySection: React.FC<LearningJourneyProps> = ({ journey }) => {
  const [filterStatus, setFilterStatus] = useState<'All' | JourneyStatus>('All');

  const filteredJourney = filterStatus === 'All'
    ? journey
    : journey.filter(j => j.status === filterStatus);

  const completedCount = journey.filter(j => j.status === 'Completed').length;
  const inProgressCount = journey.filter(j => j.status === 'In Progress').length;
  const plannedCount = journey.filter(j => j.status === 'Planned').length;

  const getStatusBadge = (status: JourneyStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-mono font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Completed</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold animate-pulse">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Currently Active</span>
          </span>
        );
      case 'Planned':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Planned Next</span>
          </span>
        );
    }
  };

  return (
    <section id="journey" className="py-20 border-t border-slate-800/80 bg-[#070b13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-3 shadow-sm">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>CampusX Data Science Mentorship Program (DSMP)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Learning Journey & Syllabus
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Following the comprehensive 36-week industry mentorship curriculum from Python fundamentals, NumPy, Pandas, and Advanced SQL to statistical inference, feature engineering, and ensemble machine learning.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="max-w-3xl mx-auto mb-12 p-5 rounded-2xl bg-[#0c121e] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Curriculum Progression</p>
              <p className="text-sm font-bold text-white">CampusX DSMP Track (Weeks 1 – 36+)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {completedCount} Completed
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {inProgressCount} Active
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
              {plannedCount} Upcoming
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {(['All', 'Completed', 'In Progress', 'Planned'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                filterStatus === status
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {status === 'All' ? `All Milestones (${journey.length})` : status}
            </button>
          ))}
        </div>

        {/* Timeline container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical spine line */}
          <div className="hidden sm:block absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-500/50 via-emerald-500/50 to-slate-800" />

          <div className="space-y-8">
            {filteredJourney.map((item) => {
              const isCurrent = item.status === 'In Progress';
              const isDone = item.status === 'Completed';

              return (
                <div 
                  key={item.id} 
                  className={`relative flex flex-col sm:flex-row items-start gap-6 group transition-all duration-300 ${
                    isCurrent ? 'scale-[1.01]' : ''
                  }`}
                >
                  {/* Timeline icon node */}
                  <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-2xl items-center justify-center border z-10 transition-all duration-300 shadow-xl bg-[#0d1424]">
                    {isDone ? (
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 ring-4 ring-emerald-500/20">
                        <Clock className="w-5 h-5 animate-spin-slow" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                        <Milestone className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div 
                    className={`flex-1 w-full rounded-2xl p-6 sm:p-7 border transition-all duration-200 ${
                      isCurrent
                        ? 'bg-[#0e1628] border-emerald-500/40 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/20'
                        : isDone
                        ? 'bg-[#0c121e] border-slate-800/90 hover:border-slate-700'
                        : 'bg-[#090e18]/80 border-slate-800/60 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-900 text-teal-300 border border-slate-800">
                          {item.topic}
                        </span>
                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.date}
                        </span>
                      </div>

                      {getStatusBadge(item.status)}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Resources & practice links */}
                    {(item.relatedResources || item.githubUrl) && (
                      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                        {item.relatedResources && (
                          <div className="flex items-center gap-1.5 max-w-md">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="italic truncate" title={item.relatedResources}>
                              {item.relatedResources}
                            </span>
                          </div>
                        )}

                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-emerald-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto font-mono text-[11px]"
                          >
                            <Github className="w-3 h-3" />
                            <span>Study Repo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
