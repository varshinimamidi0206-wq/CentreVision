import React, { useState, useEffect } from 'react';
import { useTranslation, SupportedLanguage } from '../i18n/LanguageContext';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  RotateCcw,
  ShieldCheck,
  Languages,
  WifiOff,
  Building2,
  Users,
  Cpu,
  FileCheck
} from 'lucide-react';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);

  const stages = [
    'Loading video footage from Visakhapatnam classroom feed...',
    'Detecting anonymous trainee geometries (COCO Person Model)...',
    'Analyzing approved infrastructure & workstations...',
    'Executing compliance comparison engine...',
    'Generating analytical alerts for monitoring officer...'
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsProcessing(false);
      setAnalysisStage(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const runAnalysisAnimation = () => {
    setIsProcessing(true);
    setAnalysisStage(0);

    const stepInterval = setInterval(() => {
      setAnalysisStage((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(stepInterval);
        setIsProcessing(false);
        setCurrentStep(4); // Advance to results
        return 4;
      });
    }, 700);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      runAnalysisAnimation();
    } else if (currentStep === 8) {
      onNavigateTab('privacy');
      setCurrentStep(9);
    } else if (currentStep === 9) {
      // Demonstrated language switch
      setCurrentStep(10);
    } else if (currentStep === 10) {
      onNavigateTab('low_bandwidth');
      onClose();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 10));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gov-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg text-slate-950 font-bold">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">CentreVision Official Demo Walkthrough</h3>
                <span className="text-[10px] bg-blue-600/80 text-white px-2 py-0.5 rounded-full font-semibold">
                  Step {currentStep} of 10
                </span>
              </div>
              <p className="text-xs text-slate-300">
                2-Minute Evaluator Guided Sequence (MSDE Problem Statement ID 26245)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-gov-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-700 font-bold text-sm bg-blue-50 p-3 rounded-xl border border-blue-200">
                <Building2 className="w-5 h-5 shrink-0" />
                <span>STEP 1: Centre Selection Under Active Inspection</span>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Sri Skill Development Training Centre</h4>
                    <p className="text-xs text-slate-500">ID: TC-001 • Visakhapatnam, Andhra Pradesh</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300">
                    Attention Required
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Sanctioned Seating:</span>
                    <strong className="text-slate-800 text-sm">30 Trainees</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Course Profile:</span>
                    <strong className="text-slate-800 text-sm">Apparel & Basic IT</strong>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click <strong>Next</strong> to initiate computer vision compliance auditing on the uploaded demonstration CCTV stream.
              </p>
            </div>
          )}

          {/* STEP 2 & 3: Processing Animation */}
          {(currentStep === 2 || currentStep === 3) && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 text-blue-700 font-bold text-sm bg-blue-50 p-3 rounded-xl border border-blue-200">
                <Cpu className="w-5 h-5 shrink-0" />
                <span>STEP 2 & 3: AI Compliance Pipeline Execution</span>
              </div>

              {!isProcessing && currentStep === 2 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <Play className="w-8 h-8 fill-blue-700 text-blue-700 ml-1" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">Ready to Run AI Compliance Engine</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Processes classroom frame geometry, detects trainee presence, audits sanctioned equipment, and checks compliance weights.
                    </p>
                  </div>
                  <button
                    onClick={runAnalysisAnimation}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    Execute AI Compliance Analysis
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-3 py-4">
                  <p className="text-xs font-semibold text-slate-700">Executing Computer Vision Pipeline:</p>
                  <div className="space-y-2">
                    {stages.map((stg, idx) => {
                      const isDone = idx < analysisStage;
                      const isCurrent = idx === analysisStage;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-medium border transition-all ${
                            isDone
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : isCurrent
                              ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold animate-pulse'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isCurrent ? (
                            <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                          ) : (
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-bold shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <span>{stg}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Attendance Result */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-700 font-bold text-sm bg-blue-50 p-3 rounded-xl border border-blue-200">
                <Users className="w-5 h-5 shrink-0" />
                <span>STEP 4: Trainee Presence Estimation Findings</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Official Reported</span>
                  <strong className="text-2xl font-black text-slate-800">30</strong>
                  <span className="text-[10px] text-slate-400 block">Roster registered</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                  <span className="text-[11px] text-blue-700 font-semibold block uppercase">AI Estimated</span>
                  <strong className="text-2xl font-black text-blue-700">28</strong>
                  <span className="text-[10px] text-blue-600 block">Visual presence</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <span className="text-[11px] text-amber-800 font-semibold block uppercase">Match Rate</span>
                  <strong className="text-2xl font-black text-amber-800">93%</strong>
                  <span className="text-[10px] text-amber-700 block">2 Discrepancies</span>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Analytical Signal Flagged:</strong> 2 trainees reported on the biometric roster were not detected in active classroom seating during the scheduled video sampling window.
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Infrastructure Result */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-700 font-bold text-sm bg-blue-50 p-3 rounded-xl border border-blue-200">
                <Cpu className="w-5 h-5 shrink-0" />
                <span>STEP 5: Infrastructure & Equipment Availability</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium block">Total Sanctioned Items</span>
                  <strong className="text-2xl font-bold text-slate-800">49</strong>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <span className="text-xs text-amber-800 font-medium block">Visually Detected Items</span>
                  <strong className="text-2xl font-bold text-amber-800">47</strong>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Equipment</th>
                      <th className="p-2.5 text-center">Sanctioned</th>
                      <th className="p-2.5 text-center">Detected</th>
                      <th className="p-2.5">Apparent Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-medium">Chairs</td>
                      <td className="p-2.5 text-center">30</td>
                      <td className="p-2.5 text-center font-bold text-amber-700">29</td>
                      <td className="p-2.5 text-amber-700 font-medium">Partially Obstructed</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Computers</td>
                      <td className="p-2.5 text-center">5</td>
                      <td className="p-2.5 text-center font-bold text-rose-700">4</td>
                      <td className="p-2.5 text-rose-700 font-medium">1 Not Detected</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Workbenches</td>
                      <td className="p-2.5 text-center">10</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">10</td>
                      <td className="p-2.5 text-emerald-700 font-medium">Appears Available</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Sewing Machines</td>
                      <td className="p-2.5 text-center">4</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">4</td>
                      <td className="p-2.5 text-emerald-700 font-medium">Appears Available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 6: Alerts Generated */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-rose-700 font-bold text-sm bg-rose-50 p-3 rounded-xl border border-rose-200">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>STEP 6: Automated Compliance Alerts Generated</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">Attendance Discrepancy Flag</span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Warning</span>
                  </div>
                  <p className="text-amber-800">
                    Centre reported 30 trainees while AI estimated 28 people present (2 unverified absentees).
                  </p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">Missing Critical Infrastructure</span>
                    <span className="bg-rose-200 text-rose-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Warning</span>
                  </div>
                  <p className="text-rose-800">
                    5 computers sanctioned under PMKVY contract, but only 4 detected in active workstation bay.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Overall Score */}
          {currentStep === 7 && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-3 text-blue-700 font-bold text-sm bg-blue-50 p-3 rounded-xl border border-blue-200">
                <FileCheck className="w-5 h-5 shrink-0" />
                <span>STEP 7: Overall Centre Compliance Scoring</span>
              </div>
              <div className="py-2">
                <div className="inline-block p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    Composite Compliance Score
                  </span>
                  <div className="text-5xl font-black text-amber-900 my-1">91.0%</div>
                  <span className="inline-block bg-amber-200 text-amber-900 font-bold text-xs px-3 py-1 rounded-full">
                    Status: Attention Required
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 max-w-md mx-auto">
                <p className="font-mono text-[11px] text-slate-700">
                  Formula: (93.3% Attendance × 50%) + (95.9% Infrastructure × 50%) = <strong>91.0%</strong>
                </p>
              </div>
            </div>
          )}

          {/* STEP 8: Privacy & Security */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-purple-700 font-bold text-sm bg-purple-50 p-3 rounded-xl border border-purple-200">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>STEP 8: Privacy-Preserving AI Architecture</span>
              </div>
              <div className="bg-purple-900 text-white p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs tracking-wider uppercase text-purple-200">Enforced Hardware Constraint</span>
                  <span className="bg-rose-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    Face ID: Disabled
                  </span>
                </div>
                <p className="text-xs text-purple-100 leading-relaxed">
                  CentreVision strictly processes anonymous human geometries. It never stores biometric records, names, or individual identities, ensuring 100% compliance with India's DPDP Act 2023.
                </p>
              </div>
            </div>
          )}

          {/* STEP 9: Multilingual Switching */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-indigo-700 font-bold text-sm bg-indigo-50 p-3 rounded-xl border border-indigo-200">
                <Languages className="w-5 h-5 shrink-0" />
                <span>STEP 9: Tri-Lingual Real-Time Localization</span>
              </div>
              <p className="text-xs text-slate-600">
                Test instant UI localization without full page reload. Switch between English, Telugu, and Hindi:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(['en', 'te', 'hi'] as SupportedLanguage[]).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => setLanguage(lng)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      language === lng
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lng === 'en' ? 'English' : lng === 'te' ? 'తెలుగు (Telugu)' : 'हिन्दी (Hindi)'}
                  </button>
                ))}
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Active Translated Term:</span>
                <strong className="text-slate-800 text-sm">{t('attendance.title')}</strong> • <span className="text-slate-600">{t('infrastructure.title')}</span>
              </div>
            </div>
          )}

          {/* STEP 10: Low-Bandwidth Mode */}
          {currentStep === 10 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-700 font-bold text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <WifiOff className="w-5 h-5 shrink-0" />
                <span>STEP 10: Low-Bandwidth Edge Intelligence</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-semibold block">Normal Video Streaming</span>
                  <strong className="text-xl font-bold text-slate-700">240 MB / hr</strong>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-800 font-semibold block">CentreVision Low-Bandwidth</span>
                  <strong className="text-xl font-bold text-emerald-700">18 MB / hr</strong>
                </div>
              </div>
              <div className="bg-emerald-100/70 border border-emerald-300 p-3 rounded-xl text-center">
                <span className="text-emerald-950 font-black text-sm">
                  92.5% Estimated Bandwidth Reduction
                </span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Operates seamlessly on rural 2G/3G connectivity by sending aggregated detection tensors instead of raw video.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || isProcessing}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg hover:bg-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx + 1 === currentStep
                    ? 'bg-blue-600 w-5'
                    : idx + 1 < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all hover:scale-105 disabled:opacity-50"
          >
            <span>{currentStep === 10 ? 'Finish Walkthrough' : currentStep === 2 ? 'Run Analysis' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
