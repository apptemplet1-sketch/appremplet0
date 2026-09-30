export interface ThemePreset {
  id: string;
  name: string;
  nameEn: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  ink: string;
  primary5: string;
  secondary40: string;
  previewColors: string[];
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'ocean-blue',
    name: 'الأزرق الملكي (الافتراضي)',
    nameEn: 'Ocean Royal',
    primary: '#0369a1',
    secondary: '#0ea5e9',
    accent: '#38bdf8',
    bg: '#f0f9ff',
    ink: '#082f49',
    primary5: '#e0f2fe',
    secondary40: '#7dd3fc',
    previewColors: ['#0369a1', '#0ea5e9', '#38bdf8', '#f0f9ff'],
    description: 'المظهر القياسي الأنيق بدرجات الأزرق الصافي والواضح'
  },
  {
    id: 'emerald-green',
    name: 'الزمردي الراقي والأخضر الحيوي',
    nameEn: 'Emerald Forest',
    primary: '#047857',
    secondary: '#059669',
    accent: '#10b981',
    bg: '#f0fdf4',
    ink: '#064e3b',
    primary5: '#dcfce7',
    secondary40: '#6ee7b7',
    previewColors: ['#047857', '#059669', '#10b981', '#f0fdf4'],
    description: 'مثالي للشركات الغذائية والزراعية والطبية ومؤسسات التوزيع'
  },
  {
    id: 'purple-velvet',
    name: 'البنفسجي الإبداعي الملكي',
    nameEn: 'Purple Velvet',
    primary: '#6d28d9',
    secondary: '#8b5cf6',
    accent: '#a78bfa',
    bg: '#f5f3ff',
    ink: '#3b0764',
    primary5: '#ede9fe',
    secondary40: '#c4b5fd',
    previewColors: ['#6d28d9', '#8b5cf6', '#a78bfa', '#f5f3ff'],
    description: 'طابع عصري وجريء يعبر عن التميز والابتكار التكنولوجي'
  },
  {
    id: 'ruby-crimson',
    name: 'العنابي والياقوت الفاخر',
    nameEn: 'Ruby Crimson',
    primary: '#991b1b',
    secondary: '#dc2626',
    accent: '#f87171',
    bg: '#fef2f2',
    ink: '#450a0a',
    primary5: '#fee2e2',
    secondary40: '#fca5a5',
    previewColors: ['#991b1b', '#dc2626', '#f87171', '#fef2f2'],
    description: 'طابع قوي وفاخر للشركات الكبرى وتجارة الجملة الممتازة'
  },
  {
    id: 'golden-amber',
    name: 'الكهرماني والذهبي الدافئ',
    nameEn: 'Golden Amber',
    primary: '#b45309',
    secondary: '#d97706',
    accent: '#f59e0b',
    bg: '#fffbeb',
    ink: '#451a03',
    primary5: '#fef3c7',
    secondary40: '#fcd34d',
    previewColors: ['#b45309', '#d97706', '#f59e0b', '#fffbeb'],
    description: 'حيوية وطاقة تجارية عالية مع لمسة ذهبية أصيلة'
  },
  {
    id: 'slate-titanium',
    name: 'التيتانيوم والرصاصي التنفيذي',
    nameEn: 'Slate Titanium',
    primary: '#334155',
    secondary: '#475569',
    accent: '#64748b',
    bg: '#f8fafc',
    ink: '#0f172a',
    primary5: '#e2e8f0',
    secondary40: '#cbd5e1',
    previewColors: ['#334155', '#475569', '#64748b', '#f8fafc'],
    description: 'مظهر هادئ، رسمي، وعملي جداً للمؤسسات الإدارية'
  },
  {
    id: 'midnight-navy',
    name: 'الكحلي الليلي الفخم',
    nameEn: 'Midnight Navy',
    primary: '#1e3a8a',
    secondary: '#2563eb',
    accent: '#60a5fa',
    bg: '#eff6ff',
    ink: '#172554',
    primary5: '#dbeafe',
    secondary40: '#93c5fd',
    previewColors: ['#1e3a8a', '#2563eb', '#60a5fa', '#eff6ff'],
    description: 'درجات الأزرق الداكن الكلاسيكية للأعمال والمؤسسات المالية'
  },
  {
    id: 'teal-breeze',
    name: 'التركوازي المائي المنعش',
    nameEn: 'Teal Breeze',
    primary: '#0f766e',
    secondary: '#0d9488',
    accent: '#14b8a6',
    bg: '#f0fdfa',
    ink: '#134e4a',
    primary5: '#ccfbf1',
    secondary40: '#5eead4',
    previewColors: ['#0f766e', '#0d9488', '#14b8a6', '#f0fdfa'],
    description: 'انتعاش ووضوح عالٍ بدرجات التركواز المتألقة'
  }
];

