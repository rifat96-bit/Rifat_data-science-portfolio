import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Layers } from 'lucide-react';
import { Project } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (data: Omit<Project, 'id'>) => Promise<void>;
  onPreview: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave,
  onPreview,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    problemStatement: '',
    datasetSource: '',
    toolsStr: '',
    methodology: '',
    keyFindings: '',
    category: 'Data Analysis',
    thumbnailUrl: '',
    githubUrl: '',
    liveUrl: '',
    notebookUrl: '',
    creationDate: '',
    featured: false,
    published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        shortDescription: project.shortDescription || '',
        fullDescription: project.fullDescription || '',
        problemStatement: project.problemStatement || '',
        datasetSource: project.datasetSource || '',
        toolsStr: project.tools ? project.tools.join(', ') : '',
        methodology: project.methodology || '',
        keyFindings: project.keyFindings || '',
        category: project.category || 'Data Analysis',
        thumbnailUrl: project.thumbnailUrl || '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        notebookUrl: project.notebookUrl || '',
        creationDate: project.creationDate || '',
        featured: !!project.featured,
        published: project.published ?? true,
      });
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        problemStatement: '',
        datasetSource: '',
        toolsStr: 'Python, Pandas, NumPy, Matplotlib',
        methodology: '',
        keyFindings: '',
        category: 'Data Analysis',
        thumbnailUrl: '',
        githubUrl: '',
        liveUrl: '',
        notebookUrl: '',
        creationDate: `${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()}`,
        featured: false,
        published: true,
      });
    }
    setError(null);
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    if (!formData.shortDescription.trim()) {
      setError('Short summary is required');
      return;
    }

    const tools = formData.toolsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      await onSave({
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription.trim(),
        problemStatement: formData.problemStatement.trim(),
        datasetSource: formData.datasetSource.trim(),
        tools,
        methodology: formData.methodology.trim(),
        keyFindings: formData.keyFindings.trim(),
        category: formData.category.trim(),
        thumbnailUrl: formData.thumbnailUrl.trim(),
        githubUrl: formData.githubUrl.trim(),
        liveUrl: formData.liveUrl.trim(),
        notebookUrl: formData.notebookUrl.trim(),
        creationDate: formData.creationDate.trim(),
        featured: formData.featured,
        published: formData.published,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerPreview = () => {
    const tools = formData.toolsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const tempProject: Project = {
      id: project?.id || 'preview_id',
      title: formData.title || 'Untitled Project Preview',
      shortDescription: formData.shortDescription || 'Brief description goes here...',
      fullDescription: formData.fullDescription,
      problemStatement: formData.problemStatement,
      datasetSource: formData.datasetSource,
      tools,
      methodology: formData.methodology,
      keyFindings: formData.keyFindings,
      category: formData.category,
      thumbnailUrl: formData.thumbnailUrl,
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      notebookUrl: formData.notebookUrl,
      creationDate: formData.creationDate,
      featured: formData.featured,
      published: formData.published,
    };

    onPreview(tempProject);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#0c121e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0c121e]/95 border-b border-slate-800 backdrop-blur-md">
          <div>
            <h3 className="text-lg font-bold text-white">
              {project ? 'Edit Project' : 'Add New Project'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Cloud Firestore Schema &bull; Validated
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preview</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Project Title *</label>
              <input
                type="text"
                required
                maxLength={150}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Academic Exam Performance Analysis"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Data Analysis">Data Analysis</option>
                <option value="Databases & SQL">Databases & SQL</option>
                <option value="Visualization">Visualization</option>
                <option value="IoT & Embedded">IoT & Embedded</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Programming">Programming</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Short Summary * (Max 300 chars)</label>
            <textarea
              required
              rows={2}
              maxLength={300}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="High-level overview visible on the card..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Tools & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tools & Technologies (Comma-separated)</label>
              <input
                type="text"
                value={formData.toolsStr}
                onChange={(e) => setFormData({ ...formData, toolsStr: e.target.value })}
                placeholder="Python, Pandas, SQL, Seaborn"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Creation Date</label>
              <input
                type="text"
                value={formData.creationDate}
                onChange={(e) => setFormData({ ...formData, creationDate: e.target.value })}
                placeholder="e.g. May 2026"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Problem Statement & Dataset Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Problem Statement</label>
              <textarea
                rows={3}
                maxLength={2000}
                value={formData.problemStatement}
                onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                placeholder="What question was this analysis trying to solve?"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Dataset & Source</label>
              <textarea
                rows={3}
                maxLength={1000}
                value={formData.datasetSource}
                onChange={(e) => setFormData({ ...formData, datasetSource: e.target.value })}
                placeholder="Dataset origin, shape, sample size..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Methodology & Key Findings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Methodology & Steps</label>
              <textarea
                rows={3}
                maxLength={3000}
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                placeholder="Data cleaning -> Feature transformation -> EDA..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Key Findings & Results</label>
              <textarea
                rows={3}
                maxLength={3000}
                value={formData.keyFindings}
                onChange={(e) => setFormData({ ...formData, keyFindings: e.target.value })}
                placeholder="Observed correlation, metric benchmark, conclusion..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Description / Notes (Optional)</label>
            <textarea
              rows={4}
              maxLength={5000}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              placeholder="In-depth narrative of the study..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Thumbnail Image URL</label>
              <input
                type="url"
                maxLength={500}
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">GitHub Repository URL</label>
              <input
                type="url"
                maxLength={500}
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Notebook URL (Jupyter/Colab/Kaggle)</label>
              <input
                type="url"
                maxLength={500}
                value={formData.notebookUrl}
                onChange={(e) => setFormData({ ...formData, notebookUrl: e.target.value })}
                placeholder="https://github.com/.../notebook.ipynb"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Live Demo URL (Optional)</label>
              <input
                type="url"
                maxLength={500}
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs font-mono"
              />
            </div>
          </div>

          {/* Visibility and Featured flags */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-slate-200">
                Published (Visible on public portfolio)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-amber-300">
                Mark as Featured Project
              </span>
            </label>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving to Firestore...' : project ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
