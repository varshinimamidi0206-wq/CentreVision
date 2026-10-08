import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import {
  ShieldCheck,
  ShieldAlert,
  EyeOff,
  Lock,
  CheckCircle2,
  XCircle,
  FileCheck,
  ArrowRight,
  UserX,
  Server,
  Layers
} from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
          {t('privacy.title')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('privacy.subtitle')}
        </p>
      </div>

      {/* Prominent Hardware/Software Constraint Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-purple-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-700/60 rounded-xl border border-purple-400/30">
              <EyeOff className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide">
                {t('privacy.face_id_status')}
              </h3>
              <p className="text-xs text-purple-200">
                Architectural Privacy Guarantee • Digital Personal Data Protection (DPDP) Act 2023
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Hardcoded System Constraint
          </span>
        </div>
        <p className="text-xs text-purple-100 leading-relaxed max-w-3xl">
          {t('privacy.face_id_note')} The pipeline processes anonymized geometric bounding representations. No facial landmarks, names, gender attributes, or biometric signatures are ever captured, transmitted, or stored.
        </p>
      </div>

      {/* Privacy Architecture Flow Diagram (Section 27) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          End-to-End Privacy-Preserving Architecture Flow
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">STAGE 1</span>
            <strong className="text-slate-900 font-bold block text-sm">CCTV Feed</strong>
            <span className="text-[10px] text-slate-500">Live or uploaded clip</span>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
            <span className="text-[10px] text-purple-400 font-bold block mb-1">STAGE 2</span>
            <strong className="text-purple-900 font-bold block text-sm">Anonymous CV</strong>
            <span className="text-[10px] text-purple-700">Trainee & asset geometry</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-[10px] text-blue-400 font-bold block mb-1">STAGE 3</span>
            <strong className="text-blue-900 font-bold block text-sm">Counts + Events</strong>
            <span className="text-[10px] text-blue-700">Mathematical metadata</span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-[10px] text-indigo-400 font-bold block mb-1">STAGE 4</span>
            <strong className="text-indigo-900 font-bold block text-sm">Compliance Engine</strong>
            <span className="text-[10px] text-indigo-700">Transparent 50/50 weights</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-[10px] text-emerald-400 font-bold block mb-1">STAGE 5</span>
            <strong className="text-emerald-900 font-bold block text-sm">Dashboard</strong>
            <span className="text-[10px] text-emerald-700">Actionable officer alerts</span>
          </div>
        </div>
      </div>

      {/* Two Comparison Columns: What it detects vs What it does NOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Column 1: What CentreVision Detects */}
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm pb-2 border-b border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{t('privacy.what_it_detects')}</span>
          </div>
          <ul className="space-y-2.5 text-slate-700 font-medium">
            {(t('privacy.detects_items') || []).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: What CentreVision NEVER Does */}
        <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm pb-2 border-b border-rose-100">
            <XCircle className="w-5 h-5 text-rose-600" />
            <span>{t('privacy.what_it_does_not')}</span>
          </div>
          <ul className="space-y-2.5 text-slate-700 font-medium">
            {(t('privacy.never_items') || []).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Responsible AI Principles Card (Section 46) */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Responsible AI Framework & Government Oversight Principles (Section 46)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block">1. Human Verification</strong>
            <p className="text-slate-600 leading-relaxed">
              AI alerts are analytical recommendations to assist monitoring officers. Final enforcement decisions remain with authorized human inspectors.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block">2. Privacy by Design</strong>
            <p className="text-slate-600 leading-relaxed">
              No biometric profiles are extracted. Edge processing strips unnecessary pixels before transmitting metadata.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block">3. Transparent Scoring</strong>
            <p className="text-slate-600 leading-relaxed">
              Compliance calculations use visible, deterministic formulas without black-box hidden scoring adjustments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
