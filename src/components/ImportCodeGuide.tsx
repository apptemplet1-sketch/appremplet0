import React, { useState } from 'react';
import { ProjectConfig } from '../types/migration';
import { FolderGit2, Terminal, ArrowRight, HelpCircle, Code2, Database, Send, Copy, Check } from 'lucide-react';

interface ImportCodeGuideProps {
  config: ProjectConfig;
  lang: 'ar' | 'en';
}

export const ImportCodeGuide: React.FC<ImportCodeGuideProps> = ({ config, lang }) => {
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const sampleUserPrompt = `أنا لدي مشروع سابق مبني بـ (${config.techStack}) وكان مرتبطاً بقاعدة بيانات (${config.databaseEngine}) باسم "${config.oldDbName}".
أريد نقل المشروع للشركة الجديدة "${config.newCompanyName}" وتغيير قاعدة البيانات إلى سيرفرهم الجديد.
إليك ملفات الاتصال ونموذج الـ schema الخاص بالمشروع السابق...`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(sampleUserPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-cyan-400" />
          <span>
            {lang === 'ar' ? 'كيف تجلب كود مشروعك وتنفذ النقل هنا الآن؟' : 'How to Bring Your Existing Project Code Here Now'}
          </span>
        </h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-3xl">
          {lang === 'ar'
            ? 'بما أن بيئة AI Studio تدعم تشغيل الأوامر وقراءة الملفات وإجراء التعديلات البرمجية، يمكنك البدء فوراً بأحد الخيارات التالية لنقوم باستبدال قاعدة البيانات وتجهيز المشروع لك مباشرة!'
            : 'Since AI Studio supports direct commands, file editing, and automated refactoring, choose any method below to bring your code and execute database reconfiguration immediately.'}
        </p>
      </div>

      {/* 3 Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Option 1: Git Clone */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 font-bold text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'استنساخ عبر Git' : 'Clone via Git'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'إذا كان لديك رابط مستودع GitHub للمشروع القديم (عام أو بمفتاح دخول)، أرسل الرابط في الشات، وسنقوم بتشغيل أمر clone واستخراج الملفات وتعديلها.'
                : 'Share your repository URL in the prompt, and we can run git clone, inspect code, and adapt database connections.'}
            </p>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300">
            git clone &lt;repo_url&gt;
          </div>
        </div>

        {/* Option 2: Paste Schema & Config Files */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 font-bold text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'لصق ملفات الإعداد والـ Schema' : 'Paste Config & Schemas'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'انسخ محتوى ملفات الربط مثل schema.prisma أو drizzle.schema أو firestore.rules أو ملفات الاتصال db.ts والصقها في الشات لكي نقوم بتعديلها وضبطها للشركة الجديدة.'
                : 'Paste your schema files (Prisma, Drizzle, SQL DDL, or Firebase configs) and we will rewrite them for the target client.'}
            </p>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
            schema.prisma / .env / db.ts
          </div>
        </div>

        {/* Option 3: Direct Cloud Provisioning */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 font-bold text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'تجهيز قاعدة سحابية جديدة الآن' : 'Provision Fresh Cloud DB'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'إذا أردت إنشاء قاعدة بيانات حقيقية سحابية لهذا المشروع الجديد الآن (Firebase Firestore أو Cloud SQL PostgreSQL)، أخبرنا لنقوم بإطلاقها مباشرة.'
                : 'Need a real cloud database instance provisioned right here? We can trigger Cloud SQL or Firebase setup tools on demand.'}
            </p>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300">
            Firebase / Cloud SQL Instant Setup
          </div>
        </div>
      </div>

      {/* Suggested Chat Prompt to Send Next */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white">
              {lang === 'ar' ? 'نموذج رسالة مقترحة لإرسالها في الشات:' : 'Suggested prompt to reply with:'}
            </h3>
          </div>
          <button
            onClick={copyPrompt}
            className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'نسخ النص ولصقه بالرد' : 'Copy Prompt'}</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {sampleUserPrompt}
        </pre>
      </div>
    </div>
  );
};
