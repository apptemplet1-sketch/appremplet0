import { ChecklistStep, DatabaseEngine } from '../types/migration';

export const DEFAULT_CONFIG = {
  oldCompanyName: 'شركة النور القديمة',
  newCompanyName: 'شركة الأفق الحديثة',
  oldAppName: 'al-noor-portal',
  newAppName: 'al-ofuq-app',
  oldDomain: 'alnoor-corp.com',
  newDomain: 'alofuq-tech.sa',
  oldEmail: 'support@alnoor-corp.com',
  newEmail: 'contact@alofuq-tech.sa',
  techStack: 'nextjs' as const,
  databaseEngine: 'postgresql' as const,
  oldDbName: 'alnoor_production_db',
  newDbName: 'alofuq_core_db',
  newDbHost: 'db.alofuq-tech.sa',
  newDbUser: 'alofuq_admin',
  newDbPort: '5432',
  newAdminEmail: 'superadmin@alofuq-tech.sa',
  primaryColor: '#0ea5e9',
};

export const CHECKLIST_STEPS: ChecklistStep[] = [
  {
    id: 'git-clean-clone',
    phase: 'clone',
    titleAr: 'فصل مستودع Git وحذف سجل التغييرات القديم',
    titleEn: 'Detach Git Repository & Purge Commit History',
    descriptionAr: 'من الضروري عدم تسليم مستودع Git يحتوي على commit history الخاص بالشركة القديمة، لأن السجل قد يحتوي على مفاتيح سرية سابقة أو أسماء عملاء وملاحظات داخلية.',
    descriptionEn: 'Never hand over the original git history to a new client. Old commits frequently contain leaked API keys, previous client data, and internal comments.',
    riskLevel: 'high',
    commands: [
      '# 1. استنساخ المشروع في مجلد جديد بدون تاريخ قديم أو فصل الـ .git',
      'git clone --depth 1 <رابط-مستودع-المشروع-القديم> new-client-project',
      'cd new-client-project',
      '# 2. حذف مجلد git القديم بالكامل',
      'rm -rf .git',
      '# 3. إنشاء مستودع git نظيف جديد للشركة الجديدة',
      'git init',
      'git branch -M main',
      'git add .',
      'git commit -m "feat: Initial clean release for new organization"'
    ],
    tipsAr: [
      'تأكد من عدم وجود ملفات سرية متجاهلة مثل .env في المجلد قبل الرفع.',
      'افحص ملف .gitignore للتأكد من استثناء node_modules و .env و build artifacts.'
    ],
    tipsEn: [
      'Verify that no ignored secret files like .env exist before staging.',
      'Ensure .gitignore properly excludes node_modules, keys, and build artifacts.'
    ]
  },
  {
    id: 'db-schema-isolation',
    phase: 'database',
    titleAr: 'تصدير هيكل قاعدة البيانات فقط (Schema Only) دون بيانات العملاء',
    titleEn: 'Export Database Schema Only (Zero Customer Data)',
    descriptionAr: 'أكبر خطأ قانوني وأمني هو نقل بيانات المستخدمين أو السجلات المالية للشركة الأولى. يجب استخراج الـ Schema ومفاتيح الجداول فقط دون أي صفوف (Rows) فعلية.',
    descriptionEn: 'Transferring old user records or billing data is a severe legal and security violation. Export only tables, triggers, and relations with zero data rows.',
    riskLevel: 'high',
    commands: [
      '# لبراعم PostgreSQL (هيكل فقط بدون بيانات):',
      'pg_dump -U username -h old-host -d old_db --schema-only -f schema_clean.sql',
      '# لاستيراد الهيكل في قاعدة بيانات الشركة الجديدة:',
      'psql -U new_user -h new-host -d new_db -f schema_clean.sql'
    ],
    tipsAr: [
      'إذا كنت تستخدم ORM مثل Prisma أو Drizzle أو TypeORM، لا داعي لتصدير الـ SQL اليدوي! يكفي تطبيق المايجريشن مباشرة: npx prisma migrate deploy.',
      'إذا كانت هناك جداول ثوابت (Lookup Tables / Enums / Countries)، يمكنك تصديرها وحدها كـ Seed Data.'
    ]
  },
  {
    id: 'db-connection-switch',
    phase: 'database',
    titleAr: 'تحديث بيانات الاتصال بقاعدة البيانات في ملف البيئة',
    titleEn: 'Update Database Connection String in Environment',
    descriptionAr: 'تغيير اسم الخادم (Host)، والمستخدم، وكلمة المرور، والمنفذ ليرتبط بالسيرفر الخاص بالشركة الجديدة أو بحسابهم السحابي (Supabase / Neon / AWS RDS).',
    descriptionEn: 'Point application connection pools to the new company infrastructure or dedicated cloud instance.',
    riskLevel: 'medium',
    commands: [
      '# في ملف .env الجديد للشركة الجديدة:',
      'DATABASE_URL="postgresql://alofuq_admin:STRONG_PASSWORD_HERE@db.alofuq-tech.sa:5432/alofuq_core_db?sslmode=require"'
    ]
  },
  {
    id: 'clean-admin-seed',
    phase: 'cleansing',
    titleAr: 'إنشاء حساب مدير أولي نظيف (Initial Superadmin Seed)',
    titleEn: 'Seed Clean Initial Superadmin & System Defaults',
    descriptionAr: 'يجب أن تبدأ الشركة الجديدة بحساب مدير وحيد نظيف، مع تفعيل خاصية طلب تغيير كلمة المرور عند أول تسجيل دخول.',
    descriptionEn: 'The new client needs an initial root administrator account, ideally prompting for a password change on first sign-in.',
    riskLevel: 'medium',
    commands: [
      '# تشغيل سكريبت البذر النظيف:',
      'npm run db:seed -- --email=superadmin@alofuq-tech.sa --temp-password=CleanInitialPass2026!'
    ]
  },
  {
    id: 'secrets-purge',
    phase: 'env',
    titleAr: 'تطهير المفاتيح الخارجية (Payment / Email / Cloud Storage)',
    titleEn: 'Rotate & Purge Third-Party API Keys & Webhooks',
    descriptionAr: 'استبدال جميع المفاتيح المرتبطة بحسابات الشركة الأولى: Stripe / PayTabs، SendGrid / Resend، AWS S3 / Cloudflare R2، و Google OAuth Credentials.',
    descriptionEn: 'Never leave payment gateway keys, SMTP credentials, or OAuth client IDs belonging to the former company in the config.',
    riskLevel: 'high',
    tipsAr: [
      'إذا استخدمت Google Sign-in، يجب إنشاء Project جديد في Google Cloud Console وإضافة الدومين الجديد في Authorized Origins.',
      'استبدل Webhook Secrets لـ Stripe حتى لا ترسل الأحداث لحساب الشركة القديمة.'
    ]
  },
  {
    id: 'rebrand-and-metadata',
    phase: 'rebranding',
    titleAr: 'تحديث الهوية البصرية، اسم المشروع، والنصوص التعاقدية',
    titleEn: 'White-Label Rebranding: Assets, Titles & Copyrights',
    descriptionAr: 'تغيير الشعار (Logo/Favicon)، نصوص التذييل (Footer Copyright)، شروط الاستخدام، عنوان التطبيق في package.json و index.html.',
    descriptionEn: 'Replace logos, favicons, meta titles, package.json names, Terms of Service, and privacy policies.',
    riskLevel: 'low'
  },
  {
    id: 'handover-docs',
    phase: 'handover',
    titleAr: 'إعداد وثيقة التسليم الفنية ودليل التشغيل (Handover Package)',
    titleEn: 'Generate Handover Technical Documentation',
    descriptionAr: 'تجهيز ملف README.md و HANDOVER.md يحتوي على متطلبات التشغيل، وأوامر التهيئة، وحسابات الدخول، ونسخ الاحتياط.',
    descriptionEn: 'Prepare structured developer-ready documentation including setup instructions, deployment checklist, and credentials guide.',
    riskLevel: 'low'
  }
];

