import React, { useState } from 'react';
import { ProjectConfig, ChecklistStep } from '../types/migration';
import { CHECKLIST_STEPS } from '../data/migrationData';
import { Check, Copy, AlertTriangle, ShieldCheck, Terminal, Lightbulb, ExternalLink } from 'lucide-react';

interface InteractiveChecklistProps {
  config: ProjectConfig;
  completedSteps: Set<string>;
  toggleStep: (id: string) => void;
  lang: 'ar' | 'en';
}

export const InteractiveChecklist: React.FC<InteractiveChecklistProps> = ({
  config,
  completedSteps,
  toggleStep,
  lang,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [filterPhase, setFilterPhase] = useState<string>('all');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getDynamicCommand = (cmd: string): string => {
    return cmd
      .replace(/<رابط-مستودع-المشروع-القديم>/g, `https://github.com/my-org/${config.oldAppName}.git`)
      .replace(/new-client-project/g, `${config.newAppName}`)
      .replace(/old_db/g, config.oldDbName)
      .replace(/new_db/g, config.newDbName)
      .replace(/alofuq_admin/g, config.newDbUser)
      .replace(/db\.alofuq-tech\.sa/g, config.newDbHost)
      .replace(/alofuq_core_db/g, config.newDbName)
      .replace(/superadmin@alofuq-tech\.sa/g, config.newAdminEmail);
  };

  const phases = [
    { id: 'all', labelAr: 'جميع الخطوات', labelEn: 'All Phases' },
    { id: 'clone', labelAr: '١. عزل الكود و Git', labelEn: '1. Git Isolation' },
    { id: 'database', labelAr: '٢. قاعدة البيانات', labelEn: '2. Database' },
    { id: 'env', labelAr: '٣. المفاتيح والبيئة', labelEn: '3. Secrets & Env' },
    { id: 'cleansing', labelAr: '٤. تطهير البيانات', labelEn: '4. Data Sanitization' },
    { id: 'rebranding', labelAr: '٥. الهوية والاسم', labelEn: '5. Rebranding' },
    { id: 'handover', labelAr: '٦. التسليم النهائي', labelEn: '6. Handover' },
  ];

  const filteredSteps = filterPhase === 'all'
    ? CHECKLIST_STEPS
    : CHECKLIST_STEPS.filter((s) => s.phase === filterPhase);

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>
                {lang === 'ar'
                  ? `خارطة طريق نقل المشروع من (${config.oldCompanyName}) إلى (${config.newCompanyName})`
                  : `Migration Roadmap: (${config.oldCompanyName}) → (${config.newCompanyName})`}
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {lang === 'ar'
                ? 'اتبع هذه الخطوات التفاعلية الدقيقة لضمان عزل تام لسجل التغييرات، وتطهير أي بيانات تخص العميل السابق، وربط قاعدة البيانات الجديدة بنجاح.'
                : 'Follow this structured engineering protocol to cleanly detach commit history, sanitize client data, reconfigure databases, and prepare production handover.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">
              {lang === 'ar' ? 'المتبقي:' : 'Remaining:'}
            </span>
            <span className="font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/40">
              {CHECKLIST_STEPS.length - completedSteps.size} {lang === 'ar' ? 'خطوات' : 'steps'}
            </span>
          </div>
        </div>

        {/* Phase Filter Controls */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto">
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPhase(p.id)}
              className={`px-2.5 py-1 text-xs rounded-md transition ${
                filterPhase === p.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {lang === 'ar' ? p.labelAr : p.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Step Cards List */}
      <div className="space-y-4">
        {filteredSteps.map((step, idx) => {
          const isDone = completedSteps.has(step.id);
          const fullCommandBlock = step.commands
            ? step.commands.map((c) => getDynamicCommand(c)).join('\n')
            : '';

          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all duration-200 ${
                isDone
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  : 'bg-slate-900/80 border-slate-800 shadow-md'
              }`}
            >
              <div className="p-4 sm:p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleStep(step.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-700 bg-slate-800 hover:border-cyan-500'
                      }`}
                      aria-label="تحديد الخطوة كمكتملة"
                    >
                      {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {lang === 'ar' ? step.titleAr : step.titleEn}
                        </h3>

                        {/* Risk Indicator (Unboxed, typography styled) */}
                        <span className="text-[11px] font-mono flex items-center gap-1">
                          {step.riskLevel === 'high' && (
                            <span className="text-rose-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {lang === 'ar' ? 'درجة أمان قصوى' : 'Critical Security'}
                            </span>
                          )}
                          {step.riskLevel === 'medium' && (
                            <span className="text-amber-400">
                              {lang === 'ar' ? 'مستوى متوسط' : 'Medium Priority'}
                            </span>
                          )}
                          {step.riskLevel === 'low' && (
                            <span className="text-slate-400">
                              {lang === 'ar' ? 'إجراء تنظيمي' : 'Routine'}
                            </span>
                          )}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {lang === 'ar' ? step.descriptionAr : step.descriptionEn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Runnable Commands Block */}
                {step.commands && step.commands.length > 0 && (
                  <div className="mt-4 rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden">
                    <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Terminal Execution</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(fullCommandBlock, step.id)}
                        className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 transition"
                      >
                        {copiedIndex === step.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'نسخ الأوامر' : 'Copy Block'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-xs text-slate-200 overflow-x-auto font-mono leading-relaxed bg-slate-950/70">
                      {step.commands.map((cmd, cIdx) => (
                        <div key={cIdx} className={cmd.startsWith('#') ? 'text-slate-500 italic' : 'text-emerald-300'}>
                          {getDynamicCommand(cmd)}
                        </div>
                      ))}
                    </pre>
                  </div>
                )}

                {/* Tips & Recommendations */}
                {((lang === 'ar' && step.tipsAr) || (lang === 'en' && step.tipsEn)) && (
                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-start gap-2 text-xs text-slate-400">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <ul className="space-y-1 list-disc list-inside">
                      {(lang === 'ar' ? step.tipsAr : step.tipsEn)?.map((tip, tIdx) => (
                        <li key={tIdx} className="text-slate-300">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
