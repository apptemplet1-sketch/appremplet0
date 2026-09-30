import React, { useState } from 'react';
import { ProjectConfig } from '../types/migration';
import { Sparkles, Terminal, Copy, Check, FileCode, Plus, Trash2, ArrowRight } from 'lucide-react';

interface FindReplaceScriptGeneratorProps {
  config: ProjectConfig;
  lang: 'ar' | 'en';
}

interface ReplacePair {
  id: string;
  search: string;
  replace: string;
  description: string;
}

export const FindReplaceScriptGenerator: React.FC<FindReplaceScriptGeneratorProps> = ({ config, lang }) => {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'node' | 'bash' | 'powershell'>('node');

  const [pairs, setPairs] = useState<ReplacePair[]>([
    {
      id: '1',
      search: config.oldCompanyName,
      replace: config.newCompanyName,
      description: 'اسم الشركة في النصوص والصفحات',
    },
    {
      id: '2',
      search: config.oldAppName,
      replace: config.newAppName,
      description: 'معرف التطبيق في package.json و configs',
    },
    {
      id: '3',
      search: config.oldDomain,
      replace: config.newDomain,
      description: 'النطاق القديم إلى النطاق الجديد',
    },
    {
      id: '4',
      search: config.oldEmail,
      replace: config.newEmail,
      description: 'بريد الدعم والمراسلات',
    },
    {
      id: '5',
      search: config.oldDbName,
      replace: config.newDbName,
      description: 'اسم قاعدة البيانات القديمة',
    },
  ]);

  const [newSearch, setNewSearch] = useState('');
  const [newReplace, setNewReplace] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const addPair = () => {
    if (!newSearch.trim() || !newReplace.trim()) return;
    setPairs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        search: newSearch.trim(),
        replace: newReplace.trim(),
        description: newDesc.trim() || 'كلمة مخصصة',
      },
    ]);
    setNewSearch('');
    setNewReplace('');
    setNewDesc('');
  };

  const removePair = (id: string) => {
    setPairs((prev) => prev.filter((p) => p.id !== id));
  };

  const copyScript = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(type);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  // Generate Node.js Script
  const generateNodeScript = (): string => {
    const pairsJson = JSON.stringify(
      pairs.map((p) => ({ search: p.search, replace: p.replace })),
      null,
      2
    );

    return `/**
 * سكريبت استبدال الهوية والنصوص تلقائياً عبر كامل ملفات المشروع
 * تشغيل عبر: node migrate-brand.mjs
 */
import fs from 'fs';
import path from 'path';

const REPLACEMENTS = ${pairsJson};

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.cache'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.html', 
  '.css', '.md', '.env', '.env.example', '.sql', '.yaml', '.yml'
]);

let totalModifiedFiles = 0;

function walkAndReplace(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        walkAndReplace(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (ALLOWED_EXTENSIONS.has(ext)) {
        try {
          let content = fs.readFileSync(fullPath, 'utf8');
          let modified = false;

          for (const item of REPLACEMENTS) {
            if (content.includes(item.search)) {
              content = content.replaceAll(item.search, item.replace);
              modified = true;
            }
          }

          if (modified) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(\`✅ تم تحديث: \${fullPath}\`);
            totalModifiedFiles++;
          }
        } catch (err) {
          console.error(\`⚠️ تعذر قراءة الملف: \${fullPath}\`, err.message);
        }
      }
    }
  }
}

console.log('🚀 بدء عملية استبدال هوية المشروع للشركة الجديدة: ${config.newCompanyName}...');
walkAndReplace(process.cwd());
console.log(\`✨ اكتملت العملية بنجاح! تم تعديل \${totalModifiedFiles} ملفاً.\`);
`;
  };

  // Generate Bash Script
  const generateBashScript = (): string => {
    const sedCommands = pairs
      .map(
        (p) =>
          `echo "🔄 استبدال '${p.search}' بـ '${p.replace}'..."\nfind . -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.html" -o -name "*.md" -o -name "*.env*" \\) -not -path "*/node_modules/*" -not -path "*/.git/*" -exec sed -i 's/${p.search}/${p.replace}/g' {} +`
      )
      .join('\n\n');

    return `#!/usr/bin/env bash
# سكريبت استبدال الهوية والنطاقات عبر الطرفية (Linux / macOS)
# قم بإعطاء الصلاحية: chmod +x migrate_brand.sh ثم ./migrate_brand.sh

set -e

echo "🚀 بدء استبدال أسماء الشركة القديمة بالشركة الجديدة..."

${sedCommands}

echo "✅ تم استبدال جميع النصوص بنجاح!"
`;
  };

  // Generate PowerShell Script
  const generatePowerShellScript = (): string => {
    return `# سكريبت PowerShell لأنظمة ويندوز
$Replacements = @(
${pairs.map((p) => `    @{ Search = "${p.search}"; Replace = "${p.replace}" }`).join(',\n')}
)

$Extensions = @("*.ts", "*.tsx", "*.js", "*.json", "*.html", "*.md", "*.env*")
$ExcludedFolders = @("node_modules", ".git", ".next", "dist")

Write-Host "🚀 بدء استبدال هوية المشروع..." -ForegroundColor Cyan

Get-ChildItem -Recurse -File -Include $Extensions | Where-Object {
    $path = $_.FullName
    $skip = $false
    foreach ($ex in $ExcludedFolders) {
        if ($path -like "*\\$ex\\*") { $skip = $true; break }
    }
    -not $skip
} | ForEach-Object {
    $filePath = $_.FullName
    $content = [System.IO.File]::ReadAllText($filePath)
    $modified = $false

    foreach ($item in $Replacements) {
        if ($content.Contains($item.Search)) {
            $content = $content.Replace($item.Search, $item.Replace)
            $modified = $true
        }
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($filePath, $content)
        Write-Host "✅ Updated: $filePath" -ForegroundColor Green
    }
}

Write-Host "✨ اكتملت العملية بنجاح!" -ForegroundColor Green
`;
  };

  const getActiveScriptContent = () => {
    if (selectedFormat === 'node') return generateNodeScript();
    if (selectedFormat === 'bash') return generateBashScript();
    return generatePowerShellScript();
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>
            {lang === 'ar' ? 'مستبدل الهوية والنصوص التلقائي (Find & Replace Across Codebase)' : 'Codebase Brand & Name Sanitizer'}
          </span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {lang === 'ar'
            ? 'بدلاً من البحث اليدوي في مئات الملفات ومخاطرة نسيان اسم الشركة القديمة في التذييل أو صفحة الشروط، يولد هذا القسم سكريبت برمجي يفحص كافة الملفات ويستبدل النصوص بضغطة زر واحدة مع استثناء المجلدات الثقيلة (node_modules و .git).'
            : 'Automate search-and-replace across all files without touching node_modules or .git. Cleanly rebrand company titles, domains, bundle identifiers, and support emails.'}
        </p>
      </div>

      {/* Replacement Pairs Table */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white">
            {lang === 'ar' ? 'الكلمات المستهدفة للاستبدال:' : 'Target Replacement Dictionary:'}
          </h3>
          <span className="text-[11px] text-slate-400">
            {pairs.length} {lang === 'ar' ? 'كلمات مبرمجة' : 'rules configured'}
          </span>
        </div>

        <div className="space-y-2">
          {pairs.map((p) => (
            <div
              key={p.id}
              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-mono text-rose-300 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded truncate max-w-[200px]">
                  {p.search}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded truncate max-w-[200px]">
                  {p.replace}
                </span>
                <span className="text-slate-500 text-[11px] hidden sm:inline truncate">
                  ({p.description})
                </span>
              </div>

              <button
                onClick={() => removePair(p.id)}
                className="text-slate-500 hover:text-rose-400 p-1 transition"
                title="حذف هذا البند"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add custom word */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={newSearch}
            onChange={(e) => setNewSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'النص القديم للبحث عنه' : 'Old string to find'}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
          />
          <input
            type="text"
            value={newReplace}
            onChange={(e) => setNewReplace(e.target.value)}
            placeholder={lang === 'ar' ? 'النص الجديد البديل' : 'New replacement string'}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder={lang === 'ar' ? 'الوصف (اختياري)' : 'Description (optional)'}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={addPair}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Script Generator & Viewer */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Format selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedFormat('node')}
              className={`px-3 py-1 rounded transition font-medium ${
                selectedFormat === 'node'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Node.js (Cross-Platform)
            </button>
            <button
              onClick={() => setSelectedFormat('bash')}
              className={`px-3 py-1 rounded transition font-medium ${
                selectedFormat === 'bash'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bash (Linux / Mac)
            </button>
            <button
              onClick={() => setSelectedFormat('powershell')}
              className={`px-3 py-1 rounded transition font-medium ${
                selectedFormat === 'powershell'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PowerShell (Windows)
            </button>
          </div>

          <button
            onClick={() => copyScript(getActiveScriptContent(), selectedFormat)}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700 self-start sm:self-auto"
          >
            {copiedScript === selectedFormat ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{lang === 'ar' ? 'تم نسخ السكريبت!' : 'Copied Script!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'نسخ السكريبت كاملاً' : 'Copy Script Code'}</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-[380px] overflow-y-auto">
          {getActiveScriptContent()}
        </pre>
      </div>
    </div>
  );
};
