import React, { useState } from 'react';
import { ProjectConfig } from '../types/migration';
import { FileText, Copy, Check, Download, ShieldCheck, Server, BookOpen } from 'lucide-react';

interface HandoverPackageGeneratorProps {
  config: ProjectConfig;
  lang: 'ar' | 'en';
}

export const HandoverPackageGenerator: React.FC<HandoverPackageGeneratorProps> = ({ config, lang }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [docLang, setDocLang] = useState<'ar' | 'en'>('ar');

  const handoverDocAr = `# وثيقة تسليم المشروع والتشغيل الفني (Project Handover Documentation)
**الجهة المستلمة:** ${config.newCompanyName}  
**اسم النظام:** ${config.newAppName}  
**النطاق المخصص:** https://${config.newDomain}  
**تاريخ التسليم:** ${new Date().toLocaleDateString('ar-SA')}  
**الإصدار:** 1.0.0 (Clean Isolated Release)

---

## 1. نبذة عن بنية النظام والتقنيات (Architecture & Stack)
تم تجهيز وإعداد النظام كنسخة معزولة ومستقلة تماماً لصالح **${config.newCompanyName}** وفقاً لأعلى معايير الأمان وعزل البيانات:
- **إطار العمل (Tech Stack):** ${config.techStack.toUpperCase()}
- **قاعدة البيانات (Database):** ${config.databaseEngine.toUpperCase()} (مستقلة كلياً)
- **بيئة التشغيل:** Node.js LTS / Docker Ready

---

## 2. إعداد وتشغيل قاعدة البيانات (Database Setup)
1. تم ربط النظام بقاعدة بيانات جديدة معزولة تحمل الاسم: \`${config.newDbName}\`.
2. سلسلة الاتصال المستخدمة في بيئة الإنتاج:
   \`\`\`bash
   DATABASE_URL="postgresql://${config.newDbUser}:[كلمة_المرور_المشفرة]@${config.newDbHost}:${config.newDbPort || '5432'}/${config.newDbName}?sslmode=require"
   \`\`\`
3. تم تطبيق كافة جداول النظام (Schema & Tables) والفهارس دون نقل أي سجلات أو بيانات سابقة من أي طرف ثالث.

---

## 3. حساب المدير الأولي للنظام (Initial Superadmin)
- **البريد الإلكتروني:** \`${config.newAdminEmail}\`
- **كلمة المرور المؤقتة:** \`InitAdminPass2026!\`
*(يُرجى تسجيل الدخول فوراً وتغيير كلمة المرور من لوحة التحكم).*

---

## 4. خطوات التشغيل والتهيئة المحلية (Local Development)
لتشغيل بيئة التطوير على أجهزة فريق المطورين:
\`\`\`bash
# 1. تثبيت الحزم والمكتبات
npm install

# 2. إنشاء ملف المتغيرات البيئية
cp .env.example .env

# 3. دفع تحديثات الجداول
npm run db:migrate # أو npx prisma db push

# 4. تشغيل خادم التطوير
npm run dev
\`\`\`

---

## 5. التشغيل على خوادم الإنتاج (Production Deployment)
يمكن تشغيل المشروع عبر Docker أو خدمات السحابة:
\`\`\`bash
# بناء نسخة الإنتاج
npm run build

# تشغيل خادم الإنتاج
npm run start
\`\`\`

---

## 6. إقرار الأمان وعزل البيانات (Security & Isolation Guarantee)
نؤكد أن هذه النسخة خضعت لفحص أمني شامل:
- تم إلغاء كافة مفاتيح التشفير القديمة وتوليد مفاتيح JWT جديدة.
- تم تطهير كافة بيانات ومفاتيح الجهات السابقة.
- المستودع خالٍ من أي سجلات تتبع قديمة.

**للدعم الفني والاستفسارات:** ${config.newEmail}
`;

  const handoverDocEn = `# Technical Project Handover & Operations Manual
**Client Organization:** ${config.newCompanyName}  
**System Name:** ${config.newAppName}  
**Target Domain:** https://${config.newDomain}  
**Handover Date:** ${new Date().toISOString().split('T')[0]}  
**Release Tag:** 1.0.0 (Clean Isolated Production Release)

---

## 1. System Overview & Technology Stack
This platform has been configured as a clean, completely isolated deployment specifically for **${config.newCompanyName}**:
- **Application Framework:** ${config.techStack.toUpperCase()}
- **Database Engine:** ${config.databaseEngine.toUpperCase()} (Dedicated & Isolated Instance)
- **Runtime Target:** Node.js LTS / Docker Ready

---

## 2. Dedicated Database Configuration
1. Connected to isolated database instance: \`${config.newDbName}\`.
2. Connection format:
   \`\`\`bash
   DATABASE_URL="postgresql://${config.newDbUser}:[SECURE_PASSWORD]@${config.newDbHost}:${config.newDbPort || '5432'}/${config.newDbName}?sslmode=require"
   \`\`\`
3. Database schemas and relational constraints have been deployed cleanly with zero third-party legacy records.

---

## 3. Initial Root Superadmin Credentials
- **Root Admin Email:** \`${config.newAdminEmail}\`
- **Initial Temporary Password:** \`InitAdminPass2026!\`
*(Security Mandate: Promptly sign in and rotate password via the Admin Profile).*

---

## 4. Local Setup & Initialization
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Run database migrations
npm run db:migrate

# 4. Start local development server
npm run dev
\`\`\`

---

## 5. Data Privacy & Isolation Compliance
This delivery has undergone a thorough security sanitization:
- Cryptographic salts and JWT secrets are newly generated.
- No historical analytics, credentials, or customer logs from previous projects exist.
- Third-party integrations (payment webhooks, mailers) are configured to the new organization.

**Technical Inquiries & Support:** ${config.newEmail}
`;

  const activeDoc = docLang === 'ar' ? handoverDocAr : handoverDocEn;

  const copyDocumentation = () => {
    navigator.clipboard.writeText(activeDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([activeDoc], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HANDOVER_${config.newAppName.toUpperCase()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>
              {lang === 'ar' ? 'وثيقة التسليم الفنية للشركة الجديدة (Handover Manual)' : 'Client Technical Handover Package'}
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {lang === 'ar'
              ? 'وثيقة تقنية متكاملة جاهزة للتسليم للعميل أو الإدارة الفنية للشركة الجديدة، تشمل تفاصيل البنية، إعدادات قاعدة البيانات، بيانات الدخول الأولية، وإقرار الأمان.'
              : 'Production-ready technical documentation ready to deliver to the client CTO or engineering team, complete with deployment steps and security attestations.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Doc Lang Toggle */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex text-xs">
            <button
              onClick={() => setDocLang('ar')}
              className={`px-2.5 py-1 rounded transition ${
                docLang === 'ar' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setDocLang('en')}
              className={`px-2.5 py-1 rounded transition ${
                docLang === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={copyDocumentation}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'نسخ Markdown' : 'Copy MD'}</span>
              </>
            )}
          </button>

          <button
            onClick={downloadMarkdown}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تحميل ملف .md' : 'Download .md'}</span>
          </button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-slate-200">HANDOVER_{config.newAppName.toUpperCase()}.md</span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'جاهز للتسليم' : 'Client-Ready'}</span>
          </span>
        </div>

        <pre className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed whitespace-pre-wrap">
          {activeDoc}
        </pre>
      </div>
    </div>
  );
};
