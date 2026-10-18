import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  RefreshCw, 
  Database, 
  FolderGit2, 
  Compass, 
  Award, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  Project, 
  Skill, 
  LearningJourneyItem, 
  Certification, 
  ProfileSettings 
} from '../../types';
import { 
  getProjects, 
  getSkills, 
  getLearningJourney, 
  getCertifications, 
  getProfileSettings,
  createProject,
  updateProject,
  deleteProject,
  createSkill,
  updateSkill,
  deleteSkill,
  createJourneyItem,
  updateJourneyItem,
  deleteJourneyItem,
  createCertification,
  updateCertification,
  deleteCertification,
  updateProfileSettings,
  seedInitialData,
  isDatabaseSeeded
} from '../../services/portfolioService';
import { ProjectModal } from './ProjectModal';
import { SkillModal } from './SkillModal';
import { JourneyModal } from './JourneyModal';
import { CertModal } from './CertModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ProjectDetailModal } from '../ProjectDetailModal';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type TabType = 'overview' | 'projects' | 'skills' | 'journey' | 'certifications' | 'profile';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToSite,
  onShowToast,
}) => {
  const { user, isAdmin, loading: authLoading, signInWithGoogle, signOut, authError, authorizedAdminEmail } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loadingData, setLoadingData] = useState(false);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [journey, setJourney] = useState<LearningJourneyItem[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);

  // Modals state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [journeyModalOpen, setJourneyModalOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<LearningJourneyItem | null>(null);

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'project' | 'skill' | 'journey' | 'cert';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'project',
    id: '',
    title: '',
  });
  const [deleting, setDeleting] = useState(false);

  // Profile form local state
  const [profileFormData, setProfileFormData] = useState<ProfileSettings>({
    fullName: '',
    headline: '',
    shortBio: '',
    fullAbout: '',
    githubUrl: '',
    linkedinUrl: '',
    email: '',
    phone: '',
    location: '',
    kaggleUrl: '',
    resumeUrl: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [isDbInitialized, setIsDbInitialized] = useState<boolean>(true);

  // Fetch all admin data
  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const initialized = await isDatabaseSeeded();
      setIsDbInitialized(initialized);

      const [projList, skillList, journeyList, certList, profileData] = await Promise.all([
        getProjects(true), // isAdmin = true to include drafts
        getSkills(),
        getLearningJourney(),
        getCertifications(),
        getProfileSettings(),
      ]);

      setProjects(projList);
      setSkills(skillList);
      setJourney(journeyList);
      setCerts(certList);
      setProfile(profileData);
      setProfileFormData(profileData);
    } catch (err) {
      console.error('Error loading admin data:', err);
      onShowToast('Failed to load portfolio records from Firestore', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // Handle seeding database with default data safely without overwriting user data
  const handleSeedData = async () => {
    const confirmPrompt = isDbInitialized
      ? 'Synchronize missing default records with Cloud Firestore? Existing user-created projects, skills, milestones, and profile fields will NOT be overwritten or deleted.'
      : 'Populate Cloud Firestore with initial verified sample projects, skills, roadmap items, and certifications. Proceed?';

    if (!window.confirm(confirmPrompt)) {
      return;
    }
    setLoadingData(true);
    try {
      const res = await seedInitialData();
      if (res.success) {
        setIsDbInitialized(true);
        onShowToast(res.message, 'success');
        await loadAdminData();
      } else {
        onShowToast(`Operation failed: ${res.message}`, 'error');
      }
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : 'Database operation failed', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  // ==========================================
  // PROJECT CRUD HANDLERS
  // ==========================================
  const handleSaveProject = async (data: Omit<Project, 'id'>) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
        onShowToast(`Updated project "${data.title}"`, 'success');
      } else {
        await createProject(data);
        onShowToast(`Created project "${data.title}"`, 'success');
      }
      setProjectModalOpen(false);
      setEditingProject(null);
      await loadAdminData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save project';
      onShowToast(`Save failed: ${msg}`, 'error');
      throw err;
    }
  };

  const handleTogglePublishProject = async (proj: Project) => {
    try {
      const newStatus = !proj.published;
      await updateProject(proj.id, { published: newStatus });
      onShowToast(`Project marked as ${newStatus ? 'Published' : 'Draft'}`, 'success');
      await loadAdminData();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : 'Update failed', 'error');
    }
  };

  const handleToggleFeaturedProject = async (proj: Project) => {
    try {
      const newStatus = !proj.featured;
      await updateProject(proj.id, { featured: newStatus });
      onShowToast(`Project ${newStatus ? 'marked as Featured' : 'unfeatured'}`, 'success');
      await loadAdminData();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : 'Update failed', 'error');
    }
  };

  // ==========================================
  // SKILL CRUD HANDLERS
  // ==========================================
  const handleSaveSkill = async (data: Omit<Skill, 'id'>) => {
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, data);
        onShowToast(`Updated skill "${data.name}"`, 'success');
      } else {
        await createSkill(data);
        onShowToast(`Created skill "${data.name}"`, 'success');
      }
      setSkillModalOpen(false);
      setEditingSkill(null);
      await loadAdminData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save skill';
      onShowToast(`Skill save failed: ${msg}`, 'error');
      throw err;
    }
  };

  // ==========================================
  // JOURNEY CRUD HANDLERS
  // ==========================================
  const handleSaveJourney = async (data: Omit<LearningJourneyItem, 'id'>) => {
    try {
      if (editingJourney) {
        await updateJourneyItem(editingJourney.id, data);
        onShowToast(`Updated roadmap milestone "${data.title}"`, 'success');
      } else {
        await createJourneyItem(data);
        onShowToast(`Added roadmap milestone "${data.title}"`, 'success');
      }
      setJourneyModalOpen(false);
      setEditingJourney(null);
      await loadAdminData();
    } catch (err: unknown) {
      console.error('Failed to save milestone:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save milestone';
      onShowToast(`Milestone update error: ${msg}`, 'error');
      throw err;
    }
  };

  // ==========================================
  // CERT CRUD HANDLERS
  // ==========================================
  const handleSaveCert = async (data: Omit<Certification, 'id'>) => {
    try {
      if (editingCert) {
        await updateCertification(editingCert.id, data);
        onShowToast(`Updated certification "${data.name}"`, 'success');
      } else {
        await createCertification(data);
        onShowToast(`Added certification "${data.name}"`, 'success');
      }
      setCertModalOpen(false);
      setEditingCert(null);
      await loadAdminData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save certification';
      onShowToast(`Certification save failed: ${msg}`, 'error');
      throw err;
    }
  };

  // ==========================================
  // PROFILE SETTINGS SAVE HANDLER
  // ==========================================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfileSettings(profileFormData);
      onShowToast('Public profile and contact settings updated in Firestore!', 'success');
      await loadAdminData();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // DELETION EXECUTION
  // ==========================================
  const handleConfirmDelete = async () => {
    const { type, id } = deleteModalState;
    setDeleting(true);
    try {
      if (type === 'project') {
        setProjects(prev => prev.filter(p => p.id !== id));
        await deleteProject(id);
        onShowToast('Project deleted', 'success');
      } else if (type === 'skill') {
        setSkills(prev => prev.filter(s => s.id !== id));
        await deleteSkill(id);
        onShowToast('Skill removed', 'success');
      } else if (type === 'journey') {
        setJourney(prev => prev.filter(j => j.id !== id));
        await deleteJourneyItem(id);
        onShowToast('Roadmap milestone removed', 'success');
      } else if (type === 'cert') {
        setCerts(prev => prev.filter(c => c.id !== id));
        await deleteCertification(id);
        onShowToast('Certification removed', 'success');
      }
      setDeleteModalState({ ...deleteModalState, isOpen: false });
      await loadAdminData();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // UNAUTHENTICATED OR UNAUTHORIZED STATE
  // ==========================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-6 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="font-mono text-sm">Verifying administrative security credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0c121e] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Admin Sign-In</h2>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Secured by Firebase Authentication & Firestore ABAC
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 text-left space-y-2">
            <p className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Configured Admin Email:</span>
            </p>
            <p className="font-mono text-slate-300 pl-6 break-all">
              {authorizedAdminEmail}
            </p>
            <p className="text-slate-400 pl-6 text-[11px] leading-relaxed">
              Sign in with your authorized Google account to create, edit, draft, and manage portfolio content.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left">
              {authError}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={onBackToSite}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0c121e] border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Access Denied</h2>
            <p className="text-xs text-rose-400 mt-2 font-mono">
              Insufficient Administrative Permissions
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 text-left space-y-2">
            <p>
              Signed in as: <strong className="text-white font-mono">{user.email}</strong>
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              This account is not in the authorized administrator whitelist (<code className="text-emerald-400">{authorizedAdminEmail}</code> or Firestore <code className="text-slate-300">/admins/{user.uid}</code>). Firestore Security Rules prevent unauthorized modifications.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => signOut()}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Switch Account</span>
            </button>

            <button
              onClick={onBackToSite}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHORIZED ADMIN VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200">
      
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0c121e]/90 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white text-sm">Portfolio Management Console</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Admin Active
              </span>
            </div>
          </div>

          {/* User info & Sign out */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs font-mono text-slate-400 truncate max-w-xs">
              {user.email}
            </span>

            <button
              onClick={handleSeedData}
              disabled={loadingData}
              title={isDbInitialized ? "Synchronize missing baseline records without overwriting custom data" : "Initialize Firestore with verified records"}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-teal-300 hover:bg-slate-800 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>{isDbInitialized ? 'Sync Missing Defaults' : 'Seed Initial Database'}</span>
            </button>

            <button
              onClick={() => signOut()}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/30 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Skills ({skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('journey')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'journey'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Learning Roadmap ({journey.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'certifications'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certifications ({certs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Public Profile & Links</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          
          {/* ========================================== */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Metric stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0c121e] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>Total Projects</span>
                    <FolderGit2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{projects.length}</p>
                  <p className="text-[11px] font-mono text-emerald-400">
                    {projects.filter(p => p.published).length} Published &bull; {projects.filter(p => !p.published).length} Drafts
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c121e] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>Technical Skills</span>
                    <Code2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{skills.length}</p>
                  <p className="text-[11px] font-mono text-cyan-400">
                    {skills.filter(s => s.status === 'Practicing').length} Practicing &bull; {skills.filter(s => s.status === 'Learning').length} Learning
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c121e] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>Roadmap Milestones</span>
                    <Compass className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{journey.length}</p>
                  <p className="text-[11px] font-mono text-indigo-400">
                    {journey.filter(j => j.status === 'Completed').length} Done &bull; {journey.filter(j => j.status === 'In Progress').length} Active
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c121e] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>Certificates</span>
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{certs.length}</p>
                  <p className="text-[11px] font-mono text-purple-400">
                    Documented Credentials
                  </p>
                </div>
              </div>

              {/* Firestore Security & Status banner */}
              <div className="p-6 rounded-2xl bg-[#0c121e] border border-emerald-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Cloud Firestore Live Connection</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Security Rules: Attribute-Based Access Control (ABAC) Active
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSeedData}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isDbInitialized ? 'Sync Missing Defaults (Safe)' : 'Seed Initial Database'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  Public visitors can only read published projects and public portfolio elements. Unauthenticated writes and draft snooping are mathematically rejected at the database engine level by <code className="text-emerald-400">firestore.rules</code>.
                </p>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-left group transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm group-hover:text-emerald-400">Add New Project</span>
                    <Plus className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">Create an analysis study, configure dataset source and methodology.</p>
                </button>

                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setSkillModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left group transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm group-hover:text-cyan-400">Add Skill</span>
                    <Plus className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-xs text-slate-400">Document a programming tool or library with honest learning status.</p>
                </button>

                <button
                  onClick={() => {
                    setEditingJourney(null);
                    setJourneyModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 text-left group transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm group-hover:text-indigo-400">Add Roadmap Milestone</span>
                    <Plus className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-xs text-slate-400">Update timeline with upcoming topics or completed exercises.</p>
                </button>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: PROJECTS MANAGEMENT */}
          {/* ========================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Projects Management</h3>
                  <p className="text-xs text-slate-400">
                    Create, edit, toggle drafts, feature, or inspect detailed studies.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0c121e] border border-slate-800">
                  <p className="text-slate-300 font-semibold mb-2">No projects in database</p>
                  <button
                    onClick={handleSeedData}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Click here to seed sample projects
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#0c121e] border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Project Title</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Featured</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {projects.map((proj) => (
                          <tr key={proj.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {proj.thumbnailUrl ? (
                                  <img
                                    src={proj.thumbnailUrl}
                                    alt={proj.title}
                                    className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 shrink-0">
                                    <FolderGit2 className="w-5 h-5" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-white text-sm">{proj.title}</p>
                                  <p className="text-[11px] text-slate-400 truncate max-w-xs">{proj.shortDescription}</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 font-mono text-slate-400">
                              {proj.category}
                            </td>

                            <td className="px-4 py-3 font-mono text-slate-400">
                              {proj.creationDate || '—'}
                            </td>

                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleTogglePublishProject(proj)}
                                title="Click to toggle publish status"
                                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-colors ${
                                  proj.published
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {proj.published ? 'Published' : 'Draft'}
                              </button>
                            </td>

                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleToggleFeaturedProject(proj)}
                                title="Click to toggle featured status"
                                className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                              >
                                <Star
                                  className={`w-4 h-4 mx-auto ${
                                    proj.featured ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                                  }`}
                                />
                              </button>
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setPreviewProject(proj)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                                  title="Preview Analysis View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingProject(proj);
                                    setProjectModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                                  title="Edit Project"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteModalState({
                                      isOpen: true,
                                      type: 'project',
                                      id: proj.id,
                                      title: proj.title,
                                    });
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: SKILLS MANAGEMENT */}
          {/* ========================================== */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Skills Management</h3>
                  <p className="text-xs text-slate-400">
                    Track programming languages, data libraries, and tools with honest learning statuses.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setSkillModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl bg-[#0c121e] border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white text-sm">{skill.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {skill.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{skill.description || 'No description provided'}</p>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                        Status: {skill.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingSkill(skill);
                          setSkillModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Skill"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModalState({
                            isOpen: true,
                            type: 'skill',
                            id: skill.id,
                            title: skill.name,
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 4: ROADMAP JOURNEY */}
          {/* ========================================== */}
          {activeTab === 'journey' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Learning Roadmap Milestones</h3>
                  <p className="text-xs text-slate-400">
                    Update past and upcoming curriculum steps visible to visitors.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSeedData}
                    title="Synchronize missing default milestones without overwriting custom records"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700/60"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sync Missing Defaults</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingJourney(null);
                      setJourneyModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Milestone</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {journey.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#0c121e] border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-300">
                          {item.topic}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{item.date}</span>
                      </div>
                      <p className="text-xs text-slate-300">{item.description}</p>
                      {item.relatedResources && (
                        <p className="text-[11px] text-slate-400 italic">Ref: {item.relatedResources}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        item.status === 'Completed'
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                          : item.status === 'In Progress'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.status}
                      </span>

                      <button
                        onClick={() => {
                          setEditingJourney(item);
                          setJourneyModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Milestone"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModalState({
                            isOpen: true,
                            type: 'journey',
                            id: item.id,
                            title: item.title,
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 5: CERTIFICATIONS */}
          {/* ========================================== */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Certifications & Courses</h3>
                  <p className="text-xs text-slate-400">
                    Maintain verified course certificates and academic credentials.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCert(null);
                    setCertModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Credential</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certs.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-[#0c121e] border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                        {c.issuingOrg}
                      </span>
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">Issued: {c.issueDate}</p>
                      {c.credentialUrl && (
                        <a
                          href={c.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:underline pt-1"
                        >
                          <span>Verify Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCert(c);
                          setCertModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Credential"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModalState({
                            isOpen: true,
                            type: 'cert',
                            id: c.id,
                            title: c.name,
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete Credential"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 6: PROFILE & SOCIAL SETTINGS */}
          {/* ========================================== */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Public Profile & Social Configuration</h3>
                <p className="text-xs text-slate-400">
                  Update biography, headline, GitHub, LinkedIn, and primary contact email.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-[#0c121e] border border-slate-800 space-y-4 text-xs sm:text-sm">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={profileFormData.fullName}
                      onChange={(e) => setProfileFormData({ ...profileFormData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Professional Headline *</label>
                    <input
                      type="text"
                      required
                      maxLength={200}
                      value={profileFormData.headline}
                      onChange={(e) => setProfileFormData({ ...profileFormData, headline: e.target.value })}
                      placeholder="e.g. CSE Student | Aspiring Data Scientist"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Short Hero Biography (Max 1000 chars)</label>
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={profileFormData.shortBio}
                    onChange={(e) => setProfileFormData({ ...profileFormData, shortBio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full About Narrative (Max 5000 chars)</label>
                  <textarea
                    rows={5}
                    maxLength={5000}
                    value={profileFormData.fullAbout}
                    onChange={(e) => setProfileFormData({ ...profileFormData, fullAbout: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Contact Email *</label>
                    <input
                      type="email"
                      required
                      maxLength={200}
                      value={profileFormData.email}
                      onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">GitHub Profile URL</label>
                    <input
                      type="url"
                      maxLength={500}
                      value={profileFormData.githubUrl}
                      onChange={(e) => setProfileFormData({ ...profileFormData, githubUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      maxLength={500}
                      value={profileFormData.linkedinUrl}
                      onChange={(e) => setProfileFormData({ ...profileFormData, linkedinUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Phone / WhatsApp</label>
                    <input
                      type="text"
                      maxLength={50}
                      value={profileFormData.phone || ''}
                      onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                      placeholder="e.g. 01708574065"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">City & Country</label>
                    <input
                      type="text"
                      maxLength={100}
                      value={profileFormData.location || ''}
                      onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Kaggle URL (Optional)</label>
                    <input
                      type="url"
                      maxLength={500}
                      value={profileFormData.kaggleUrl || ''}
                      onChange={(e) => setProfileFormData({ ...profileFormData, kaggleUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* MODALS */}
      <ProjectModal
        isOpen={projectModalOpen}
        project={editingProject}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        onPreview={(p) => setPreviewProject(p)}
      />

      <SkillModal
        isOpen={skillModalOpen}
        skill={editingSkill}
        onClose={() => {
          setSkillModalOpen(false);
          setEditingSkill(null);
        }}
        onSave={handleSaveSkill}
      />

      <JourneyModal
        isOpen={journeyModalOpen}
        item={editingJourney}
        onClose={() => {
          setJourneyModalOpen(false);
          setEditingJourney(null);
        }}
        onSave={handleSaveJourney}
      />

      <CertModal
        isOpen={certModalOpen}
        cert={editingCert}
        onClose={() => {
          setCertModalOpen(false);
          setEditingCert(null);
        }}
        onSave={handleSaveCert}
      />

      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title="Confirm Delete"
        itemName={deleteModalState.title}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ ...deleteModalState, isOpen: false })}
      />

      {/* Project detail preview modal */}
      <ProjectDetailModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />

    </div>
  );
};
