import React, { useState } from 'react';
import { ProjectConfig, DatabaseEngine } from '../types/migration';
import { DB_ENGINE_DETAILS } from '../data/migrationData';
import { Database, Server, Key, Copy, Check, ShieldAlert, Cpu, Layers, Sparkles, FileCode2 } from 'lucide-react';

interface DatabaseMigratorToolProps {
  config: ProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProjectConfig>>;
  lang: 'ar' | 'en';
}

export const DatabaseMigratorTool: React.FC<DatabaseMigratorToolProps> = ({
  config,
  setConfig,
  lang,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dbPassword, setDbPassword] = useState<string>('P@ssw0rd_Nova_2026!');
  const [sslEnabled, setSslEnabled] = useState<boolean>(true);
  const [selectedOrm, setSelectedOrm] = useState<string>('Prisma');

  const currentDetails = DB_ENGINE_DETAILS[config.databaseEngine];

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateConnectionString = (): string => {
    switch (config.databaseEngine) {
      case 'postgresql':
        return `postgresql://${config.newDbUser}:${dbPassword}@${config.newDbHost}:${config.newDbPort || '5432'}/${config.newDbName}?sslmode=${sslEnabled ? 'require' : 'disable'}`;
      case 'supabase':
        return `DATABASE_URL="postgresql://postgres.${config.newDbName}:${dbPassword}@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"\nNEXT_PUBLIC_SUPABASE_URL="https://${config.newAppName}.supabase.co"\nNEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new-anon-key-here"`;
      case 'firebase':
        return `VITE_FIREBASE_PROJECT_ID="${config.newAppName}-prod"\nVITE_FIREBASE_API_KEY="AIzaSy${config.newAppName.slice(0, 10)}ProdKey"\nVITE_FIREBASE_AUTH_DOMAIN="${config.newAppName}-prod.firebaseapp.com"\nVITE_FIREBASE_STORAGE_BUCKET="${config.newAppName}-prod.appspot.com"`;
      case 'mongodb':
        return `mongodb+srv://${config.newDbUser}:${dbPassword}@${config.newDbHost}/${config.newDbName}?retryWrites=true&w=majority`;
      case 'mysql':
        return `mysql://${config.newDbUser}:${dbPassword}@${config.newDbHost}:${config.newDbPort || '3306'}/${config.newDbName}?ssl={"rejectUnauthorized":${sslEnabled}}`;
      case 'sqlite':
        return `DATABASE_URL="file:./data/${config.newAppName}_clean.db"`;
      default:
        return '';
    }
  };

  const exportScript = currentDetails.exportCommand(config.oldDbName, 'old-server.corp.com', 'old_user');
  const importScript = currentDetails.importCommand(config.newDbName, config.newDbHost, config.newDbUser);

  const cleanSeedSql = `-- ========================================================
-- סكريبت تهيئة بيانات البداية النظيفة للشركة الجديدة: ${config.newCompanyName}
-- تم التوليد بواسطة Project Duplicator & DB Migration Hub
-- ========================================================

-- 1. إعادة ضبط عدادات التسلسل (Sequence Reset) حتى تبدأ المعرفات من 1
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;
-- ALTER SEQUENCE orders_id_seq RESTART WITH 1;

-- 2. إدخال حساب المسؤول الأولي (Superadmin)
INSERT INTO users (
  email, 
  full_name, 
  role, 
  is_active, 
  created_at
) VALUES (
  '${config.newAdminEmail}', 
  'مدير النظام الأولي (${config.newCompanyName})', 
  'superadmin', 
  true, 
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 3. إعدادات النظام وهوية الشركة الجديدة
INSERT INTO system_settings (
  setting_key, 
  setting_value, 
  updated_at
) VALUES 
  ('company_name', '${config.newCompanyName}', NOW()),
  ('company_domain', '${config.newDomain}', NOW()),
  ('support_email', '${config.newEmail}', NOW()),
  ('primary_brand_color', '${config.primaryColor}', NOW())
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;
`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>
                {lang === 'ar' ? 'مهندس نقل وعزل قاعدة البيانات' : 'Database Engine Studio & Migration Hub'}
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {lang === 'ar'
                ? 'استخرج هيكل الجداول والسياسات فقط دون لمس سجلات العملاء السابقين، وقم بتوليد سلاسل الاتصال الآمنة وسكريبتات التهيئة الأولية للشركة الجديدة.'
                : 'Extract schema structure, views, and RLS policies cleanly without previous customer data. Generate secured connection strings and seed templates.'}
            </p>
          </div>

          {/* Engine Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{lang === 'ar' ? 'المحرك:' : 'Engine:'}</span>
            <select
              value={config.databaseEngine}
              onChange={(e) => setConfig((prev) => ({ ...prev, databaseEngine: e.target.value as DatabaseEngine }))}
              className="bg-slate-950 border border-cyan-800/60 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-medium focus:outline-none"
            >
              <option value="postgresql">PostgreSQL (Standard / Cloud SQL)</option>
              <option value="supabase">Supabase (PostgreSQL BaaS)</option>
              <option value="firebase">Firebase Firestore</option>
              <option value="mongodb">MongoDB / Atlas</option>
              <option value="mysql">MySQL / PlanetScale</option>
              <option value="sqlite">SQLite / Turso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Credentials & Connection String */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left: Connection Parameters Form */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'معلومات اتصال القاعدة للشركة الجديدة' : 'New Client Database Parameters'}</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
              {currentDetails.badge}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">
                {lang === 'ar' ? 'اسم قاعدة البيانات (DB Name):' : 'Database Name:'}
              </label>
              <input
                type="text"
                value={config.newDbName}
                onChange={(e) => setConfig((p) => ({ ...p, newDbName: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">
                {lang === 'ar' ? 'مضيف السيرفر (Host/Domain):' : 'Host / Endpoint:'}
              </label>
              <input
                type="text"
                value={config.newDbHost}
                onChange={(e) => setConfig((p) => ({ ...p, newDbHost: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">
                {lang === 'ar' ? 'اسم المستخدم (Database User):' : 'Database User:'}
              </label>
              <input
                type="text"
                value={config.newDbUser}
                onChange={(e) => setConfig((p) => ({ ...p, newDbUser: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">
                {lang === 'ar' ? 'المنفذ الافتراضي (Port):' : 'Port:'}
              </label>
              <input
                type="text"
                value={config.newDbPort || currentDetails.defaultPort}
                onChange={(e) => setConfig((p) => ({ ...p, newDbPort: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="text-slate-400 text-[11px] block mb-1">
                {lang === 'ar' ? 'كلمة المرور الآمنة (Password):' : 'Secure Password:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setDbPassword(`N0v@_${Math.random().toString(36).substring(2, 9)}!2026`)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
                >
                  {lang === 'ar' ? 'توليد عشوائي' : 'Randomize'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sslEnabled}
                onChange={(e) => setSslEnabled(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>{lang === 'ar' ? 'إلزام الاتصال المشفر SSL (sslmode=require)' : 'Enforce SSL Connection (Production)'}</span>
            </label>
          </div>
        </div>

        {/* Right: Generated Connection String */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'سلسلة الاتصال المجهزة لملف .env' : 'Sanitized .env Connection String'}</span>
              </div>
              <button
                onClick={() => copyText(generateConnectionString(), 'conn-str')}
                className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                {copiedKey === 'conn-str' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'نسخ السلسلة' : 'Copy String'}</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[11px] text-slate-400 mb-2">
              {lang === 'ar'
                ? 'انسخ هذا السطر وضعه مباشرة داخل ملف .env الخاص بالتطبيق عند تشغيله للشركة الجديدة:'
                : 'Paste this direct environment line into the application .env file for the new client:'}
            </p>

            <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
              {generateConnectionString()}
            </pre>
          </div>

          {/* Security Notice */}
          <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-300 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">
                {lang === 'ar' ? 'تنبيه عزل البيانات الصارم:' : 'Data Isolation Mandate:'}
              </span>
              <span>
                {lang === 'ar'
                  ? 'لا تقم إطلاقاً بربط التطبيق بنفس قاعدة بيانات الشركة القديمة ولو لغرض التجربة، لمنع أي تداخل بين الجلسات والطلبات وسجلات المستخدمين.'
                  : 'Never connect the duplicated application to the previous client database even for testing. Ensure separate database credentials.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Migration Commands: Export & Import */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Step 1: Export Schema Only */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'أمر استخراج الهيكل النظيف (Schema Only)' : 'Schema-Only Export Command'}</span>
            </h3>
            <button
              onClick={() => copyText(exportScript, 'export-cmd')}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition"
            >
              {copiedKey === 'export-cmd' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {lang === 'ar' ? 'تم!' : 'Copied'}
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
              ? 'ينشئ هذا الأمر ملف schema_clean.sql يحتوي فقط على الجداول والفهارس والعلاقات دون أي صفوف سابقة.'
              : 'Creates schema_clean.sql containing solely tables, foreign keys, and indexes without existing client rows.'}
          </p>
          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
            {exportScript}
          </pre>
        </div>

        {/* Step 2: Import into New Server */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'أمر استيراد الهيكل في قاعدة الشركة الجديدة' : 'Target DB Import & Initialization'}</span>
            </h3>
            <button
              onClick={() => copyText(importScript, 'import-cmd')}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition"
            >
              {copiedKey === 'import-cmd' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {lang === 'ar' ? 'تم!' : 'Copied'}
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
              ? 'إنشاء قاعدة البيانات الفارغة ثم ضخ هيكل الجداول مباشرة إلى خادم الشركة الجديدة.'
              : 'Create blank database and deploy clean table schemas directly to the target host.'}
          </p>
          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            {importScript}
          </pre>
        </div>
      </div>

      {/* ORM Automation Section */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white">
              {lang === 'ar' ? 'إذا كنت تستخدم ORM (Prisma / Drizzle / Django / Laravel):' : 'Using an ORM (Prisma / Drizzle / Django / Laravel):'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {lang === 'ar' ? 'الطريقة الأسهل دون تصدير واستيراد يدوي' : 'Recommended approach: execute ORM migrations'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
          {currentDetails.ormInstructions.map((orm) => (
            <div
              key={orm.name}
              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between gap-2"
            >
              <div>
                <span className="text-xs font-bold text-cyan-300 block">{orm.name}</span>
                <code className="text-[11px] text-slate-300 font-mono block mt-1 break-all">
                  {orm.command}
                </code>
              </div>
              <button
                onClick={() => copyText(orm.command, `orm-${orm.name}`)}
                className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center justify-end gap-1 transition self-end"
              >
                {copiedKey === `orm-${orm.name}` ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> {lang === 'ar' ? 'تم' : 'Done'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy className="w-2.5 h-2.5" /> {lang === 'ar' ? 'نسخ الأمر' : 'Copy'}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Seed SQL Generator */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white">
              {lang === 'ar'
                ? `سكريبت بذر البيانات الأولي (Clean Seed SQL) للشركة: ${config.newCompanyName}`
                : `Clean Initial Seed Script for: ${config.newCompanyName}`}
            </h3>
          </div>
          <button
            onClick={() => copyText(cleanSeedSql, 'seed-sql')}
            className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            {copiedKey === 'seed-sql' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{lang === 'ar' ? 'تم نسخ السكريبت!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'نسخ سكريبت SQL' : 'Copy SQL Script'}</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          {lang === 'ar'
            ? 'يقوم هذا السكريبت بإعادة ضبط عدادات التسلسل وإدخال أول مدير للنظام مع إعدادات النطاق الجديد دون أي بقايا من العميل السابق.'
            : 'Resets ID counters, seeds the first root administrator, and initializes system settings with the new company credentials.'}
        </p>

        <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
          {cleanSeedSql}
        </pre>
      </div>

      {/* Critical Rules for the Selected Engine */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{lang === 'ar' ? `قواعد ذهبية خاصة بمحرك (${currentDetails.title}):` : `Crucial Migration Rules for (${currentDetails.title}):`}</span>
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
          {currentDetails.criticalRules.map((rule, rIdx) => (
            <li key={rIdx} className="text-slate-300">
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
