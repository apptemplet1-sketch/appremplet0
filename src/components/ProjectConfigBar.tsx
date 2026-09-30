import React from 'react';
import { DatabaseEngine, ProjectConfig, TechStack } from '../types/migration';
import { Building2, Server, Globe, KeyRound, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { DEFAULT_CONFIG } from '../data/migrationData';

interface ProjectConfigBarProps {
  config: ProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProjectConfig>>;
  lang: 'ar' | 'en';
}

export const ProjectConfigBar: React.FC<ProjectConfigBarProps> = ({ config, setConfig, lang }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleChange = (field: keyof ProjectConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>
              {lang === 'ar'
                ? 'تخصيص بيانات المشروع القديم والشركة الجديدة (لتوليد الأوامر تلقائياً)'
                : 'Project & Client Configuration (Auto-customizes all scripts)'}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              [{isOpen ? (lang === 'ar' ? 'إخفاء' : 'Collapse') : (lang === 'ar' ? 'تعديل' : 'Expand')}]
            </span>
          </button>

          <button
            onClick={resetDefaults}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            title="إعادة التعيين إلى الإعدادات النموذجية"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{lang === 'ar' ? 'إعادة ضبط افتراضي' : 'Reset Defaults'}</span>
          </button>
        </div>

        {isOpen && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Old Company Info */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                <Building2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'المشروع/الشركة السابقة (المصدر)' : 'Source Company (Old)'}</span>
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">{lang === 'ar' ? 'اسم الشركة السابقة:' : 'Old Company Name:'}</label>
                <input
                  type="text"
                  value={config.oldCompanyName}
                  onChange={(e) => handleChange('oldCompanyName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">{lang === 'ar' ? 'الدومين القديم:' : 'Old Domain:'}</label>
                <input
                  type="text"
                  value={config.oldDomain}
                  onChange={(e) => handleChange('oldDomain', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  placeholder="old-client.com"
                />
              </div>
            </div>

            {/* New Company Info */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Building2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الشركة الجديدة (الهدف للتسليم)' : 'Target Company (New)'}</span>
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">{lang === 'ar' ? 'اسم الشركة الجديدة:' : 'New Company Name:'}</label>
                <input
                  type="text"
                  value={config.newCompanyName}
                  onChange={(e) => handleChange('newCompanyName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g. Nova Tech"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">{lang === 'ar' ? 'الدومين الجديد:' : 'New Domain:'}</label>
                <input
                  type="text"
                  value={config.newDomain}
                  onChange={(e) => handleChange('newDomain', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  placeholder="new-client.com"
                />
              </div>
            </div>

            {/* Database Engine Settings */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <Server className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'نوع ونظام قاعدة البيانات' : 'Database Engine'}</span>
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">{lang === 'ar' ? 'محرك القاعدة المطلوب:' : 'Database Type:'}</label>
                <select
                  value={config.databaseEngine}
                  onChange={(e) => handleChange('databaseEngine', e.target.value as DatabaseEngine)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="postgresql">PostgreSQL / Cloud SQL / Neon</option>
                  <option value="supabase">Supabase (Postgres BaaS)</option>
                  <option value="firebase">Firebase Firestore</option>
                  <option value="mongodb">MongoDB / Atlas</option>
                  <option value="mysql">MySQL / MariaDB</option>
                  <option value="sqlite">SQLite / Turso</option>
                </select>
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">{lang === 'ar' ? 'اسم قاعدة البيانات الجديدة:' : 'New Database Name:'}</label>
                <input
                  type="text"
                  value={config.newDbName}
                  onChange={(e) => handleChange('newDbName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  placeholder="newcompany_prod_db"
                />
              </div>
            </div>

            {/* Tech Stack & Admin Seed */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <KeyRound className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'التقنية والمسؤول الأولي' : 'Stack & Admin'}</span>
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">{lang === 'ar' ? 'إطار العمل (Tech Stack):' : 'Framework:'}</label>
                <select
                  value={config.techStack}
                  onChange={(e) => handleChange('techStack', e.target.value as TechStack)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="nextjs">Next.js (App / Pages Router)</option>
                  <option value="nodejs-express">Node.js + Express</option>
                  <option value="react-vite">React + Vite SPA</option>
                  <option value="nest-js">NestJS</option>
                  <option value="python-django">Python / Django</option>
                  <option value="python-fastapi">Python / FastAPI</option>
                  <option value="laravel-php">Laravel / PHP</option>
                </select>
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block mb-0.5">{lang === 'ar' ? 'بريد المدير الأولي للتسليم:' : 'New Admin Email:'}</label>
                <input
                  type="email"
                  value={config.newAdminEmail}
                  onChange={(e) => handleChange('newAdminEmail', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  placeholder="admin@newcompany.com"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