export interface DbEngineDetails {
  title: string;
  badge: string;
  defaultPort: string;
  envFormat: string;
  exportCommand: (oldDb: string, oldHost?: string, oldUser?: string) => string;
  importCommand: (newDb: string, newHost?: string, newUser?: string) => string;
  seedCommand: string;
  ormInstructions: {
    name: string;
    command: string;
  }[];
  criticalRules: string[];
}

export const DB_ENGINE_DETAILS: Record<DatabaseEngine, DbEngineDetails> = {
  postgresql: {
    title: 'PostgreSQL / Supabase / Neon / Cloud SQL',
    badge: 'Relational SQL',
    defaultPort: '5432',
    envFormat: 'postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}?sslmode=require',
    exportCommand: (oldDb, oldHost = 'old-db-server.com', oldUser = 'postgres') => 
      `# 1. تصدير الجداول فقط بدون بيانات العملاء (Schema Only):\npg_dump -U ${oldUser} -h ${oldHost} -d ${oldDb} --schema-only --no-owner --no-privileges -f schema_clean.sql\n\n# 2. إذا رغبت في استخراج جداول الإعدادات العامة فقط دون جداول المستخدمين والطلبات:\npg_dump -U ${oldUser} -h ${oldHost} -d ${oldDb} -t countries -t app_settings -t permissions --data-only -f seeds_meta.sql`,
    importCommand: (newDb, newHost = 'new-db.alofuq-tech.sa', newUser = 'alofuq_admin') => 
      `# 1. إنشاء قاعدة البيانات الجديدة على السيرفر الجديد:\ncreatedb -U ${newUser} -h ${newHost} ${newDb}\n\n# 2. استيراد الهيكل النظيف:\npsql -U ${newUser} -h ${newHost} -d ${newDb} -f schema_clean.sql\n\n# 3. استيراد جداول الثوابت (إن وجدت):\npsql -U ${newUser} -h ${newHost} -d ${newDb} -f seeds_meta.sql`,
    seedCommand: 'npm run db:seed:admin -- --email=superadmin@newcompany.com',
    ormInstructions: [
      { name: 'Prisma', command: 'npx prisma db push --skip-generate && npx prisma db seed' },
      { name: 'Drizzle', command: 'npx drizzle-kit push && npx tsx src/db/seed.ts' },
      { name: 'TypeORM', command: 'npx typeorm migration:run -d src/data-source.ts' },
      { name: 'Django', command: 'python manage.py migrate && python manage.py createsuperuser' },
      { name: 'Laravel', command: 'php artisan migrate --force && php artisan db:seed' }
    ],
    criticalRules: [
      'استخدم علم --schema-only دائماً لمنع تسريب بيانات العملاء القدامى.',
      'احذف المعرفات التسلسلية (Sequences) أو أعد ضبطها حتى لا تبدأ أرقام الفواتير من أرقام الشركة القديمة.',
      'تأكد من تفعيل SSL (sslmode=require) في بيئة الإنتاج الخاصة بالشركة الجديدة.'
    ]
  },
  supabase: {
    title: 'Supabase (Hosted Postgres + Auth + Storage)',
    badge: 'Backend-as-a-Service',
    defaultPort: '5432',
    envFormat: 'NEXT_PUBLIC_SUPABASE_URL=https://{PROJECT_REF}.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY={NEW_ANON_KEY}\nSUPABASE_SERVICE_ROLE_KEY={NEW_SERVICE_ROLE_KEY}\nDATABASE_URL=postgresql://postgres.{PROJECT_REF}:{PASSWORD}@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true',
    exportCommand: (oldDb) => 
      `# 1. في لوحة تحكم Supabase القديمة أو عبر CLI:\nsupabase db dump --schema-only -f supabase_schema.sql\n\n# 2. تصدير سياسات الأمان (RLS Policies):\nsupabase db dump --role-only -f supabase_roles.sql`,
    importCommand: (newDb) => 
      `# 1. ربط المشروع بمشروع Supabase الجديد للشركة:\nsupabase link --project-ref {NEW_PROJECT_ID}\n\n# 2. دفع التغييرات وسياسات الأمان للقاعدة الجديدة:\nsupabase db push`,
    seedCommand: 'supabase db reset --seed',
    ormInstructions: [
      { name: 'Supabase CLI Migration', command: 'supabase migration up' },
      { name: 'Prisma via Supabase', command: 'npx prisma migrate deploy' }
    ],
    criticalRules: [
      'لا تنسخ جدول auth.users أبداً! الشركة الجديدة يجب أن تبدأ بحسابات مستخدمين جديدة كلياً.',
      'أنشئ Storage Buckets جديدة في لوحة تحكم Supabase للشركة الجديدة واضبط قواعد الوصول RLS للملفات.',
      'استبدل Webhook URLs و Auth Redirect URLs بعنوان النطاق الجديد للشركة.'
    ]
  },
  firebase: {
    title: 'Firebase (Firestore + Firebase Auth)',
    badge: 'NoSQL & Realtime',
    defaultPort: '443',
    envFormat: 'VITE_FIREBASE_API_KEY={NEW_API_KEY}\nVITE_FIREBASE_AUTH_DOMAIN={NEW_PROJECT}.firebaseapp.com\nVITE_FIREBASE_PROJECT_ID={NEW_PROJECT_ID}\nVITE_FIREBASE_STORAGE_BUCKET={NEW_PROJECT}.appspot.com\nVITE_FIREBASE_MESSAGING_SENDER_ID={SENDER_ID}\nVITE_FIREBASE_APP_ID={NEW_APP_ID}',
    exportCommand: () => 
      `# قواعد الأمان وفهارس Firestore (Security Rules & Indexes) فقط:\n# يتم نسخ ملفات المشروع: firestore.rules و firestore.indexes.json فقط.\n# لا تستخدم gcloud firestore export لنقل بيانات الشركة السابقة!`,
    importCommand: (newDb) => 
      `# 1. تسجيل الدخول والتحويل لمشروع الشركة الجديدة:\nfirebase login\nfirebase use --add <NEW_FIREBASE_PROJECT_ID>\n\n# 2. نشر قواعد الأمان والفهارس النظيفة للمشروع الجديد:\nfirebase deploy --only firestore:rules,firestore:indexes,storage:rules`,
    seedCommand: 'npm run seed:firebase-admin -- --projectId={NEW_PROJECT_ID}',
    ormInstructions: [
      { name: 'Firebase CLI Deploy', command: 'firebase deploy --only firestore' },
      { name: 'Firebase Emulators Test', command: 'firebase emulators:start' }
    ],
    criticalRules: [
      'احذر من ترك ملف Service Account JSON القديم الخاص بالشركة السابقة في السيرفر أو المستودع!',
      'تأكد من تفعيل مزودي تسجيل الدخول (Email/Password, Google) داخل مشروع Firebase الجديد للشركة.',
      'قم بتحديث نطاقات التوجيه المصرح بها (Authorized Domains) في تبويب Firebase Authentication.'
    ]
  },
  mongodb: {
    title: 'MongoDB / MongoDB Atlas',
    badge: 'Document Store',
    defaultPort: '27017',
    envFormat: 'mongodb+srv://{USER}:{PASSWORD}@{CLUSTER}.mongodb.net/{DB_NAME}?retryWrites=true&w=majority',
    exportCommand: (oldDb, oldHost = 'cluster0.mongodb.net', oldUser = 'admin') => 
      `# في MongoDB، إذا رغبت بتصدير الكولكشنز الثابتة فقط (مثل التصنيفات والدول):\nmongodump --uri="mongodb+srv://${oldUser}:PASS@${oldHost}/${oldDb}" --collection=system_roles --out=dump_seed/\nmongodump --uri="mongodb+srv://${oldUser}:PASS@${oldHost}/${oldDb}" --collection=constants --out=dump_seed/`,
    importCommand: (newDb, newHost = 'newcluster.mongodb.net', newUser = 'newadmin') => 
      `# استيراد كولكشنز الثوابت في الحساب الجديد:\nmongorestore --uri="mongodb+srv://${newUser}:NEW_PASS@${newHost}/${newDb}" dump_seed/`,
    seedCommand: 'npm run seed:mongo',
    ormInstructions: [
      { name: 'Mongoose / Node', command: 'node scripts/seed-initial-admin.js' },
      { name: 'Prisma with MongoDB', command: 'npx prisma db push' }
    ],
    criticalRules: [
      'تأكد من Network Access في MongoDB Atlas والسماح بعنوان IP الخاص بسيرفر الشركة الجديدة (أو 0.0.0.0/0 مع حماية مستخدم قوية).',
      'احذف مجموعات users و orders و logs بالكامل قبل الإطلاق.',
      'قم بإنشاء Unique Indexes برمجياً عبر Mongoose schemas عند تشغيل السيرفر الأول.'
    ]
  },
  mysql: {
    title: 'MySQL / MariaDB / PlanetScale',
    badge: 'Relational SQL',
    defaultPort: '3306',
    envFormat: 'mysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}?ssl={"rejectUnauthorized":true}',
    exportCommand: (oldDb, oldHost = 'localhost', oldUser = 'root') => 
      `# استخراج الهيكل دون البيانات:\nmysqldump -u ${oldUser} -p -h ${oldHost} --no-data ${oldDb} > schema_clean.sql`,
    importCommand: (newDb, newHost = 'new-server.com', newUser = 'newuser') => 
      `# إنشاء القاعدة الجديدة والاستيراد:\nmysql -u ${newUser} -p -h ${newHost} -e "CREATE DATABASE IF NOT EXISTS ${newDb} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"\nmysql -u ${newUser} -p -h ${newHost} ${newDb} < schema_clean.sql`,
    seedCommand: 'php artisan db:seed # or npm run db:seed',
    ormInstructions: [
      { name: 'Prisma MySQL', command: 'npx prisma db push' },
      { name: 'Sequelize', command: 'npx sequelize-cli db:migrate' },
      { name: 'Laravel MySQL', command: 'php artisan migrate:fresh --seed' }
    ],
    criticalRules: [
      'تأكد من استخدام تشفير utf8mb4_unicode_ci لضمان دعم اللغة العربية بشكل سليم.',
      'تحقق من إعدادات SQL Modes (مثل STRICT_TRANS_TABLES) حتى لا تختلف السلوكيات بين سيرفر الشركة السابقة والشركة الجديدة.'
    ]
  },
  sqlite: {
    title: 'SQLite / Turso / LibSQL',
    badge: 'Embedded / Edge DB',
    defaultPort: 'N/A',
    envFormat: 'DATABASE_URL="file:./prod.db" # أو libSQL للخدمات السحابية',
    exportCommand: () => 
      `# استخراج الهيكل عبر sqlite3:\nsqlite3 old.db ".schema" > schema_clean.sql`,
    importCommand: () => 
      `# إنشاء قاعدة فارغة جديدة وتطبيق الهيكل:\nsqlite3 new_clean.db < schema_clean.sql`,
    seedCommand: 'node seed.js',
    ormInstructions: [
      { name: 'Prisma SQLite', command: 'npx prisma migrate dev --name init' },
      { name: 'Better-Sqlite3', command: 'npm run setup:db' }
    ],
    criticalRules: [
      'لا تنسخ ملف .db أو .sqlite القديم مباشرة! دائماً أنشئ ملفاً جديداً فارغاً ثم طبق الـ schema.'
    ]
  }
};
