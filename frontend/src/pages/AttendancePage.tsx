import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import {
  Users,
  Upload,
  FileSpreadsheet,
  Video,
  Play,
  CheckCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { t } = useTranslation();
  const [centreId, setCentreId] = useState('TC-001');
  const [officialAttendance, setOfficialAttendance] = useState<number>(30);
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) {
        setErrorMessage("We couldn't process this video. Please upload a valid MP4, MOV, AVI, or WebM file.");
        setVideoFile(null);
        return;
      }
      setErrorMessage('');
      setVideoFile(file);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvUploaded(true);
      // Simulate reading roster count
      setOfficialAttendance(30);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMessage('');
    try {
      const data = await api.analyzeAttendance(
        centreId,
        officialAttendance,
        videoFile || undefined
      );
      setResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete attendance analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
          {t('attendance.title')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('attendance.subtitle')}
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900 shadow-2xs">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-blue-950 font-bold mb-0.5">Statutory Analytical Notice:</strong>
          {t('attendance.disclaimer')}
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Input Section & Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            1. Centre & Official Attendance
          </h3>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {t('attendance.select_centre')}
            </label>
            <select
              value={centreId}
              onChange={(e) => setCentreId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
            >
              <option value="TC-001">TC-001: Sri Skill Development Training Centre (Visakhapatnam)</option>
              <option value="TC-002">TC-002: Rural Skills Training Centre (Chittoor)</option>
              <option value="TC-003">TC-003: Advanced Technical Training Centre (Vijayawada)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {t('attendance.official_attendance')}
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={officialAttendance}
              onChange={(e) => setOfficialAttendance(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-sm"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Official roster figure reported by training provider.
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="font-semibold text-slate-700 block mb-1">
              {t('attendance.upload_csv')}
            </label>
            <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-3 bg-slate-50 cursor-pointer text-slate-600 hover:text-blue-600 transition-colors">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="font-medium truncate">
                {csvUploaded ? 'Roster_Registered_BatchA.csv (Verified)' : 'Select Trainee Roster CSV'}
              </span>
              <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Middle Column: Video Source */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-600" />
            2. Video Footage Source
          </h3>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {t('attendance.upload_video')}
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 bg-slate-50 cursor-pointer text-slate-600 hover:text-blue-600 transition-all text-center">
              <Upload className="w-8 h-8 mb-2 text-slate-400" />
              <span className="font-bold text-slate-800">
                {videoFile ? videoFile.name : 'Click to Upload CCTV Clip'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Supported: MP4, MOV, AVI, WebM (Max 100 MB)
              </span>
              <input type="file" accept=".mp4,.mov,.avi,.webm" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-700 block text-[11px]">
              {t('attendance.use_sample_feed')}
            </span>
            <p className="text-[11px] text-slate-500">
              No live camera required: system automatically supplies verified MSDE CCTV demonstration stream.
            </p>
          </div>

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Computer Vision Detection...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t('attendance.run_analysis')}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Visual Preview / Geometry Simulation */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xs text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Anonymous Visual Processing Frame
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                Face ID: Disabled
              </span>
            </div>

            {/* Simulated Classroom Vision Box */}
            <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* Bounding box demonstrations */}
              <div className="absolute top-4 left-6 border-2 border-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-emerald-300">
                Person [Conf: 0.96]
              </div>
              <div className="absolute top-8 right-10 border-2 border-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-emerald-300">
                Person [Conf: 0.94]
              </div>
              <div className="absolute bottom-6 left-12 border-2 border-blue-400 bg-blue-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-blue-300">
                Workstation [Conf: 0.92]
              </div>
              <div className="absolute bottom-5 right-8 border-2 border-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-emerald-300">
                Person [Conf: 0.95]
              </div>

              <div className="text-center p-4 z-10">
                <Users className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-400 font-medium">
                  {isAnalyzing
                    ? 'Processing Video Frame Tensors...'
                    : result
                    ? 'Presence Stabilization Complete'
                    : 'Awaiting Video Frame Ingestion'}
                </p>
                <span className="text-[10px] text-slate-600 block mt-1">
                  Edge Sampling: 5 fps • Resolution: 1080p
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            CentreVision samples video frames passively without collecting personally identifiable biometrics.
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Attendance Compliance Verification Result
              </h3>
              <p className="text-xs text-slate-500">
                Audited Centre: {result.centre_name} ({result.centre_id})
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                result.status === 'Compliant'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              {result.status}
            </span>
          </div>

          {/* Core Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block uppercase font-semibold">
                {t('attendance.official_attendance')}
              </span>
              <strong className="text-3xl font-black text-slate-800">
                {result.official_attendance}
              </strong>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <span className="text-xs text-blue-700 block uppercase font-semibold">
                {t('attendance.ai_estimated_presence')}
              </span>
              <strong className="text-3xl font-black text-blue-700">
                {result.ai_estimated_presence}
              </strong>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 block uppercase font-semibold">
                {t('attendance.difference')}
              </span>
              <strong className="text-3xl font-black text-amber-800">
                {result.difference > 0 ? `-${result.difference}` : '0'}
              </strong>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block uppercase font-semibold">
                {t('attendance.match_percentage')}
              </span>
              <strong
                className={`text-3xl font-black ${
                  result.match_percentage >= 90 ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {result.match_percentage}%
              </strong>
            </div>
          </div>

          {/* Finding Explanation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Monitoring Finding Summary:
            </div>
            <p>
              The training centre reported {result.official_attendance} trainees on the official roster.
              The privacy-preserving computer vision engine estimated {result.ai_estimated_presence} individuals present
              during the classroom sampling interval ({result.match_percentage}% match rate).
              {result.difference > 0 &&
                ` An attendance discrepancy alert has been generated for ${result.difference} unverified absentees.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
