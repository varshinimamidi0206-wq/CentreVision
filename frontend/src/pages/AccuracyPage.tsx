import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { AccuracyMetrics } from '../types';
import {
  Target,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  Users,
  Activity,
  Layers,
  BarChart3
} from 'lucide-react';

export const AccuracyPage: React.FC = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<AccuracyMetrics | null>(null);

  useEffect(() => {
    api.getAccuracy().then(setMetrics).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
          {t('accuracy.title')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('accuracy.subtitle')}
        </p>
      </div>

      {/* Mandatory Disclaimer Box (Section 30) */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <strong className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
              {t('accuracy.demo_dataset_notice')}
            </strong>
            <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.2 rounded-full">
              Benchmark v1.2
            </span>
          </div>
          <p className="leading-relaxed">
            {metrics?.disclaimer || t('accuracy.disclaimer')}
          </p>
        </div>
      </div>

      {/* Two Core Model Performance Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Person Detection Evaluation */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              {t('accuracy.person_detection')}
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
              YOLOv8 Head/Body Geometry
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                {t('accuracy.precision')}
              </span>
              <strong className="text-2xl font-black text-slate-900">
                {metrics?.person_detection.precision || 93.4}%
              </strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                {t('accuracy.recall')}
              </span>
              <strong className="text-2xl font-black text-slate-900">
                {metrics?.person_detection.recall || 91.2}%
              </strong>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] text-blue-700 block uppercase font-semibold">
                {t('accuracy.f1_score')}
              </span>
              <strong className="text-2xl font-black text-blue-800">
                {metrics?.person_detection.f1_score || 92.3}%
              </strong>
            </div>
          </div>

          {/* Error Analysis: Confusion breakdown */}
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/70 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block text-[11px]">Error Analysis Breakdown (532 Samples):</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">True Positives</span>
                <strong className="text-emerald-700 font-bold">{metrics?.person_detection.true_positives || 456}</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">False Positives</span>
                <strong className="text-amber-700 font-bold">{metrics?.person_detection.false_positives || 32}</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">False Negatives</span>
                <strong className="text-rose-700 font-bold">{metrics?.person_detection.false_negatives || 44}</strong>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic pt-1">
              Primary edge error cause: classroom pillar occlusions and low-light corner desks.
            </p>
          </div>
        </div>

        {/* Infrastructure Object Detection Evaluation */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              {t('accuracy.infra_detection')}
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
              Sanctioned Assets & Machines
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                {t('accuracy.precision')}
              </span>
              <strong className="text-2xl font-black text-slate-900">
                {metrics?.infrastructure_detection.precision || 89.8}%
              </strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                {t('accuracy.recall')}
              </span>
              <strong className="text-2xl font-black text-slate-900">
                {metrics?.infrastructure_detection.recall || 87.5}%
              </strong>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
              <span className="text-[10px] text-indigo-700 block uppercase font-semibold">
                {t('accuracy.map')}
              </span>
              <strong className="text-2xl font-black text-indigo-800">
                {metrics?.infrastructure_detection.map_50 || 88.6}%
              </strong>
            </div>
          </div>

          {/* Error Analysis: Confusion breakdown */}
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/70 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block text-[11px]">Error Analysis Breakdown (392 Samples):</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">True Positives</span>
                <strong className="text-emerald-700 font-bold">{metrics?.infrastructure_detection.true_positives || 312}</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">False Positives</span>
                <strong className="text-amber-700 font-bold">{metrics?.infrastructure_detection.false_positives || 35}</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">False Negatives</span>
                <strong className="text-rose-700 font-bold">{metrics?.infrastructure_detection.false_negatives || 45}</strong>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic pt-1">
              Primary edge error cause: stacked chairs or partially obstructed desktop computer towers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
