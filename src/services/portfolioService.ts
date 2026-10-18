import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Project,
  Skill,
  LearningJourneyItem,
  Certification,
  ProfileSettings,
} from '../types';
import {
  defaultProfileSettings,
  defaultSkills,
  defaultLearningJourney,
  defaultProjects,
  defaultCertifications,
} from '../lib/defaultData';

export const SETTINGS_COLLECTION = 'settings';
export const PROJECTS_COLLECTION = 'projects';
export const SKILLS_COLLECTION = 'skills';
export const JOURNEY_COLLECTION = 'learning_journey';
export const CERTS_COLLECTION = 'certifications';
export const SYSTEM_DOC_ID = 'system';
export const PROFILE_DOC_ID = 'profile';

/**
 * Generate a clean, validated Firestore document ID satisfying ^[a-zA-Z0-9_\-]+$
 */
export function generateEntityId(prefix: string): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_]/g, '');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${cleanPrefix}_${timestamp}_${random}`;
}

/**
 * Sanitizes an ID string to conform with Firestore rules isValidId
 */
export function sanitizeId(id: string, fallbackPrefix: string): string {
  if (id && /^[a-zA-Z0-9_\-]+$/.test(id) && id.length <= 128) {
    return id;
  }
  return generateEntityId(fallbackPrefix);
}

// ==========================================
// SYSTEM & INITIALIZATION TRACKING
// ==========================================

export async function isDatabaseInitialized(): Promise<boolean> {
  try {
    const sysDoc = await getDoc(doc(db, SETTINGS_COLLECTION, SYSTEM_DOC_ID));
    if (sysDoc.exists() && sysDoc.data()?.initialized === true) {
      return true;
    }
    // Also check if any real collection has items
    const [projSnap, journeySnap] = await Promise.all([
      getDocs(collection(db, PROJECTS_COLLECTION)),
      getDocs(collection(db, JOURNEY_COLLECTION)),
    ]);
    if (!projSnap.empty || !journeySnap.empty) {
      // Auto-mark initialized in settings to make subsequent checks fast
      await setDoc(doc(db, SETTINGS_COLLECTION, SYSTEM_DOC_ID), {
        initialized: true,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(() => {});
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function markDatabaseInitialized(): Promise<void> {
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, SYSTEM_DOC_ID), {
      initialized: true,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch {
    // Non-fatal if offline
  }
}

// Backwards-compatible alias for AdminDashboard
export const isDatabaseSeeded = isDatabaseInitialized;

// ==========================================
// PROFILE SETTINGS
// ==========================================

export async function getProfileSettings(): Promise<ProfileSettings> {
  const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_DOC_ID);
  try {
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as ProfileSettings;
      const linkedinUrl =
        data.linkedinUrl === 'https://linkedin.com/in/md-raisul-islam-rifat772852286'
          ? defaultProfileSettings.linkedinUrl
          : (data.linkedinUrl || defaultProfileSettings.linkedinUrl);

      return {
        ...defaultProfileSettings,
        ...data,
        linkedinUrl,
      };
    }
    return defaultProfileSettings;
  } catch (error) {
    console.warn('Failed to load profile from Firestore, using default profile baseline', error);
    return defaultProfileSettings;
  }
}

export async function updateProfileSettings(settings: Partial<ProfileSettings>): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_DOC_ID);
  try {
    const { id: _ignored, ...cleanSettings } = settings as Record<string, unknown>;
    const payload = {
      ...cleanSettings,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    await markDatabaseInitialized();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COLLECTION}/${PROFILE_DOC_ID}`);
  }
}

// ==========================================
// PROJECTS
// ==========================================

export async function getProjects(isAdmin: boolean = false): Promise<Project[]> {
  try {
    const colRef = collection(db, PROJECTS_COLLECTION);
    const q = isAdmin
      ? colRef
      : query(colRef, where('published', '==', true));

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const projects = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Project[];

      return projects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
    }

    // Check if the system has been seeded or initialized
    const initialized = await isDatabaseInitialized();
    if (initialized) {
      // The admin has an empty project repository or all were deleted: do NOT resurrect defaults!
      return [];
    }

    // Unseeded read-only preview for fresh visitors
    const preview = defaultProjects.map((p, idx) => ({
      id: `preview_proj_${idx + 1}`,
      ...p,
    }));
    return isAdmin ? preview : preview.filter(p => p.published);
  } catch (error) {
    console.warn('Failed to load projects from Firestore, falling back to static preview', error);
    const preview = defaultProjects.map((p, idx) => ({
      id: `preview_proj_${idx + 1}`,
      ...p,
    }));
    return isAdmin ? preview : preview.filter(p => p.published);
  }
}

