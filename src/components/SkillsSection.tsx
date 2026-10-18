import React, { useState } from 'react';
import { 
  Code2, 
  Binary, 
  Table, 
  Database, 
  BarChart3, 
  TrendingUp, 
  GitBranch, 
  BookOpen, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Flame,
  Filter
} from 'lucide-react';
import { Skill, SkillCategory, SkillStatus } from '../types';

interface SkillsSectionProps {
  skills: Skill[];
}

const CATEGORIES: ('All' | SkillCategory)[] = [
  'All',
  'Programming',
  'Data Analysis',
  'Databases',
  'Visualization',
  'Machine Learning',
  'Tools',
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[11px] font-mono font-medium">
            <CheckCircle2 className="w-3 h-3 text-purple-400" />
            <span>Completed Base</span>
          </span>
        );
      case 'Practicing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-medium">
            <Flame className="w-3 h-3 text-emerald-400" />
            <span>Practicing</span>
          </span>
        );
      case 'Learning':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-medium">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Currently Learning</span>
          </span>
        );
    }
  };

  const getCategoryIcon = (category: SkillCategory) => {
    switch (category) {
      case 'Programming':
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case 'Data Analysis':
        return <Table className="w-4 h-4 text-teal-400" />;
      case 'Databases':
        return <Database className="w-4 h-4 text-cyan-400" />;
      case 'Visualization':
        return <BarChart3 className="w-4 h-4 text-indigo-400" />;
      case 'Machine Learning':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'Tools':
        return <GitBranch className="w-4 h-4 text-amber-400" />;
      default:
        return <Cpu className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 border-t border-slate-800/80 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & Learning Status
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            A real-world breakdown of technologies I work with. Categorized with transparent learning statuses rather than arbitrary percentage bars.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group p-5 rounded-2xl bg-[#0c121e] border border-slate-800/90 hover:border-slate-700 hover:bg-[#0f1728] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                      {getCategoryIcon(skill.category)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {skill.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  {getStatusBadge(skill.status)}
                </div>

                {skill.description && (
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2">
                    {skill.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Verified in Academic / Projects</span>
                <span className="text-slate-400">Status: {skill.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Honest Note Banner */}
        <div className="mt-12 p-4 rounded-xl bg-slate-900/60 border border-slate-800 max-w-2xl mx-auto text-center text-xs text-slate-400 font-mono">
          <p>
            Notice: I do not show "90% Python" or "85% SQL" meters because skill in software and data cannot be quantified by arbitrary percentages. I show concrete status: what I have completed, what I am actively practicing, and what I am currently learning.
          </p>
        </div>

      </div>
    </section>
  );
};
