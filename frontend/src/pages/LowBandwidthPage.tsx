import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import {
  WifiOff,
  Wifi,
  Zap,
  TrendingDown,
  CheckCircle,
  Layers,
  ArrowRight,
  Database,
  Radio,
  FileText
} from 'lucide-react';

export const LowBandwidthPage: React.FC = () => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then((s) => setIsEnabled(s.low_bandwidth_mode)).catch(console.error);
  }, []);

  const handleToggle = async () => {
    const nextVal = !isEnabled;
    setIsEnabled(nextVal);
    setIsSaving(true);
    try {
      const current = await api.getSettings();
      await api.updateSettings({ ...current, low_bandwidth_mode: nextVal });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
          {t('low_bandwidth.title')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('low_bandwidth.subtitle')}
        </p>
      </div>

      {/* Main Interactive Toggle Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">
              {t('low_bandwidth.toggle_label')}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isEnabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isEnabled ? 'ACTIVE ON EDGE' : 'STANDBY'}
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            {t('low_bandwidth.toggle_desc')}
          </p>
        </div>

        {/* Big Switch Button */}
        <button
          onClick={handleToggle}
          disabled={isSaving}
          className={`px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 ${
            isEnabled
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              : 'bg-slate-800 hover:bg-slate-900 text-white'
          }`}
        >
          {isEnabled ? (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Low-Bandwidth Mode: Enabled</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              <span>Enable Low-Bandwidth Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Quantitative Bandwidth Comparison (Section 26) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Card 1: Normal Streaming Mode */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
              <Wifi className="w-4 h-4 text-slate-400" />
              {t('low_bandwidth.normal_mode')}
            </h4>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
              Full Video Streaming
            </span>
          </div>

          <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 block uppercase font-semibold">
              {t('low_bandwidth.est_transfer')}
            </span>
            <div className="text-4xl font-black text-slate-800 my-1">
              {t('low_bandwidth.normal_size')}
            </div>
            <span className="text-[10px] text-slate-400">Continuous 1080p stream transmission</span>
          </div>

          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Transmits 25-30 raw video frames per second</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Requires consistent 4G/Broadband fiber uplink</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Vulnerable to rural packet drop and stream disconnects</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Low-Bandwidth Mode */}
        <div className="bg-emerald-50/50 rounded-xl border-2 border-emerald-300 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
            <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-emerald-600" />
              {t('low_bandwidth.low_mode')}
            </h4>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-300">
              Edge Metadata Protocol
            </span>
          </div>

          <div className="text-center py-4 bg-white rounded-xl border border-emerald-200 shadow-2xs">
            <span className="text-[11px] text-emerald-700 block uppercase font-semibold">
              {t('low_bandwidth.est_transfer')}
            </span>
            <div className="text-4xl font-black text-emerald-700 my-1">
              {t('low_bandwidth.low_size')}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">
              {t('low_bandwidth.reduction_badge')}
            </span>
          </div>

          <ul className="space-y-2 text-emerald-900 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Downsamples to 1 keyframe every 3-5 seconds</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Transmits anonymous detection counts & timestamps only</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Operates smoothly over 2G/3G rural network connections</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
        <strong>Implementation Architecture:</strong> In Low-Bandwidth Mode, video decoding occurs locally on edge CCTV recording hardware. Only structured JSON audit packets containing attendance counts and asset presence signals are transmitted over the WAN to the central MSDE monitoring cloud.
      </div>
    </div>
  );
};
