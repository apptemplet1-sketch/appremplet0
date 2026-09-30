import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Building2, 
  Eye, 
  EyeOff, 
  Save, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  Phone, 
  RotateCcw,
  CheckCircle2,
  Sliders,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Settings } from '../types';
import { dataService } from '../services/dataService';
import { THEME_PRESETS, BRAND_ICONS, SHAPE_STYLES, applyTheme } from '../utils/themePresets';
import { DEVELOPER_SETTINGS_SQL } from '../services/setupSql';

interface DeveloperCustomizationTabProps {
  settings: Settings | null;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onUpdateSettings?: (updated: Settings) => void;
  navGroups: {
    title: string;
    items: { id: string; label: string; icon: any; roles: string[] }[];
  }[];
}

export function DeveloperCustomizationTab({
  settings,
  showToast,
  onUpdateSettings,
  navGroups
}: DeveloperCustomizationTabProps) {
  const [companyName, setCompanyName] = useState(settings?.companyName || 'شركة OK');
  const [companyPhone, setCompanyPhone] = useState(settings?.companyPhone || '');
  const [companyIcon, setCompanyIcon] = useState(settings?.companyIcon || '🏢');
  const [selectedTheme, setSelectedTheme] = useState(settings?.theme || 'ocean-blue');
  const [selectedShape, setSelectedShape] = useState<'modern' | 'classic' | 'sharp'>((settings?.shapeStyle as any) || 'modern');
  const [hiddenTabs, setHiddenTabs] = useState<string[]>(settings?.hiddenTabs || []);
  const [saving, setSaving] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeSection, setActiveSection] = useState<'identity' | 'themes' | 'tabs' | 'sql'>('identity');

  useEffect(() => {
    if (settings) {
      if (settings.companyName !== undefined) setCompanyName(settings.companyName);
      if (settings.companyPhone !== undefined) setCompanyPhone(settings.companyPhone);
      if (settings.companyIcon !== undefined) setCompanyIcon(settings.companyIcon);
      if (settings.theme !== undefined) setSelectedTheme(settings.theme);
      if (settings.shapeStyle !== undefined) setSelectedShape(settings.shapeStyle);
      if (settings.hiddenTabs !== undefined) setHiddenTabs(settings.hiddenTabs);
    }
  }, [settings]);

  // Live preview when switching theme or shape
  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId, selectedShape);
    const chosen = THEME_PRESETS.find(t => t.id === themeId);
    showToast(`تم تطبيق ثيم (${chosen?.name}) في المعاينة الحية فوراً! اضغط حفظ لتعميمه على الجميع.`, 'success');
  };

  const handleSelectShape = (shapeId: 'modern' | 'classic' | 'sharp') => {
    setSelectedShape(shapeId);
    applyTheme(selectedTheme, shapeId);
    const chosen = SHAPE_STYLES.find(s => s.id === shapeId);
    showToast(`تم تغيير نمط الحواف إلى: ${chosen?.label}`, 'success');
  };

  const handleToggleTab = (tabId: string) => {
    setHiddenTabs(prev => {
      if (prev.includes(tabId)) {
        return prev.filter(id => id !== tabId);
      } else {
        return [...prev, tabId];
      }
    });
  };

  const handleShowAllTabs = () => {
    setHiddenTabs([]);
    showToast('تم إلغاء إخفاء كافة التبويبات (ستظهر لجميع المستخدمين بعد الحفظ)', 'success');
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const targetId = settings?.id || 'default';
    const updatedPayload: Partial<Settings> = {
      id: targetId,
      companyName: companyName.trim() || 'شركة OK',
      companyPhone: companyPhone.trim(),
      companyIcon,
      theme: selectedTheme,
      shapeStyle: selectedShape,
      hiddenTabs
    };

    try {
      await dataService.updateSettings(targetId, updatedPayload);
      
      const fullUpdated: Settings = {
        ...(settings || { id: targetId, dailyTarget: 1000 }),
        ...updatedPayload
      } as Settings;

      if (onUpdateSettings) {
        onUpdateSettings(fullUpdated);
      }

      applyTheme(selectedTheme, selectedShape);
      showToast('تم حفظ تخصيصات الهوية والثيمات في Supabase بنجاح! ✓');
    } catch (err: any) {
      console.warn('Notice saving developer customization:', err?.message || err);
      showToast(err.message || 'حدث خطأ أثناء الحفظ في Supabase', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopySql = () => {
    try {
      navigator.clipboard.writeText(DEVELOPER_SETTINGS_SQL);
      setCopiedSql(true);
      showToast('تم نسخ كود SQL لـ Supabase بنجاح! الصقه في SQL Editor واضغط Run.', 'success');
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      showToast('فشل النسخ التلقائي، يمكنك نسخ الكود يدوياً من المربع أدناه', 'error');
    }
  };

  // Flatten tabs for count
  const allTabsList = navGroups.flatMap(g => g.items).filter(item => item.id !== 'admin_customization');
  const hiddenCount = hiddenTabs.length;

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary/95 to-primary p-6 md:p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 -translate-x-6 -translate-y-6 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white/95">
              <ShieldCheck size={14} className="text-amber-300" />
              <span>لوحة تحكم المطور الحصرية (Developer Portal)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-white flex items-center gap-3">
              <span>تخصيص الهوية، الثيمات، وإدارة التبويبات</span>
              <span className="text-3xl">{companyIcon}</span>
            </h1>
            <p className="text-xs md:text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
              تحكم كامل في اسم الشركة، ألوان النظام (8 ثيمات عصرية)، شعار الأيقونة، وإخفاء أي تبويب من واجهات المستخدمين دون المساس بالوظائف أو الأكواد البرمجية.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-3.5 bg-white text-primary hover:bg-white/90 active:scale-95 font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              ) : (
                <Save size={18} />
              )}
              <span>حفظ التعديلات فوراً</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSection('identity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSection === 'identity' 
                ? 'bg-white text-primary shadow-md' 
                : 'bg-white/10 hover:bg-white/20 text-white/90'
            }`}
          >
            <Building2 size={16} />
            <span>اسم وشعار الشركة</span>
          </button>

          <button
            onClick={() => setActiveSection('themes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSection === 'themes' 
                ? 'bg-white text-primary shadow-md' 
                : 'bg-white/10 hover:bg-white/20 text-white/90'
            }`}
          >
            <Palette size={16} />
            <span>الثيمات والألوان ({THEME_PRESETS.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('tabs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSection === 'tabs' 
                ? 'bg-white text-primary shadow-md' 
                : 'bg-white/10 hover:bg-white/20 text-white/90'
            }`}
          >
            <Layers size={16} />
            <span>إخفاء/إظهار التبويبات {hiddenCount > 0 && <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full text-[10px]">{hiddenCount} مخفي</span>}</span>
          </button>

          <button
            onClick={() => setActiveSection('sql')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSection === 'sql' 
                ? 'bg-white text-primary shadow-md' 
                : 'bg-white/10 hover:bg-white/20 text-white/90'
            }`}
          >
            <Copy size={16} />
            <span>كود Supabase SQL</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: IDENTITY & COMPANY NAME */}
      {activeSection === 'identity' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 border-2 border-primary/10">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-primary/10">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">تغيير اسم الشركة والهوية العامة</h2>
                  <p className="text-xs text-secondary/70">يتغير الاسم تلقائياً في كل الشاشات، الفواتير، ونوافذ الدخول والطباعة</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    اسم الشركة الرسمي (Company Name)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="مثال: شركة OK أو مؤسسة البركة للتوزيع"
                      className="input-field text-base font-bold pr-11"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-2xl">
                      {companyIcon}
                    </div>
                  </div>
                  <p className="text-[11px] text-secondary/60 mt-1">
                    * هذا الاسم هو الذي سيظهر في الترويسة الرئيسية، وفواتير المبيعات، والطباعة الحرارية للعملاء، وشاشة الدخول.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    رقم هاتف الشركة / خدمة العملاء (يظهر في أسفل الفاتورة)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={companyPhone}
                      onChange={e => setCompanyPhone(e.target.value)}
                      placeholder="مثال: 01000000000"
                      className="input-field text-sm font-medium pr-10"
                      dir="ltr"
                    />
                    <Phone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary/40" />
                  </div>
                </div>

                {/* Company Icon Picker */}
                <div>
                  <label className="block text-xs font-bold text-ink mb-2">
                    أيقونة شعار الشركة (تظهر بجوار اسم الشركة)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {BRAND_ICONS.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCompanyIcon(item.icon)}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                          companyIcon === item.icon
                            ? 'border-primary bg-primary/10 text-primary shadow-sm scale-105'
                            : 'border-primary/10 bg-white hover:border-primary/30 text-ink/70'
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[10px] font-bold truncate max-w-full">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-2 border-primary/10">
              <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                <Sparkles size={16} />
                <span>معاينة حية للهوية (Live Preview)</span>
              </h3>

              {/* Header Preview */}
              <div className="p-4 rounded-2xl bg-white border border-primary/15 shadow-sm space-y-4">
                <div className="text-[10px] font-bold text-secondary/60">مظهر شريط الترويسة الرئيسي:</div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-xl shadow-md shadow-primary/20">
                      {companyIcon}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-primary leading-tight">
                        {companyName || 'اسم الشركة'}
                      </h4>
                      <p className="text-[10px] text-secondary/60">نظام إدارة التوزيع المعتمد</p>
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Invoice Mock Header */}
                <div className="text-[10px] font-bold text-secondary/60 pt-2 border-t border-primary/10">
                  مظهر رأس الفاتورة للعملاء:
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <div className="text-xl">{companyIcon}</div>
                  <div className="font-serif font-black text-primary text-base">
                    {companyName || 'اسم الشركة'}
                  </div>
                  <div className="text-[10px] text-slate-500">فاتورة مبيعات معتمدة</div>
                  {companyPhone && (
                    <div className="text-[10px] font-bold text-slate-600" dir="ltr">
                      خدمة العملاء: {companyPhone}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-sm"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Save size={16} />
                )}
                <span>حفظ اسم الشركة وشعارها</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: THEMES & COLOR PALETTES */}
      {activeSection === 'themes' && (
        <div className="space-y-6">
          {/* Shape Style Chooser */}
          <div className="glass-card p-6 border-2 border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Sliders size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">نمط انحناء الحواف والشكل (Card & Button Shapes)</h2>
                <p className="text-xs text-secondary/70">اختر طابع التصميم العام للبطاقات والأزرار دون أي تأثير على الوظائف</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SHAPE_STYLES.map(style => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleSelectShape(style.id as any)}
                  className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                    selectedShape === style.id
                      ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                      : 'border-primary/10 bg-white hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-ink">{style.label}</span>
                    {selectedShape === style.id && <CheckCircle2 size={18} className="text-primary" />}
                  </div>
                  <p className="text-xs text-secondary/60 mb-3">{style.description}</p>
                  <div 
                    className="h-8 bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary"
                    style={{ borderRadius: style.radius }}
                  >
                    معاينة الانحناء
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes Grid */}
          <div className="glass-card p-6 border-2 border-primary/10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Palette size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">باقة الثيمات اللونية (Color Themes)</h2>
                  <p className="text-xs text-secondary/70">اضغط على أي ثيم لمعاينته فوراً في كامل النظام بدون إعادة تحميل</p>
                </div>
              </div>
              <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl">
                الثيم المطبق حالياً: {THEME_PRESETS.find(t => t.id === selectedTheme)?.name}
              </div>
            </div>

            {/* Live Indicator Banner */}
            <div className="p-4 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2" style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-primary)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0" style={{ backgroundColor: 'var(--theme-primary)' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--theme-primary)' }}>
                    المعاينة الحية نشطة الآن: {THEME_PRESETS.find(t => t.id === selectedTheme)?.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    اضغط على أي كارت ثيم لتجربته حياً، ثم اضغط زر "حفظ التعديلات فوراً" لحفظه في Supabase وتعميمه على كافة المستخدمين.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={saving}
                className="btn-primary shrink-0 text-xs py-2.5 px-5 flex items-center justify-center gap-2"
              >
                <Save size={15} />
                <span>حفظ الثيم في Supabase</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {THEME_PRESETS.map(theme => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:scale-[1.02] ${
                      isSelected
                        ? 'border-primary bg-white shadow-xl ring-2 ring-primary/30'
                        : 'border-slate-200 bg-white hover:border-primary/40'
                    }`}
                  >
                    <div>
                      {/* Color Palette Strips */}
                      <div className="flex rounded-xl overflow-hidden h-14 mb-3 border border-slate-200 shadow-inner">
                        <div className="flex-1 h-full" style={{ backgroundColor: theme.primary }} title="اللون الأساسي" />
                        <div className="flex-1 h-full" style={{ backgroundColor: theme.secondary }} title="اللون الثانوي" />
                        <div className="flex-1 h-full" style={{ backgroundColor: theme.accent }} title="لون التمييز" />
                        <div className="flex-1 h-full" style={{ backgroundColor: theme.bg }} title="خلفية الشاشات" />
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm text-ink">{theme.name}</h3>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-primary text-white">
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-secondary/60 leading-relaxed min-h-[32px]">
                        {theme.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                        {theme.primary}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTheme(theme.id);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'محدد حالياً' : 'تطبيق الآن'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="btn-primary flex items-center gap-2 text-sm px-8"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Save size={16} />
                )}
                <span>حفظ الثيم المختار لجميع المستخدمين</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TABS VISIBILITY CONTROL */}
      {activeSection === 'tabs' && (
        <div className="space-y-6">
          <div className="glass-card p-6 border-2 border-primary/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">التحكم في ظهور وإخفاء تبويبات النظام</h2>
                  <p className="text-xs text-secondary/70">
                    يمكنك إخفاء أي تبويب عن جميع المستخدمين بضغطة زر دون حذف البيانات أو التأثير على الكود البرمجي.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={handleShowAllTabs}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} />
                    <span>إظهار الكل ({allTabsList.length})</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>حفظ حالة التبويبات</span>
                </button>
              </div>
            </div>

            {/* Note alert */}
            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl mb-6 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
              <span className="text-base shrink-0">💡</span>
              <div>
                <strong>ملاحظة للمطور:</strong> التبويبات المخفية ستختفي من القائمة الجانبية وشريط التنقل السفلي لجميع الموظفين والمستخدمين العاديين، مع بقائها ظاهرة للمطور للتحكم بها في أي وقت.
              </div>
            </div>

            {/* Grouped Tabs */}
            <div className="space-y-6">
              {navGroups.map((group, groupIdx) => {
                const groupItems = group.items.filter(item => item.id !== 'admin_customization');
                if (groupItems.length === 0) return null;

                return (
                  <div key={groupIdx} className="space-y-3">
                    <h3 className="text-xs font-black text-secondary tracking-wider uppercase px-1">
                      {group.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {groupItems.map(item => {
                        const Icon = item.icon;
                        const isHidden = hiddenTabs.includes(item.id);

                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                              isHidden
                                ? 'bg-slate-50 border-slate-200 opacity-70'
                                : 'bg-white border-primary/15 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isHidden ? 'bg-slate-200 text-slate-500' : 'bg-primary/10 text-primary'
                              }`}>
                                <Icon size={20} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-sm text-ink truncate">
                                  {item.label}
                                </div>
                                <div className="text-[10px] text-secondary/60 truncate">
                                  {isHidden ? (
                                    <span className="text-rose-600 font-bold flex items-center gap-1">
                                      <EyeOff size={11} /> مخفي عن الجميع
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                                      <Eye size={11} /> متاح ومفعل
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Switch Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleTab(item.id)}
                              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                !isHidden ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                              title={isHidden ? 'إظهار التبويب' : 'إخفاء التبويب'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  !isHidden ? '-translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SUPABASE SQL EDITOR */}
      {activeSection === 'sql' && (
        <div className="space-y-6">
          <div className="glass-card p-6 border-2 border-primary/10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Copy size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">كود تفعيل الهوية والثيمات في Supabase</h2>
                  <p className="text-xs text-secondary/70">
                    انسخ هذا الكود مرة واحدة فقط وشغّله في Supabase SQL Editor لتفعيل حفظ اسم الشركة والثيمات وإخفاء التبويبات
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopySql}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                {copiedSql ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedSql ? 'تم النسخ بنجاح ✓' : 'نسخ كود SQL بالكامل'}</span>
              </button>
            </div>

            {/* Steps Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-ink flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">1</span>
                  <span>افتح لوحة Supabase</span>
                </div>
                <p className="text-[11px] text-slate-500">ادخل إلى مشروعك وافتح قائمة <strong>SQL Editor</strong> من الشريط الجانبي الأيسر.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-ink flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">2</span>
                  <span>الصق الكود واضغط Run</span>
                </div>
                <p className="text-[11px] text-slate-500">أنشئ New query، الصق الكود المنسوخ، واضغط على زر <strong>Run</strong> الأخضر.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-ink flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>تفعيل فوري ودائم</span>
                </div>
                <p className="text-[11px] text-slate-500">ستضاف الأعمدة لجدول settings وتعمل كافة التخصيصات والثيمات للمستخدمين فوراً.</p>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto text-left leading-relaxed max-h-80 border border-slate-800" dir="ltr">
                {DEVELOPER_SETTINGS_SQL}
              </pre>
              <button
                type="button"
                onClick={handleCopySql}
                className="absolute top-3 right-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg backdrop-blur-md transition-all flex items-center gap-1"
              >
                <Copy size={13} />
                <span>نسخ الكود</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