export const BRAND_ICONS = [
  { id: 'building', label: 'شركة / مؤسسة', icon: '🏢' },
  { id: 'package', label: 'بضائع وتوزيع', icon: '📦' },
  { id: 'truck', label: 'شحن وأسطول', icon: '🚚' },
  { id: 'store', label: 'متجر / هايبر', icon: '🏪' },
  { id: 'diamond', label: 'جودة وألماسة', icon: '💎' },
  { id: 'crown', label: 'ملكي وفخم', icon: '👑' },
  { id: 'star', label: 'نجمة التميز', icon: '⭐' },
  { id: 'shield', label: 'أمان وثقة', icon: '🛡️' },
  { id: 'target', label: 'دقة وأهداف', icon: '🎯' },
  { id: 'rocket', label: 'ريادة وسرعة', icon: '🚀' },
  { id: 'briefcase', label: 'أعمال وتجارة', icon: '💼' },
  { id: 'sparkles', label: 'إبداع ونقاء', icon: '✨' },
];

export const SHAPE_STYLES = [
  { id: 'modern', label: 'دائري ناعم (عصري - Modern)', description: 'حواف مستديرة مريحة وجذابة', radius: '1.75rem', btnRadius: '1rem', cardRadius: '2rem' },
  { id: 'classic', label: 'متوازن (كلاسيكي - Classic)', description: 'حواف متوسطة الاستدارة متزنة', radius: '0.85rem', btnRadius: '0.75rem', cardRadius: '1.25rem' },
  { id: 'sharp', label: 'أنيق دقيق (Sharp Crisp)', description: 'حواف حادة ونقية بطابع رسمي', radius: '0.35rem', btnRadius: '0.4rem', cardRadius: '0.5rem' },
];

