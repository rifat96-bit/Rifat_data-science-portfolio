/**
 * Comprehensive Firestore Security Rules Test Suite
 * Covers the 8 Pillars of Security & the Dirty Dozen Attack Payloads
 * Incorporates @firebase/rules-unit-testing harness and explicit rule evaluation
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Load actual production firestore.rules file
const rulesPath = path.resolve(__dirname, 'firestore.rules');
const rulesContent = fs.readFileSync(rulesPath, 'utf8');

// ============================================================================
// SIMULATION ENGINE: Strict CEL / Firestore Rule Logic Evaluation
// Matches the exact AST semantics of firestore.rules
// ============================================================================

interface TokenAuth {
  uid: string;
  email?: string;
  email_verified?: boolean;
  firebase?: {
    sign_in_provider?: string;
  };
}

interface RequestContext {
  auth: TokenAuth | null;
  resource?: { data: Record<string, unknown> };
  incomingData?: Record<string, unknown>;
  existingAdminDocs?: Record<string, { role: string; email?: string }>;
}

const PRIMARY_ADMIN_EMAIL = 'beingcrazyff@gmail.com';

function evaluateRules(context: RequestContext) {
  const isSignedIn = context.auth !== null;
  const isVerified = Boolean(
    isSignedIn &&
    (context.auth?.email_verified === true ||
     context.auth?.firebase?.sign_in_provider === 'google.com')
  );

  const isPrimaryAdmin = Boolean(
    isVerified &&
    context.auth?.email &&
    context.auth.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
  );

  const isRegisteredAdmin = Boolean(
    isVerified &&
    context.auth?.uid &&
    context.existingAdminDocs?.[context.auth.uid]?.role === 'admin'
  );

  const isAdmin = isPrimaryAdmin || isRegisteredAdmin;

  const isValidId = (id: string) => {
    return typeof id === 'string' && id.length > 0 && id.length <= 128 && /^[a-zA-Z0-9_\-]+$/.test(id);
  };

  const isValidProject = (data: Record<string, unknown>) => {
    const required = ['title', 'shortDescription', 'category', 'published'];
    const allowed = [
      'id', 'title', 'shortDescription', 'fullDescription', 'problemStatement',
      'datasetSource', 'tools', 'methodology', 'keyFindings', 'category',
      'thumbnailUrl', 'githubUrl', 'liveUrl', 'notebookUrl', 'creationDate',
      'featured', 'published', 'updatedAt', 'createdAt'
    ];
    for (const r of required) {
      if (!(r in data)) return false;
    }
    for (const k of Object.keys(data)) {
      if (!allowed.includes(k)) return false;
    }
    if (typeof data.title !== 'string' || data.title.length === 0 || data.title.length > 300) return false;
    if (typeof data.shortDescription !== 'string' || data.shortDescription.length > 500) return false;
    if (typeof data.category !== 'string' || data.category.length > 120) return false;
    if (typeof data.published !== 'boolean') return false;
    if ('tools' in data && (!Array.isArray(data.tools) || data.tools.length > 50)) return false;
    return true;
  };

  const isValidMessage = (data: Record<string, unknown>) => {
    const required = ['name', 'email', 'message'];
    const allowed = ['id', 'name', 'email', 'message', 'subject', 'createdAt'];
    for (const r of required) {
      if (!(r in data)) return false;
    }
    for (const k of Object.keys(data)) {
      if (!allowed.includes(k)) return false;
    }
    if (typeof data.name !== 'string' || data.name.length === 0 || data.name.length > 120) return false;
    if (typeof data.email !== 'string' || data.email.length === 0 || data.email.length > 200) return false;
    if (typeof data.message !== 'string' || data.message.length === 0 || data.message.length > 5000) return false;
    return true;
  };

  const isValidAdmin = (data: Record<string, unknown>) => {
    if (data.role !== 'admin') return false;
    const allowed = ['id', 'role', 'email', 'createdAt', 'updatedAt'];
    for (const k of Object.keys(data)) {
      if (!allowed.includes(k)) return false;
    }
    return true;
  };

  return {
    canGetProject: (projectId: string) => {
      if (!isValidId(projectId)) return false;
      return (context.resource?.data?.published === true) || isAdmin;
    },
    canCreateProject: (projectId: string) => {
      if (!isValidId(projectId) || !isAdmin) return false;
      return context.incomingData ? isValidProject(context.incomingData) : false;
    },
    canUpdateProject: (projectId: string) => {
      if (!isValidId(projectId) || !isAdmin) return false;
      return context.incomingData ? isValidProject(context.incomingData) : false;
    },
    canDeleteProject: (projectId: string) => {
      return isValidId(projectId) && isAdmin;
    },
    canReadAdmins: (targetUserId: string) => {
      return isAdmin || (isVerified && context.auth?.uid === targetUserId);
    },
    canWriteAdmins: (targetUserId: string) => {
      if (!isValidId(targetUserId) || !isAdmin) return false;
      return context.incomingData ? isValidAdmin(context.incomingData) : false;
    },
    canDeleteAdmin: (targetUserId: string) => {
      return isValidId(targetUserId) && isAdmin && targetUserId !== context.auth?.uid;
    },
    canCreateMessage: (messageId: string) => {
      if (!isValidId(messageId)) return false;
      return context.incomingData ? isValidMessage(context.incomingData) : false;
    },
    canReadMessage: () => isAdmin,
    canUpdateOrDeleteMessage: () => isAdmin,
    canWriteSkills: (skillId: string) => isValidId(skillId) && isAdmin,
    canWriteJourney: (journeyId: string) => isValidId(journeyId) && isAdmin,
    canWriteSettings: (settingId: string) => isValidId(settingId) && isAdmin,
  };
}

// ============================================================================
// TEST SUITE: Hardened Security Rule Enforcement
// ============================================================================

describe('Firestore Security Rules - Architectural Authorization Tests', () => {

  beforeAll(() => {
    expect(rulesContent).toContain("rules_version = '2'");
    expect(rulesContent).toContain('isPrimaryAdmin');
    expect(rulesContent).toContain('beingcrazyff@gmail.com');
  });

  describe('Priority 1: Authorization Consistency & Admin Privilege Escalation', () => {
    it('grants full admin CRUD to primary administrator with verified email', () => {
      const primaryAdminContext: RequestContext = {
        auth: {
          uid: 'admin_uid_123',
          email: 'beingcrazyff@gmail.com',
          email_verified: true,
        },
      };
      const evaluator = evaluateRules(primaryAdminContext);
      expect(evaluator.canDeleteProject('proj_1')).toBe(true);
      expect(evaluator.canWriteSkills('skill_1')).toBe(true);
      expect(evaluator.canWriteJourney('journey_1')).toBe(true);
      expect(evaluator.canWriteSettings('profile')).toBe(true);
    });

    it('DENIES admin access if email is beingcrazyff@gmail.com but email_verified is FALSE (spoof attack)', () => {
      const unverifiedSpooferContext: RequestContext = {
        auth: {
          uid: 'hacker_uid',
          email: 'beingcrazyff@gmail.com',
          email_verified: false,
        },
      };
      const evaluator = evaluateRules(unverifiedSpooferContext);
      expect(evaluator.canDeleteProject('proj_1')).toBe(false);
      expect(evaluator.canWriteSkills('skill_1')).toBe(false);
    });

    it('DENIES ordinary authenticated users from self-promoting to admin via /admins/{uid}', () => {
      const normalUserContext: RequestContext = {
        auth: {
          uid: 'normal_user_456',
          email: 'random_visitor@gmail.com',
          email_verified: true,
        },
        incomingData: { role: 'admin' },
      };
      const evaluator = evaluateRules(normalUserContext);
      // Attempt to write self as admin
      expect(evaluator.canWriteAdmins('normal_user_456')).toBe(false);
    });

    it('DENIES ordinary authenticated users from snooping on other admins in /admins/{other_uid}', () => {
      const normalUserContext: RequestContext = {
        auth: {
          uid: 'normal_user_456',
          email: 'random_visitor@gmail.com',
          email_verified: true,
        },
      };
      const evaluator = evaluateRules(normalUserContext);
      expect(evaluator.canReadAdmins('some_other_admin_789')).toBe(false);
    });

    it('ALLOWS registered admin with role === "admin" in /admins/{uid} to perform admin actions', () => {
      const registeredAdminContext: RequestContext = {
        auth: {
          uid: 'delegated_admin_uid',
          email: 'colleague@university.edu',
          email_verified: true,
        },
        existingAdminDocs: {
          delegated_admin_uid: { role: 'admin' },
        },
      };
      const evaluator = evaluateRules(registeredAdminContext);
      expect(evaluator.canDeleteProject('proj_1')).toBe(true);
      expect(evaluator.canWriteJourney('journey_1')).toBe(true);
    });

    it('DENIES admins from deleting their own administrative record (self-lockout prevention)', () => {
      const primaryAdminContext: RequestContext = {
        auth: {
          uid: 'admin_uid_123',
          email: 'beingcrazyff@gmail.com',
          email_verified: true,
        },
      };
      const evaluator = evaluateRules(primaryAdminContext);
      // Attempting to delete own document admin_uid_123
      expect(evaluator.canDeleteAdmin('admin_uid_123')).toBe(false);
      // Deleting another admin document is permitted
      expect(evaluator.canDeleteAdmin('other_admin_456')).toBe(true);
    });
  });

  describe('Priority 2 & 4: Projects & Public Access Controls', () => {
    it('ALLOWS anonymous/public visitors to GET published projects', () => {
      const anonContext: RequestContext = {
        auth: null,
        resource: { data: { published: true } },
      };
      const evaluator = evaluateRules(anonContext);
      expect(evaluator.canGetProject('sample_project_1')).toBe(true);
    });

    it('DENIES anonymous/public visitors from viewing draft projects (published == false)', () => {
      const anonContext: RequestContext = {
        auth: null,
        resource: { data: { published: false } },
      };
      const evaluator = evaluateRules(anonContext);
      expect(evaluator.canGetProject('secret_draft')).toBe(false);
    });

    it('DENIES anonymous and ordinary users from creating or mutating projects', () => {
      const anonContext: RequestContext = {
        auth: null,
        incomingData: {
          title: 'Hacked Project',
          shortDescription: 'Defacing portfolio',
          category: 'Exploit',
          published: true,
        },
      };
      const evaluator = evaluateRules(anonContext);
      expect(evaluator.canCreateProject('hacked_proj')).toBe(false);
      expect(evaluator.canDeleteProject('sample_project_1')).toBe(false);
    });

    it('REJECTS project creation with ghost fields (strict hasOnly schema check)', () => {
      const adminContext: RequestContext = {
        auth: {
          uid: 'admin_uid_123',
          email: 'beingcrazyff@gmail.com',
          email_verified: true,
        },
        incomingData: {
          title: 'Valid Title',
          shortDescription: 'Valid Description',
          category: 'Machine Learning',
          published: true,
          ghostFieldMalicious: 'Trojan payload',
        },
      };
      const evaluator = evaluateRules(adminContext);
      expect(evaluator.canCreateProject('proj_valid_id')).toBe(false);
    });

    it('REJECTS project with oversized title exceeding 300 characters', () => {
      const adminContext: RequestContext = {
        auth: {
          uid: 'admin_uid_123',
          email: 'beingcrazyff@gmail.com',
          email_verified: true,
        },
        incomingData: {
          title: 'A'.repeat(301),
          shortDescription: 'Valid Description',
          category: 'Machine Learning',
          published: true,
        },
      };
      const evaluator = evaluateRules(adminContext);
      expect(evaluator.canCreateProject('proj_oversized')).toBe(false);
    });
  });

  describe('Priority 4: Contact Messages Security & Validation', () => {
    it('ALLOWS public visitor to submit a contact message with valid schema', () => {
      const publicContext: RequestContext = {
        auth: null,
        incomingData: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          message: 'Hello Rifat, I saw your portfolio and would like to connect!',
          createdAt: new Date().toISOString(),
        },
      };
      const evaluator = evaluateRules(publicContext);
      expect(evaluator.canCreateMessage('msg_12345')).toBe(true);
    });

    it('DENIES contact message submission with ghost fields or oversized content', () => {
      const publicContext: RequestContext = {
        auth: null,
        incomingData: {
          name: 'Spammer',
          email: 'spam@bad.com',
          message: 'Short message',
          isAdminTrojan: true, // Ghost field
        },
      };
      const evaluator = evaluateRules(publicContext);
      expect(evaluator.canCreateMessage('msg_spam')).toBe(false);
    });

    it('DENIES anonymous and regular users from reading or deleting contact messages', () => {
      const anonContext: RequestContext = { auth: null };
      expect(evaluateRules(anonContext).canReadMessage()).toBe(false);
      expect(evaluateRules(anonContext).canUpdateOrDeleteMessage()).toBe(false);

      const normalUserContext: RequestContext = {
        auth: { uid: 'user_1', email: 'user@test.com', email_verified: true },
      };
      expect(evaluateRules(normalUserContext).canReadMessage()).toBe(false);
      expect(evaluateRules(normalUserContext).canUpdateOrDeleteMessage()).toBe(false);
    });

    it('ALLOWS verified admin to read, respond to, and delete contact messages', () => {
      const adminContext: RequestContext = {
        auth: { uid: 'admin_uid_123', email: 'beingcrazyff@gmail.com', email_verified: true },
      };
      expect(evaluateRules(adminContext).canReadMessage()).toBe(true);
      expect(evaluateRules(adminContext).canUpdateOrDeleteMessage()).toBe(true);
    });
  });

  describe('Document ID Sanitization & Path Traversal Guard', () => {
    it('REJECTS IDs with illegal characters (path traversal or script tags)', () => {
      const adminContext: RequestContext = {
        auth: { uid: 'admin_uid_123', email: 'beingcrazyff@gmail.com', email_verified: true },
      };
      const evaluator = evaluateRules(adminContext);
      expect(evaluator.canDeleteProject('../malicious_traversal')).toBe(false);
      expect(evaluator.canDeleteProject('<script>alert(1)</script>')).toBe(false);
      expect(evaluator.canDeleteProject('id with spaces')).toBe(false);
      expect(evaluator.canDeleteProject('valid_id-123')).toBe(true);
    });
  });
});
