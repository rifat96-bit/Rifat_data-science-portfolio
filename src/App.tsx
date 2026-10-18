import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { LearningJourneySection } from './components/LearningJourneySection';
import { ProjectsSection } from './components/ProjectsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
  Project, 
  Skill, 
  LearningJourneyItem, 
  Certification, 
  ProfileSettings 
} from './types';
import { 
  getProjects, 
  getSkills, 
  getLearningJourney, 
  getCertifications, 
  getProfileSettings 
} from './services/portfolioService';
import { defaultProfileSettings } from './lib/defaultData';
import { RefreshCw } from 'lucide-react';

const MainApp: React.FC = () => {
  const { isAdmin } = useAuth();

  // Navigation & View State
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return window.location.hash === '#admin' || window.location.pathname === '/admin';
  });

  // Selected project for modal view
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Portfolio data states
  const [profile, setProfile] = useState<ProfileSettings>(defaultProfileSettings);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [journey, setJourney] = useState<LearningJourneyItem[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync with browser hash/location
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin' || window.location.pathname === '/admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleAdminView = () => {
    if (isAdminView) {
      window.location.hash = '';
      setIsAdminView(false);
      // Reload public data in case admin made updates
      fetchPublicData();
    } else {
      window.location.hash = '#admin';
      setIsAdminView(true);
    }
  };

  // Fetch portfolio content
  const fetchPublicData = async () => {
    setLoading(true);
    try {
      const [profileData, projList, skillList, journeyList, certList] = await Promise.all([
        getProfileSettings(),
        getProjects(false), // Public view: only published projects!
        getSkills(),
        getLearningJourney(),
        getCertifications(),
      ]);

      setProfile(profileData);
      setProjects(projList);
      setSkills(skillList);
      setJourney(journeyList);
      setCerts(certList);
    } catch (error) {
      console.error('Error fetching public portfolio data:', error);
      addToast('Failed to load live portfolio records. Showing cached baseline.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {isAdminView ? (
        <AdminDashboard
          onBackToSite={toggleAdminView}
          onShowToast={addToast}
        />
      ) : (
        <>
          {/* Main Top Header */}
          <Navbar
            isAdminView={isAdminView}
            onToggleAdminView={toggleAdminView}
          />

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="font-mono text-xs text-slate-400">Loading portfolio & datasets...</p>
            </div>
          ) : (
            <main className="flex-1">
              <Hero profile={profile} />
              <AboutSection profile={profile} />
              <SkillsSection skills={skills} />
              <LearningJourneySection journey={journey} />
              <ProjectsSection
                projects={projects}
                onSelectProject={(p) => setSelectedProject(p)}
              />
              <CertificationsSection certifications={certs} />
              <ContactSection profile={profile} />
            </main>
          )}

          {/* Footer */}
          <Footer onToggleAdmin={toggleAdminView} />

          {/* In-depth Project Detail Modal */}
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
