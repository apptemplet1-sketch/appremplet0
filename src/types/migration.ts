export type DatabaseEngine = 
  | 'postgresql'
  | 'supabase'
  | 'firebase'
  | 'mongodb'
  | 'mysql'
  | 'sqlite';

export type TechStack = 
  | 'nodejs-express'
  | 'nextjs'
  | 'react-vite'
  | 'python-django'
  | 'python-fastapi'
  | 'laravel-php'
  | 'nest-js';

export interface ProjectConfig {
  oldCompanyName: string;
  newCompanyName: string;
  oldAppName: string;
  newAppName: string;
  oldDomain: string;
  newDomain: string;
  oldEmail: string;
  newEmail: string;
  techStack: TechStack;
  databaseEngine: DatabaseEngine;
  oldDbName: string;
  newDbName: string;
  newDbHost: string;
  newDbUser: string;
  newDbPort: string;
  newAdminEmail: string;
  primaryColor: string;
}

export interface ChecklistStep {
  id: string;
  phase: 'clone' | 'database' | 'env' | 'cleansing' | 'rebranding' | 'handover';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  riskLevel: 'high' | 'medium' | 'low';
  commands?: string[];
  tipsAr?: string[];
  tipsEn?: string[];
}