export async function createProject(project: Omit<Project, 'id'>): Promise<string> {
  const { id: _ignored, ...cleanProject } = project as Record<string, unknown>;
  const id = generateEntityId('proj');
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  try {
    const now = new Date().toISOString();
    const payload = {
      ...cleanProject,
      id,
      createdAt: (cleanProject.createdAt as string) || now,
      updatedAt: now,
    };
    await setDoc(docRef, payload);
    await markDatabaseInitialized();
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PROJECTS_COLLECTION}/${id}`);
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  const targetId = sanitizeId(id, 'proj');
  const docRef = doc(db, PROJECTS_COLLECTION, targetId);
  try {
    const { id: _ignored, ...cleanUpdates } = updates as Record<string, unknown>;
    const payload = {
      ...cleanUpdates,
      id: targetId,
      updatedAt: new Date().toISOString(),
    };
    // setDoc with merge prevents "No document to update" errors
    await setDoc(docRef, payload, { merge: true });
    await markDatabaseInitialized();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PROJECTS_COLLECTION}/${targetId}`);
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
    await markDatabaseInitialized();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PROJECTS_COLLECTION}/${id}`);
  }
}

// ==========================================
// SKILLS
// ==========================================

export async function getSkills(): Promise<Skill[]> {
  try {
    const colRef = collection(db, SKILLS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const skills = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Skill[];
      return skills.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    }

    const initialized = await isDatabaseInitialized();
    if (initialized) {
      return [];
    }

    return defaultSkills.map((s, idx) => ({
      id: `preview_skill_${idx + 1}`,
      ...s,
    }));
  } catch (error) {
    console.warn('Failed to load skills from Firestore, using static preview', error);
    return defaultSkills.map((s, idx) => ({
      id: `preview_skill_${idx + 1}`,
      ...s,
    }));
  }
}

export async function createSkill(skill: Omit<Skill, 'id'>): Promise<string> {
  const { id: _ignored, ...cleanSkill } = skill as Record<string, unknown>;
  const id = generateEntityId('skill');
  const docRef = doc(db, SKILLS_COLLECTION, id);
  try {
    const payload = {
      ...cleanSkill,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    await markDatabaseInitialized();
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${SKILLS_COLLECTION}/${id}`);
  }
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<void> {
  const targetId = sanitizeId(id, 'skill');
  const docRef = doc(db, SKILLS_COLLECTION, targetId);
  try {
    const { id: _ignored, ...cleanUpdates } = updates as Record<string, unknown>;
    const payload = {
      ...cleanUpdates,
      id: targetId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    await markDatabaseInitialized();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${SKILLS_COLLECTION}/${targetId}`);
  }
}

export async function deleteSkill(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SKILLS_COLLECTION, id));
    await markDatabaseInitialized();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${SKILLS_COLLECTION}/${id}`);
  }
}

// ==========================================
// LEARNING JOURNEY
// ==========================================

export async function getLearningJourney(): Promise<LearningJourneyItem[]> {
  try {
    const colRef = collection(db, JOURNEY_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as LearningJourneyItem[];
      return items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    }

    const initialized = await isDatabaseInitialized();
    if (initialized) {
      return [];
    }

    return defaultLearningJourney.map((j, idx) => ({
      id: `preview_journey_${idx + 1}`,
      ...j,
    }));
  } catch (error) {
    console.warn('Failed to load learning journey from Firestore, using static preview', error);
    return defaultLearningJourney.map((j, idx) => ({
      id: `preview_journey_${idx + 1}`,
      ...j,
    }));
  }
}

