import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Skill, SkillCategory, SkillStatus } from '../../types';

interface SkillModalProps {
  isOpen: boolean;
  skill: Skill | null;
  onClose: () => void;
  onSave: (data: Omit<Skill, 'id'>) => Promise<void>;
}

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  skill,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    category: SkillCategory;
    status: SkillStatus;
    description: string;
    icon: string;
    order: number;
  }>({
    name: '',
    category: 'Programming',
    status: 'Learning',
    description: '',
    icon: 'Terminal',
    order: 1,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        category: skill.category || 'Programming',
        status: skill.status || 'Learning',
        description: skill.description || '',
        icon: skill.icon || 'Terminal',
        order: skill.order ?? 1,
      });
    } else {
      setFormData({
        name: '',
        category: 'Programming',
        status: 'Learning',
        description: '',
        icon: 'Terminal',
        order: 1,
      });
    }
    setError(null);
  }, [skill, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Skill name is required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: formData.name.trim(),
        category: formData.category,
        status: formData.status,
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        order: Number(formData.order) || 1,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0c121e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {skill ? 'Edit Skill' : 'Add Technical Skill'}
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
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Skill Name *</label>
            <input
              type="text"
              required
              maxLength={100}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Pandas, PostgreSQL, Matplotlib"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Programming">Programming</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Databases">Databases</option>
                <option value="Visualization">Visualization</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Learning Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SkillStatus })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Learning">Learning</option>
                <option value="Practicing">Practicing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Context / Notes (Max 500 chars)</label>
            <textarea
              rows={3}
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What topics or libraries in this skill are you working on?"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Sort Priority Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
              <span>{saving ? 'Saving...' : skill ? 'Update Skill' : 'Create Skill'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
