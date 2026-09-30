import React from 'react';
import { Database, GitFork, ShieldCheck, CheckCircle2, Sparkles, FileText, ArrowRightLeft } from 'lucide-react';
import { ProjectConfig } from '../types/migration';

interface HeaderProps {
  config: ProjectConfig;
  completedStepsCount: number;
  totalStepsCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  completedStepsCount,
  totalStepsCount,
  activeTab,
  setActiveTab,
  lang,
  setLang
}) => {
  const percent = Math.round((completedStepsCount / totalStepsCount) * 100);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {lang === 'ar' ? 'منصة استنساخ ونقل المشاريع وقواعد البيانات' : 'Project Duplicator & Database Migration Hub'}
                </h1>
                <span className="text-[11px] text-cyan-400 font-mono font-medium px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                  v2.4 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{config.oldCompanyName || 'الشركة السابقة'}</span>
                <span className="text-slate-600">→</span>
                <span className="text-cyan-400 font-semibold">{config.newCompanyName || 'الشركة الجديدة'}</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400">{config.databaseEngine.toUpperCase()}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center flex-wrap gap-3">
            {/* Progress Bar */}
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'الإنجاز:' : 'Progress:'}</span>
                <span className="font-mono text-cyan-300 font-bold">{completedStepsCount}/{totalStepsCount}</span>
              </div>
              <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="font-mono text-slate-400 text-[11px]">{percent}%</span>
            </div>

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700 transition"
              title="تغيير لغة الواجهة"
            >
              {lang === 'ar' ? 'English' : 'عربي'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto text-sm">
          {[
            { id: 'wizard', labelAr: 'مراحل الاستنساخ التفاعلية', labelEn: 'Migration Steps', icon: GitFork },
            { id: 'database', labelAr: 'هندسة قاعدة البيانات', labelEn: 'Database Engine', icon: Database },
            { id: 'env', labelAr: 'تطهير ملفات البيئة والمفاتيح', labelEn: '.env Sanitizer', icon: ShieldCheck },
            { id: 'replace', labelAr: 'استبدال النصوص والهوية برمجياً', labelEn: 'Brand Find & Replace', icon: Sparkles },
            { id: 'handover', labelAr: 'وثيقة تسليم العميل (Handover)', labelEn: 'Handover Package', icon: FileText },
            { id: 'workspace', labelAr: 'استيراد الكود هنا الآن', labelEn: 'Import Code to Studio', icon: ArrowRightLeft },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
