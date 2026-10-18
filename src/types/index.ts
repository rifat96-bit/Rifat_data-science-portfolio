/**
 * Core TypeScript definitions for Rifat's Data Science Portfolio
 */

export type SkillCategory = 
  | 'Programming'
  | 'Data Analysis'
  | 'Databases'
  | 'Visualization'
  | 'Machine Learning'
  | 'Tools';

export type SkillStatus = 'Learning' | 'Practicing' | 'Completed';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  status: SkillStatus;
  description?: string;
  icon?: string;
  order?: number;
  updatedAt?: string;
}

export type JourneyStatus = 'Planned' | 'In Progress' | 'Completed';

export interface LearningJourneyItem {
  id: string;
  title: string;
  topic: string;
  description: string;
  date: string;
  status: JourneyStatus;
  relatedResources?: string;
  githubUrl?: string;
  order?: number;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  problemStatement?: string;
  datasetSource?: string;
  tools?: string[];
  methodology?: string;
  keyFindings?: string;
  category: string;
  thumbnailUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  notebookUrl?: string;
  creationDate?: string;
  featured?: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  credentialUrl?: string;
  imageUrl?: string;
  updatedAt?: string;
}

export interface ProfileSettings {
  fullName: string;
  headline: string;
  shortBio: string;
  fullAbout: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  phone?: string;
  location?: string;
  kaggleUrl?: string;
  resumeUrl?: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  createdAt?: string;
}
