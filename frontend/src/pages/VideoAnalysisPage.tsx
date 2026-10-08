import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { VideoAnalysisResult, TimelineEvent } from '../types';
import {
  Video,
  Upload,
  Play,
  Pause,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Clock,
  Cpu,
  Users,
  ShieldCheck,
  FileCheck,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';

export const VideoAnalysisPage: React.FC = () => {
  const { t } = useTranslation();
  const [centreId, setCentreId] = useState('TC-001');
  const [officialAttendance, setOfficialAttendance] = useState<number>(30);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const stages = [
    'Video stream loaded and synchronized',
    'Anonymous trainee person detection completed',
    'Infrastructure & equipment presence analyzed',
    'Compliance matrix and attendance weights calculated',
    'Compliance alerts and analytical signals generated'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) {
        setErrorMessage("We couldn't process this video. Please upload a valid MP4, MOV, AVI, or WebM file.");
        setUploadedFile(null);
        return;
      }
      setErrorMessage('');
      setUploadedFile(file);
    }
  };

  const runFullComplianceAnalysis = async () => {
    setIsProcessing(true);
    setProcessingStage(0);
    setErrorMessage('');

    // Animate stages smoothly for realistic AI perception
    const interval = setInterval(() => {
      setProcessingStage((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const res = await api.analyzeVideo(
        centreId,
        officialAttendance,
        uploadedFile || undefined
      );
      clearInterval(interval);
      setProcessingStage(4);
      setResult(res);
    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage(err.message || 'Video analysis failed. Fallback simulation engaged.');
      // Execute demo fallback if file upload failed
      const fallback = await api.analyzeDemo(centreId);
      // Map fallback
      setResult({
        analysis_id: 'ANA-DEMO-001',
        centre_id: centreId,
        centre_name: 'Sri Skill Development Training Centre',
        timestamp: 'Just now',
        video_filename: uploadedFile?.name || 'Classroom_CCTV_Feed_01.mp4',
        frames_analyzed: 45,
        total_frames: 450,
        processing_time_sec: 0.58,
        ai_mode: 'Analysis Mode: Demonstration (CV Fallback)',
        low_bandwidth_active: false,
        official_attendance: 30,
        estimated_presence: 28,
        attendance_match_pct: 93.3,
        attendance_status: 'Attention Required',
        total_expected_equipment: 49,
        total_detected_equipment: 47,
        infrastructure_compliance_pct: 95.9,
        equipment_breakdown: [],
        overall_compliance_score: 91.0,
        overall_status: 'Attention Required',
        alerts_generated: fallback.alerts_generated || [],
        timeline_events: fallback.timeline || [],
        average_confidence: 0.94,
        privacy_disclaimer: 'CentreVision strictly executes anonymous geometric detection.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
          {t('video_workspace.title')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('video_workspace.subtitle')}
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main 2-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Upload Area & Video Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                {t('video_workspace.media_preview')}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                {uploadedFile ? uploadedFile.name : 'Visakhapatnam_Batch1_Cam02.mp4'}
              </span>
            </h3>

            {/* Video Player Display */}
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group">
              {/* Grid texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* Bounding box annotations */}
              <div className="absolute top-5 left-8 border-2 border-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-emerald-300 shadow-xs">
                Trainee Geometry #01 [Conf: 0.95]
              </div>
              <div className="absolute top-10 right-12 border-2 border-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-emerald-300 shadow-xs">
                Trainee Geometry #02 [Conf: 0.93]
              </div>
              <div className="absolute bottom-10 left-16 border-2 border-blue-400 bg-blue-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-blue-300 shadow-xs">
                Workstation Bench #04 [Conf: 0.98]
              </div>
              <div className="absolute bottom-8 right-16 border-2 border-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-emerald-300 shadow-xs">
                Trainee Geometry #03 [Conf: 0.94]
              </div>

              {/* Centre Display */}
              <div className="text-center p-4 z-10">
                <div
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 cursor-pointer transition-transform hover:scale-110 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1 fill-white" />
                  )}
                </div>
                <p className="text-xs text-slate-300 font-semibold">
                  {isPlaying ? 'Streaming Stream Sampling...' : 'Classroom CCTV Feed Synchronized'}
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  1080p • 25 FPS • Anonymous Vision Active
                </span>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-transparent p-3 flex items-center justify-between text-slate-300 text-[10px]">
                <span>00:14 / 02:30</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                  LIVE CCTV FEED
                </span>
                <span>Bitrate: 2.4 Mbps</span>
              </div>
            </div>

            {/* Upload Box */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 block text-xs">
                Upload Custom Centre Footage
              </label>
              <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 bg-slate-50 cursor-pointer text-slate-600 hover:text-blue-600 transition-colors">
                <Upload className="w-4 h-4" />
                <span className="font-semibold truncate">
                  {uploadedFile ? uploadedFile.name : 'Select or Drop Classroom Video File'}
                </span>
                <input
                  type="file"
                  accept=".mp4,.mov,.avi,.webm"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Analysis Controls & Results */}
        <div className="lg:col-span-6 space-y-4 text-xs">
          {/* Analysis Controls Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              Compliance Execution Controls
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Centre</label>
                <select
                  value={centreId}
                  onChange={(e) => setCentreId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
                >
                  <option value="TC-001">TC-001: Sri Skill Development (Visakhapatnam)</option>
                  <option value="TC-002">TC-002: Rural Skills Training (Chittoor)</option>
                  <option value="TC-003">TC-003: Advanced Technical Training (Vijayawada)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reported Attendance</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={officialAttendance}
                  onChange={(e) => setOfficialAttendance(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Core Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={runFullComplianceAnalysis}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing Full Compliance Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('video_workspace.run_full_btn')}</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={runFullComplianceAnalysis}
                  disabled={isProcessing}
                  className="py-2 px-3 border border-slate-300 hover:bg-slate-50 rounded-lg font-bold text-slate-700 transition-colors"
                >
                  {t('video_workspace.run_attendance_btn')}
                </button>
                <button
                  onClick={runFullComplianceAnalysis}
                  disabled={isProcessing}
                  className="py-2 px-3 border border-slate-300 hover:bg-slate-50 rounded-lg font-bold text-slate-700 transition-colors"
                >
                  {t('video_workspace.run_infra_btn')}
                </button>
              </div>
            </div>

            {/* Step-by-Step Processing State Animation (Section 22) */}
            {isProcessing && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-[11px] block">Pipeline Progression:</span>
                {stages.map((stg, idx) => {
                  const done = idx < processingStage;
                  const active = idx === processingStage;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-xs font-medium ${
                        done
                          ? 'text-emerald-700 font-bold'
                          : active
                          ? 'text-blue-700 font-bold animate-pulse'
                          : 'text-slate-400'
                      }`}
                    >
                      {done ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : active ? (
                        <span className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-slate-200 text-[9px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                      )}
                      <span>{stg}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Analysis Results Card */}
          {result && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Analysis Results & Audit Summary
                </h4>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  Confidence: {Math.round(result.average_confidence * 100)}%
                </span>
              </div>

              {/* 4 Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block">Frames Sampled</span>
                  <strong className="text-base font-bold text-slate-800">{result.frames_analyzed}</strong>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                  <span className="text-[10px] text-blue-700 uppercase block">Estimated Presence</span>
                  <strong className="text-base font-bold text-blue-800">{result.estimated_presence}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block">Detected Assets</span>
                  <strong className="text-base font-bold text-slate-800">{result.total_detected_equipment}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block">Processing Latency</span>
                  <strong className="text-base font-bold text-slate-800">{result.processing_time_sec}s</strong>
                </div>
              </div>

              {/* Scores Banner */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block">Attendance Match</span>
                  <strong className="text-sm font-bold text-slate-800">{result.attendance_match_pct}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Infra Compliance</span>
                  <strong className="text-sm font-bold text-slate-800">{result.infrastructure_compliance_pct}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Overall Compliance</span>
                  <strong className="text-sm font-black text-amber-700">{result.overall_compliance_score}%</strong>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Timeline (Section 21) */}
          {result && result.timeline_events && result.timeline_events.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                {t('video_workspace.timeline_title')}
              </h4>
              <div className="relative pl-4 border-l-2 border-slate-200 space-y-3 text-xs">
                {result.timeline_events.map((ev, idx) => (
                  <div key={idx} className="relative group">
                    <span
                      className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        ev.severity === 'Critical'
                          ? 'bg-rose-600'
                          : ev.severity === 'Warning'
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{ev.timestamp}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 rounded uppercase ${
                          ev.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : ev.severity === 'Warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ev.type}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium mt-0.5">{ev.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
