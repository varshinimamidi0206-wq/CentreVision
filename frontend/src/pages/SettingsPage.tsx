import React, { useState, useEffect } from 'react';
import { useTranslation, SupportedLanguage } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { Settings } from '../types';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Cpu,
  Percent,
  Sliders,
  Check,
  Save,
  Languages,
  EyeOff
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t, language, setLanguage, languages } = useTranslation();
  const [settings, setSettings] = useState<Settings>({
    attendance_threshold: 85,
    infrastructure_threshold: 90,
    attendance_weight: 50,
    infrastructure_weight: 50,
    confidence_threshold: 0.50,
    frame_sampling_rate: 5,
    low_bandwidth_mode: false,
    face_identification: 'Disabled (Hardcoded System Constraint)',
    anonymous_detection: 'Enabled',
    selected_language: 'en'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleAttendanceWeightChange = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setSettings((prev) => ({
      ...prev,
      attendance_weight: clamped,
      infrastructure_weight: 100 - clamped
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            {t('settings.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('settings.subtitle')}
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300">
            <Check className="w-4 h-4" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Compliance Calculation Weights (Section 23 & 44) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Percent className="w-4 h-4 text-blue-600" />
              {t('settings.weights_title')}
            </h3>
            <span className="text-[11px] text-slate-500">
              Must sum to 100%
            </span>
          </div>

          <p className="text-slate-500 text-xs">
            {t('settings.formula_desc')}
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{t('settings.att_weight')}: {settings.attendance_weight}%</span>
                <span>{t('settings.inf_weight')}: {settings.infrastructure_weight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.attendance_weight}
                onChange={(e) => handleAttendanceWeightChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Attendance Impact</span>
                <strong className="text-xl font-bold text-slate-900">{settings.attendance_weight}%</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Infrastructure Impact</span>
                <strong className="text-xl font-bold text-slate-900">{settings.infrastructure_weight}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Thresholds */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-indigo-600" />
            {t('settings.thresholds_title')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('settings.att_threshold')}
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={settings.attendance_threshold}
                onChange={(e) =>
                  setSettings({ ...settings, attendance_threshold: Number(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Centres below this score enter "Attention Required".
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('settings.inf_threshold')}
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={settings.infrastructure_threshold}
                onChange={(e) =>
                  setSettings({ ...settings, infrastructure_threshold: Number(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Approved equipment availability pass benchmark.
              </span>
            </div>
          </div>
        </div>

        {/* AI & Edge Sampling */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-blue-600" />
            Computer Vision Sampling
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t('settings.confidence_threshold')}
              </label>
              <input
                type="number"
                step="0.05"
                min={0.1}
                max={0.99}
                value={settings.confidence_threshold}
                onChange={(e) =>
                  setSettings({ ...settings, confidence_threshold: Number(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Keyframe Sampling Interval (Frames)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={settings.frame_sampling_rate}
                onChange={(e) =>
                  setSettings({ ...settings, frame_sampling_rate: Number(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Privacy Safeguard Verification (Section 44) */}
        <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
            <EyeOff className="w-4 h-4 text-purple-700" />
            <span>{t('settings.privacy_status_title')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-purple-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 block">Facial Recognition</span>
                <span className="text-[10px] text-slate-500">Biometric identity profiling</span>
              </div>
              <span className="bg-rose-100 text-rose-800 font-black text-xs px-2.5 py-1 rounded-full border border-rose-300 uppercase">
                DISABLED
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-purple-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 block">Anonymous Geometry Detection</span>
                <span className="text-[10px] text-slate-500">Privacy-preserving presence count</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-full border border-emerald-300 uppercase">
                ENABLED
              </span>
            </div>
          </div>
          <p className="text-[10px] text-purple-800 italic">
            *Facial recognition is permanently disabled in the application architecture and cannot be enabled.
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Languages className="w-4 h-4 text-blue-600" />
            {t('settings.language_title')}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  language === l.code
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {l.nativeName} ({l.label})
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>{t('common.save')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