export async function createJourneyItem(item: Omit<LearningJourneyItem, 'id'>): Promise<string> {
  const { id: _ignored, ...cleanItem } = item as Record<string, unknown>;
  const id = generateEntityId('journey');
  const docRef = doc(db, JOURNEY_COLLECTION, id);
  try {
    const payload = {
      ...cleanItem,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    await markDatabaseInitialized();
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${JOURNEY_COLLECTION}/${id}`);
  }
}

export async function updateJourneyItem(id: string, updates: Partial<LearningJourneyItem>): Promise<void> {
  const targetId = sanitizeId(id, 'journey');
  const docRef = doc(db, JOURNEY_COLLECTION, targetId);
  try {
    const { id: _ignored, ...cleanUpdates } = updates as Record<string, unknown>;
    const payload = {
      ...cleanUpdates,
      id: targetId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    await markDatabaseInitialized();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${JOURNEY_COLLECTION}/${targetId}`);
  }
}

export async function deleteJourneyItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, JOURNEY_COLLECTION, id));
    await markDatabaseInitialized();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${JOURNEY_COLLECTION}/${id}`);
  }
}

// ==========================================
// CERTIFICATIONS
// ==========================================

export async function getCertifications(): Promise<Certification[]> {
  try {
    const colRef = collection(db, CERTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Certification[];
    }

    const initialized = await isDatabaseInitialized();
    if (initialized) {
      return [];
    }

    return defaultCertifications.map((c, idx) => ({
      id: `preview_cert_${idx + 1}`,
      ...c,
    }));
  } catch (error) {
    console.warn('Failed to load certifications from Firestore, using static preview', error);
    return defaultCertifications.map((c, idx) => ({
      id: `preview_cert_${idx + 1}`,
      ...c,
    }));
  }
}

export async function createCertification(cert: Omit<Certification, 'id'>): Promise<string> {
  const { id: _ignored, ...cleanCert } = cert as Record<string, unknown>;
  const id = generateEntityId('cert');
  const docRef = doc(db, CERTS_COLLECTION, id);
  try {
    const payload = {
      ...cleanCert,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    await markDatabaseInitialized();
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${CERTS_COLLECTION}/${id}`);
  }
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<void> {
  const targetId = sanitizeId(id, 'cert');
  const docRef = doc(db, CERTS_COLLECTION, targetId);
  try {
    const { id: _ignored, ...cleanUpdates } = updates as Record<string, unknown>;
    const payload = {
      ...cleanUpdates,
      id: targetId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    await markDatabaseInitialized();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${CERTS_COLLECTION}/${targetId}`);
  }
}

export async function deleteCertification(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CERTS_COLLECTION, id));
    await markDatabaseInitialized();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CERTS_COLLECTION}/${id}`);
  }
}

// ==========================================
// SAFE DATABASE SEEDING & SYNCHRONIZATION
// ==========================================

export interface SeedResult {
  success: boolean;
  message: string;
  isInitialSeed: boolean;
  addedCounts: {
    projects: number;
    skills: number;
    journey: number;
    certifications: number;
  };
}

/**
 * Idempotent, safe portfolio database seeding.
 * Does NOT overwrite existing user-created content.
 * Prevents duplicates by matching existing titles, names, and identifiers.
 */
