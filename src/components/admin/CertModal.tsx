import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Certification } from '../../types';

interface CertModalProps {
  isOpen: boolean;
  cert: Certification | null;
  onClose: () => void;
  onSave: (data: Omit<Certification, 'id'>) => Promise<void>;
}

export const CertModal: React.FC<CertModalProps> = ({
  isOpen,
  cert,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    issuingOrg: '',
    issueDate: '',
    credentialUrl: '',
    imageUrl: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cert) {
      setFormData({
        name: cert.name || '',
        issuingOrg: cert.issuingOrg || '',
        issueDate: cert.issueDate || '',
        credentialUrl: cert.credentialUrl || '',
        imageUrl: cert.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        issuingOrg: '',
        issueDate: `${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()}`,
        credentialUrl: '',
        imageUrl: '',
      });
    }
    setError(null);
  }, [cert, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.issuingOrg.trim() || !formData.issueDate.trim()) {
      setError('Name, Organization, and Date are required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: formData.name.trim(),
        issuingOrg: formData.issuingOrg.trim(),
        issueDate: formData.issueDate.trim(),
        credentialUrl: formData.credentialUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save credential');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0c121e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {cert ? 'Edit Certification' : 'Add Certification / Course'}
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
            <label className="text-xs font-semibold text-slate-300">Course / Certification Name *</label>
            <input
              type="text"
              required
              maxLength={150}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Python for Data Science"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Issuing Organization *</label>
              <input
                type="text"
                required
                maxLength={150}
                value={formData.issuingOrg}
                onChange={(e) => setFormData({ ...formData, issuingOrg: e.target.value })}
                placeholder="e.g. Google / Coursera / IBM"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Issue Date *</label>
              <input
                type="text"
                required
                maxLength={60}
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                placeholder="e.g. May 2026"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Verification URL</label>
            <input
              type="url"
              maxLength={500}
              value={formData.credentialUrl}
              onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              placeholder="https://coursera.org/verify/..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Badge / Image URL (Optional)</label>
            <input
              type="url"
              maxLength={500}
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
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
              <span>{saving ? 'Saving...' : cert ? 'Update Record' : 'Add Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
