import React, { useState } from 'react';
import { ProjectConfig } from '../types/migration';
import { ShieldCheck, Copy, Check, Lock, RefreshCw, AlertTriangle, Key, Download } from 'lucide-react';

interface EnvSanitizerProps {
  config: ProjectConfig;
  lang: 'ar' | 'en';
}

export const EnvSanitizer: React.FC<EnvSanitizerProps> = ({ config, lang }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Generate random tokens for new secrets
  const [jwtSecret, setJwtSecret] = useState<string>(() => 
    'sec_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + '!'
  );
  const [nextAuthSecret, setNextAuthSecret] = useState<string>(() => 
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );

  const rotateSecrets = () => {
    setJwtSecret('sec_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + '!');
    setNextAuthSecret(Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2));
  };

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const newEnvContent = `# ========================================================
# بيئة التشغيل للشركة الجديدة: ${config.newCompanyName}
# تم التوليد وتطهير المفاتيح بواسطة Duplicator Hub
# ========================================================

# 1. تعريف التطبيق والنطاق
NODE_ENV=production
APP_NAME="${config.newAppName}"
APP_URL="https://${config.newDomain}"
NEXT_PUBLIC_APP_URL="https://${config.newDomain}"
SUPPORT_EMAIL="${config.newEmail}"

# 2. قاعدة البيانات الخاصة بالشركة الجديدة
DATABASE_URL="${config.databaseEngine === 'postgresql' ? `postgresql://${config.newDbUser}:NEW_STRONG_PASSWORD@${config.newDbHost}:${config.newDbPort || '5432'}/${config.newDbName}?sslmode=require` : `mongodb+srv://${config.newDbUser}:NEW_PASSWORD@${config.newDbHost}/${config.newDbName}`}"

# 3. مفاتيح التشفير وتأمين الجلسات (تم توليدها جديدة لمنع اختراق جلسات الشركة السابقة)
JWT_SECRET="${jwtSecret}"
NEXTAUTH_SECRET="${nextAuthSecret}"
SESSION_SECRET="sess_${nextAuthSecret.slice(0, 16)}"

# 4. بوابات الدفع (يجب استبدالها بمفاتيح الحساب التجاري الجديد للشركة)
STRIPE_PUBLISHABLE_KEY="pk_live_REPLACE_WITH_NEW_COMPANY_STRIPE_PK"
STRIPE_SECRET_KEY="sk_live_REPLACE_WITH_NEW_COMPANY_STRIPE_SK"
STRIPE_WEBHOOK_SECRET="whsec_REPLACE_WITH_NEW_ENDPOINT_WEBHOOK_SECRET"

# 5. مزودات البريد الإلكتروني والرسائل (SMTP / Resend / SendGrid)
SMTP_HOST="smtp.resend.com"
SMTP_PORT=465
SMTP_USER="resend"
SMTP_PASS="re_NEW_COMPANY_KEY_HERE"
EMAIL_FROM="${config.newEmail}"

# 6. التخزين السحابي للملفات (AWS S3 / Cloudflare R2)
S3_BUCKET_NAME="${config.newAppName}-media-assets"
S3_REGION="eu-central-1"
S3_ACCESS_KEY="NEW_IAM_KEY_ID"
S3_SECRET_KEY="NEW_IAM_SECRET_KEY"

# 7. مزودات تسجيل الدخول (OAuth - Google / Apple)
GOOGLE_CLIENT_ID="new-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-NEW_SECRET_FOR_${config.newAppName.toUpperCase()}"
`;

  const exampleEnvContent = `# .env.example
# يتم تسليم هذا الملف كنموذج إرشادي لفريق الديف أوبس أو المطورين لدى الشركة الجديدة

APP_NAME=
APP_URL=
DATABASE_URL=
JWT_SECRET=
NEXTAUTH_SECRET=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
SMTP_HOST=
SMTP_PASS=
EMAIL_FROM=
S3_BUCKET_NAME=
GOOGLE_CLIENT_ID=
`;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>
              {lang === 'ar' ? 'تطهير ملفات البيئة والمفاتيح السرية (.env Sanitizer)' : 'Environment & Secrets Sanitizer'}
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {lang === 'ar'
              ? 'توليد ملف .env جديد كلياً مع تدوير مفاتيح التشفير (JWT / Session Secrets) لضمان إبطال أي جلسات للمستخدمين السابقين، واستبدال مفاتيح بوابات الدفع والتخزين السحابي.'
              : 'Regenerate environment configurations with freshly rotated encryption keys to invalidate old session tokens, and purge former payment & storage secrets.'}
          </p>
        </div>

        <button
          onClick={rotateSecrets}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition border border-slate-700 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'ar' ? 'إعادة تدوير مفاتيح JWT' : 'Rotate Cryptographic Keys'}</span>
        </button>
      </div>

      {/* Warning Alert */}
      <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 flex items-start gap-2.5 text-amber-300 text-xs">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            {lang === 'ar' ? 'فحص أمان صارم قبل التسليم:' : 'Strict Security Checklist Before Delivery:'}
          </p>
          <p className="text-amber-200/90 leading-relaxed">
            {lang === 'ar'
              ? 'إذا لم تقم بتغيير JWT_SECRET، فبإمكان أي مستخدم من الشركة القديمة يحمل رمز دخول قديم تسجيل الدخول إلى نظام الشركة الجديدة إن تطابقت المعرفات! كما أن ترك مفاتيح Stripe القديمة سيتسبب في توجيه أموال الشركة الجديدة إلى حساب الشركة السابقة.'
              : 'Failing to rotate JWT_SECRET allows old company tokens to authenticate against the new instance. Retaining old Stripe keys will divert customer payments to the former business.'}
          </p>
        </div>
      </div>

      {/* Side-by-side or stacked .env displays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left: Production .env for Target Client */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">
                {lang === 'ar' ? 'ملف .env المُطهر للشركة الجديدة (جاهز للتشغيل):' : 'Sanitized Production .env (Ready to deploy):'}
              </h3>
            </div>
            
            <button
              onClick={() => copyToClipboard(newEnvContent, 'prod-env')}
              className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              {copiedType === 'prod-env' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'نسخ ملف .env كامل' : 'Copy Full .env'}</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[460px] overflow-y-auto">
            {newEnvContent}
          </pre>
        </div>

        {/* Right: .env.example for repository handover */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">
                {lang === 'ar' ? 'ملف .env.example للتسليم:' : '.env.example for Repo:'}
              </h3>
              <button
                onClick={() => copyToClipboard(exampleEnvContent, 'example-env')}
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition"
              >
                {copiedType === 'example-env' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> {lang === 'ar' ? 'تم' : 'Done'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy className="w-3 h-3" /> {lang === 'ar' ? 'نسخ' : 'Copy'}
                  </span>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === 'ar'
                ? 'هذا هو الملف الوحيد الذي يجب رفعه إلى Git مستودع الشركة الجديدة بدون أي قيم سرية فعلية.'
                : 'The only file committed to Git for the new organization repository.'}
            </p>
            <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {exampleEnvContent}
            </pre>
          </div>

          {/* Key Checklist */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <span className="text-cyan-400 font-bold block text-[11px]">
              {lang === 'ar' ? 'قائمة التحقق من المفاتيح المستبدلة:' : 'Key Replacement Verification:'}
            </span>
            <div className="text-slate-400 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>قاعدة البيانات (Database Connection)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>رموز التشفير والـ JWT (New Cryptographic Salts)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>بوابات الدفع (Payment Gateway Keys)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>حسابات البريد والتخزين السحابي (S3 & SMTP)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