export async function seedDefaultPortfolio(): Promise<SeedResult> {
  try {
    const now = new Date().toISOString();
    const isInitial = !(await isDatabaseInitialized());

    // 1. Safe Profile Sync (only fills missing fields, does not erase customized fields)
    const profileRef = doc(db, SETTINGS_COLLECTION, PROFILE_DOC_ID);
    const existingProfileSnap = await getDoc(profileRef);
    if (!existingProfileSnap.exists()) {
      await setDoc(profileRef, {
        ...defaultProfileSettings,
        updatedAt: now,
      });
    } else {
      const data = existingProfileSnap.data() as ProfileSettings;
      if (data.linkedinUrl === 'https://linkedin.com/in/md-raisul-islam-rifat772852286') {
        await setDoc(profileRef, {
          linkedinUrl: defaultProfileSettings.linkedinUrl,
          updatedAt: now,
        }, { merge: true });
      }
    }

    // 2. Safe Skills Sync: Deduplicate by lowercase skill name
    const existingSkillsSnap = await getDocs(collection(db, SKILLS_COLLECTION));
    const existingSkillNames = new Set(
      existingSkillsSnap.docs.map(d => (d.data().name as string || '').toLowerCase().trim())
    );

    let skillsAdded = 0;
    for (let i = 0; i < defaultSkills.length; i++) {
      const skill = defaultSkills[i];
      if (!existingSkillNames.has(skill.name.toLowerCase().trim())) {
        const id = generateEntityId('skill');
        await setDoc(doc(db, SKILLS_COLLECTION, id), {
          ...skill,
          id,
          updatedAt: now,
        });
        skillsAdded++;
        existingSkillNames.add(skill.name.toLowerCase().trim());
      }
    }

    // 3. Safe Journey Sync: Deduplicate by lowercase title
    const existingJourneySnap = await getDocs(collection(db, JOURNEY_COLLECTION));
    const existingJourneyTitles = new Set(
      existingJourneySnap.docs.map(d => (d.data().title as string || '').toLowerCase().trim())
    );

    let journeyAdded = 0;
    for (let i = 0; i < defaultLearningJourney.length; i++) {
      const item = defaultLearningJourney[i];
      if (!existingJourneyTitles.has(item.title.toLowerCase().trim())) {
        const id = generateEntityId('journey');
        await setDoc(doc(db, JOURNEY_COLLECTION, id), {
          ...item,
          id,
          updatedAt: now,
        });
        journeyAdded++;
        existingJourneyTitles.add(item.title.toLowerCase().trim());
      }
    }

    // 4. Safe Projects Sync: Deduplicate by lowercase title
    const existingProjectsSnap = await getDocs(collection(db, PROJECTS_COLLECTION));
    const existingProjectTitles = new Set(
      existingProjectsSnap.docs.map(d => (d.data().title as string || '').toLowerCase().trim())
    );

    let projectsAdded = 0;
    for (let i = 0; i < defaultProjects.length; i++) {
      const project = defaultProjects[i];
      if (!existingProjectTitles.has(project.title.toLowerCase().trim())) {
        const id = generateEntityId('proj');
        await setDoc(doc(db, PROJECTS_COLLECTION, id), {
          ...project,
          id,
          createdAt: now,
          updatedAt: now,
        });
        projectsAdded++;
        existingProjectTitles.add(project.title.toLowerCase().trim());
      }
    }

    // 5. Safe Certifications Sync: Deduplicate by lowercase certification name
    const existingCertsSnap = await getDocs(collection(db, CERTS_COLLECTION));
    const existingCertNames = new Set(
      existingCertsSnap.docs.map(d => (d.data().name as string || '').toLowerCase().trim())
    );

    let certsAdded = 0;
    for (let i = 0; i < defaultCertifications.length; i++) {
      const cert = defaultCertifications[i];
      if (!existingCertNames.has(cert.name.toLowerCase().trim())) {
        const id = generateEntityId('cert');
        await setDoc(doc(db, CERTS_COLLECTION, id), {
          ...cert,
          id,
          updatedAt: now,
        });
        certsAdded++;
        existingCertNames.add(cert.name.toLowerCase().trim());
      }
    }

    // 6. Record system initialization state
    await setDoc(doc(db, SETTINGS_COLLECTION, SYSTEM_DOC_ID), {
      initialized: true,
      lastSeededAt: now,
      updatedAt: now,
    }, { merge: true });

    const totalAdded = skillsAdded + journeyAdded + projectsAdded + certsAdded;
    const msg = isInitial
      ? `Database seeded successfully! Created ${totalAdded} verified records without overwriting custom data.`
      : totalAdded > 0
        ? `Synchronization complete. Added ${totalAdded} missing records without altering existing content.`
        : 'All default records are already in sync with Firestore. No changes needed.';

    return {
      success: true,
      message: msg,
      isInitialSeed: isInitial,
      addedCounts: {
        projects: projectsAdded,
        skills: skillsAdded,
        journey: journeyAdded,
        certifications: certsAdded,
      },
    };
  } catch (error) {
    console.error('Error in safe portfolio seeding:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to seed database',
      isInitialSeed: false,
      addedCounts: { projects: 0, skills: 0, journey: 0, certifications: 0 },
    };
  }
}

// Backwards-compatible export
export const seedInitialData = seedDefaultPortfolio;
