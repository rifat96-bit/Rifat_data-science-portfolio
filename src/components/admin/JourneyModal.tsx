import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { LearningJourneyItem, JourneyStatus } from '../../types';

interface JourneyModalProps {
  isOpen: boolean;
  item: LearningJourneyItem | null;
  onClose: () => void;
  onSave: (data: Omit<LearningJourneyItem, 'id'>) => Promise<void>;
}

export const JourneyModal: React.FC<JourneyModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    topic: string;
    description: string;
    date: string;
    status: JourneyStatus;
    relatedResources: string;
    githubUrl: string;
    order: number;
  }>({
    title: '',
    topic: '',
    description: '',
    date: '',
    status: 'Planned',
    relatedResources: '',
    githubUrl: '',
    order: 1,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        topic: item.topic || '',
        description: item.description || '',
        date: item.date || '',
        status: item.status || 'Planned',
        relatedResources: item.relatedResources || '',
        githubUrl: item.githubUrl || '',
        order: item.order ?? 1,
      });
    } else {
      setFormData({
        title: '',
        topic: '',
        description: '',
        date: `${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()}`,
        status: 'In Progress',
        relatedResources: '',
        githubUrl: '',
        order: 1,
      });
    }
    setError(null);
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.topic.trim()) {
      setError('Title and Topic are required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title: formData.title.trim(),
        topic: formData.topic.trim(),
        description: formData.description.trim(),
        date: formData.date.trim(),
        status: formData.status,
        relatedResources: formData.relatedResources.trim(),
        githubUrl: formData.githubUrl.trim(),
        order: Number(formData.order) || 1,
      });
      onClose();
    } catch (err: unknown) {
      let msg = 'Failed to save roadmap milestone';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          msg = parsed.error || err.message;
        } catch {
          msg = err.message;
        }
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0c121e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {item ? 'Edit Roadmap Milestone' : 'Add Roadmap Milestone'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
              <span className="break-all">{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-[10px] text-rose-400 hover:text-white shrink-0 uppercase tracking-wider font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Milestone Title *</label>
            <input
              type="text"
              required
              maxLength={300}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Relational Database Modeling with SQL"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Topic / Category *</label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Databases & Querying"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Target Date / Period *</label>
              <input
                type="text"
                required
                maxLength={60}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. Q3 2026 or Current"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as JourneyStatus })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">What is being learned</label>
            <textarea
              rows={3}
              maxLength={2000}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key concepts, goals, and exercises covered..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Related Resources / Books</label>
            <input
              type="text"
              maxLength={1000}
              value={formData.relatedResources}
              onChange={(e) => setFormData({ ...formData, relatedResources: e.target.value })}
              placeholder="Book title, tutorial series, or docs"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">GitHub Practice Repo URL</label>
            <input
              type="url"
              maxLength={500}
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/.../sql-notes"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
            />
          </div>

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
              <span>{saving ? 'Saving...' : item ? 'Update Milestone' : 'Add Milestone'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
