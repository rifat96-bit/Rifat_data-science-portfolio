import React from 'react';
import { BookOpen, Code2, GraduationCap, Target, Cpu, CheckCircle } from 'lucide-react';
import { ProfileSettings } from '../types';

interface AboutSectionProps {
  profile: ProfileSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="py-20 border-t border-slate-800/80 bg-[#070b13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background & Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About Me
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            A transparent look into who I am, what I study in Computer Science, and how I approach learning Data Science.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-base">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <span>The Student Journey</span>
              </h3>
              
              <p className="text-slate-300">
                {profile.fullAbout || profile.shortBio}
              </p>

              <p className="text-slate-300">
                In my computer science coursework, I developed an appreciation for algorithmic efficiency and structured thinking. When I started working with real-world datasets, I realized how critical clean data preparation, careful statistical reasoning, and clear visualizations are before attempting any machine learning model.
              </p>

              <p className="text-slate-300">
                Rather than jumping directly to black-box models or claiming unearned titles, I am dedicating my time to mastering foundational pillars: writing clean Python scripts, mastering Pandas and NumPy, writing analytical SQL queries, and understanding the statistical assumptions behind algorithms.
              </p>
            </div>

            {/* What you can expect from me */}
            <div className="p-6 rounded-2xl bg-emerald-950/10 border border-emerald-500/20">
              <h4 className="text-sm font-mono uppercase tracking-wider text-emerald-400 font-bold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>My Core Principles as a Learner</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Honest documentation of skills without inflated claims</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Reproducible analysis with public GitHub code and notebooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Focusing on business & practical problem understanding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Consistent daily practice and roadmap progression</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Academic Highlights & Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Academic Profile</span>
              </h4>
              
              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Field of Study</span>
                  <span className="text-white font-semibold">Computer Science & Eng.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Current Status</span>
                  <span className="text-emerald-400 font-semibold">Undergraduate Student</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Career Trajectory</span>
                  <span className="text-cyan-400 font-semibold">Data Science & Analytics</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Mentorship Track</span>
                  <span className="text-emerald-400 font-semibold font-mono text-[11px]">CampusX DSMP (36 Wks)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Primary Language</span>
                  <span className="text-teal-300 font-semibold">Python (v3.11+)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Currently Reading & Mentorship Materials</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Active textbooks and core curriculum guiding my daily problem-solving:
              </p>
              <ul className="text-xs space-y-2 text-slate-300 font-mono">
                <li className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  &bull; <span className="text-emerald-300">CampusX DSMP Syllabus</span> by Nitish Singh (Python to Machine Learning)
                </li>
                <li className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  &bull; <span className="text-teal-300">Python for Data Analysis</span> by Wes McKinney (Pandas creator)
                </li>
                <li className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  &bull; <span className="text-cyan-300">Practical Statistics for Data Scientists</span> by Peter Bruce
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