export function applyTheme(themeId?: string, shapeStyle?: string) {
  if (typeof document === 'undefined') return;

  const currentThemeId = themeId || localStorage.getItem('ok_theme') || 'ocean-blue';
  const currentShape = shapeStyle || (localStorage.getItem('ok_shape') as any) || 'modern';

  const theme = THEME_PRESETS.find(t => t.id === currentThemeId) || THEME_PRESETS[0];
  const shape = SHAPE_STYLES.find(s => s.id === currentShape) || SHAPE_STYLES[0];

  try {
    localStorage.setItem('ok_theme', theme.id);
    localStorage.setItem('ok_shape', shape.id);
  } catch (e) {
    // Ignore storage errors
  }

  const root = document.documentElement;
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-shape', shape.id);

  if (document.body) {
    document.body.setAttribute('data-theme', theme.id);
    document.body.setAttribute('data-shape', shape.id);
    document.body.style.backgroundColor = theme.bg;
  }

  // Set CSS Custom Properties on :root
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-bg', theme.bg);
  root.style.setProperty('--color-ink', theme.ink);

  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-bg', theme.bg);
  root.style.setProperty('--theme-ink', theme.ink);

  root.style.setProperty('--theme-radius', shape.radius);
  root.style.setProperty('--theme-btn-radius', shape.btnRadius);
  root.style.setProperty('--theme-card-radius', shape.cardRadius);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme.primary);
  }

  // Inject or update dynamic override stylesheet to beat static compiled Tailwind specificity
  let styleEl = document.getElementById('dynamic-theme-overrides') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamic-theme-overrides';
    document.head.appendChild(styleEl);
  }

  const css = `
    /* ============================================================
       DYNAMIC RUNTIME THEME OVERRIDES: ${theme.name} (${theme.id})
       ============================================================ */
    :root, [data-theme] {
      --color-primary: ${theme.primary} !important;
      --color-secondary: ${theme.secondary} !important;
      --color-accent: ${theme.accent} !important;
      --color-bg: ${theme.bg} !important;
      --color-ink: ${theme.ink} !important;
    }

    body,
    html body {
      background-color: ${theme.bg} !important;
      color: ${theme.ink} !important;
    }

    /* Primary Backgrounds */
    .bg-primary,
    .btn-primary,
    .bg-blue-600,
    .bg-blue-700,
    .bg-blue-500 {
      background-color: ${theme.primary} !important;
    }

    .bg-secondary {
      background-color: ${theme.secondary} !important;
    }

    .bg-accent {
      background-color: ${theme.accent} !important;
    }

    .bg-bg {
      background-color: ${theme.bg} !important;
    }

    /* Subtle Tints & Cards */
    .bg-blue-50,
    .bg-blue-50\\/80,
    .bg-blue-50\\/50,
    .bg-blue-50\\/30,
    .bg-primary\\/5,
    .bg-primary\\/10,
    .bg-accent\\/10,
    .bg-accent\\/5 {
      background-color: color-mix(in srgb, ${theme.primary} 9%, white) !important;
    }

    .bg-blue-100,
    .bg-primary\\/20,
    .bg-accent\\/20 {
      background-color: color-mix(in srgb, ${theme.primary} 18%, white) !important;
    }

    /* Primary Text */
    .text-primary,
    .text-blue-500,
    .text-blue-600,
    .text-blue-700,
    .text-blue-800,
    .text-blue-900 {
      color: ${theme.primary} !important;
    }

    .text-secondary {
      color: ${theme.secondary} !important;
    }

    /* Headings (keep white when inside dark buttons/badges) */
    h1:not(.text-white):not([class*="text-white"]),
    h2:not(.text-white):not([class*="text-white"]),
    h3:not(.text-white):not([class*="text-white"]),
    h4:not(.text-white):not([class*="text-white"]) {
      color: ${theme.primary} !important;
    }

    /* Keep white text white */
    .text-white,
    [class*="text-white"],
    .btn-primary,
    .btn-primary * {
      color: #ffffff !important;
    }

    /* Borders */
    .border-primary,
    .border-primary\\/30,
    .border-primary\\/20,
    .border-primary\\/10,
    .border-blue-100,
    .border-blue-200,
    .border-blue-300,
    .border-blue-50,
    .border-accent\\/10,
    .border-accent\\/20,
    .border-accent\\/5 {
      border-color: color-mix(in srgb, ${theme.primary} 25%, transparent) !important;
    }

    .glass-card {
      border-color: color-mix(in srgb, ${theme.primary} 15%, transparent) !important;
    }

    /* Gradients */
    .from-primary,
    .from-blue-600 {
      --tw-gradient-from: ${theme.primary} !important;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%) !important;
    }

    .to-primary,
    .to-blue-700,
    .to-blue-800 {
      --tw-gradient-to: color-mix(in srgb, ${theme.primary} 85%, black) !important;
    }

    /* Focus & Rings */
    .focus\\:border-primary:focus,
    .focus\\:border-blue-500:focus {
      border-color: ${theme.primary} !important;
    }

    .focus\\:ring-primary:focus,
    .focus\\:ring-blue-100:focus,
    .focus\\:ring-primary\\/20:focus,
    .focus\\:ring-primary\\/10:focus {
      --tw-ring-color: color-mix(in srgb, ${theme.primary} 30%, transparent) !important;
    }

    /* Hovers */
    .hover\\:bg-primary:hover,
    .hover\\:bg-blue-600:hover,
    .hover\\:bg-blue-700:hover {
      background-color: color-mix(in srgb, ${theme.primary} 88%, black) !important;
    }

    .hover\\:bg-blue-50:hover,
    .hover\\:bg-primary\\/5:hover,
    .hover\\:bg-accent\\/10:hover {
      background-color: color-mix(in srgb, ${theme.primary} 12%, white) !important;
    }

    .hover\\:text-primary:hover,
    .hover\\:text-blue-600:hover,
    .hover\\:text-blue-700:hover {
      color: ${theme.primary} !important;
    }

    /* Dynamic Shapes */
    .glass-card {
      border-radius: ${shape.cardRadius} !important;
    }
    .btn-primary {
      border-radius: ${shape.btnRadius} !important;
    }
  `;

  styleEl.textContent = css;
}
