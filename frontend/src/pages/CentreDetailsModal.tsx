import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { TrainingCentre } from '../types';
import {
  X,
  Building2,
  MapPin,
  Users,
  Camera,
  Calendar,
  Clock,
  ShieldCheck,
  Cpu,
  FileText,
  Video,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Percent
} from 'lucide-react';

interface CentreDetailsModalProps {
  centre: TrainingCentre | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchAudit: (centre: TrainingCentre) => void;
  onGenerateReport: (centre: TrainingCentre) => void;
}

export const CentreDetailsModal: React.FC<CentreDetailsModalProps> = ({
  centre,
  isOpen,
  onClose,
  onLaunchAudit,
  onGenerateReport
}) => {
  const { t } = useTranslation();

  if (!isOpen || !centre) return null;

  const diff = centre.expected_attendance - centre.ai_estimated_presence;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gov-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{centre.name}</h3>
                <span className="font-mono text-xs bg-gov-700 text-slate-300 px-2 py-0.5 rounded">
                  {centre.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {centre.location}
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Status & Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                Overall Compliance
              </span>
              <div className="my-1 flex items-baseline gap-2">
                <span
                  className={`text-3xl font-black ${
                    centre.overall_compliance_score >= 90
                      ? 'text-emerald-700'
                      : centre.overall_compliance_score >= 75
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                >
                  {centre.overall_compliance_score}%
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    centre.status === 'Compliant'
                      ? 'bg-emerald-100 text-emerald-800'
                      : centre.status === 'Attention Required'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {centre.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Formula: (Attendance 50%) + (Infrastructure 50%)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                Camera Feed Status
              </span>
              <div className="my-1 flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    centre.camera_status === 'Active'
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                />
                <span className="text-base font-bold text-slate-800">
                  {centre.camera_status}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Last stream synch: {centre.last_analysis}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                Sanctioned Capacity
              </span>
              <div className="my-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{centre.capacity}</span>
                <span className="text-xs text-slate-500">Trainees / Batch</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Last physical inspection: {centre.last_inspection}
              </p>
            </div>
          </div>

          {/* Section: Attendance Summary */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-blue-600" />
                Attendance Compliance Summary
              </h4>
              <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                Match: {centre.attendance_match_pct}%
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center py-1">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase">Expected</span>
                <strong className="text-base text-slate-800">{centre.expected_attendance}</strong>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-blue-700 block text-[10px] uppercase">AI Estimated</span>
                <strong className="text-base text-blue-800">{centre.ai_estimated_presence}</strong>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-amber-800 block text-[10px] uppercase">Difference</span>
                <strong className="text-base text-amber-900">{diff > 0 ? `-${diff}` : '0'}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase">Attendance Score</span>
                <strong className="text-base text-slate-800">{centre.attendance_match_pct}%</strong>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Visual Presence Ratio</span>
                <span>{centre.ai_estimated_presence} / {centre.expected_attendance} trainees present</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    centre.attendance_match_pct >= 90
                      ? 'bg-emerald-500'
                      : centre.attendance_match_pct >= 75
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(centre.attendance_match_pct, 100)}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
              "AI estimated visual presence is an analytical signal and should not be treated as ground-truth individual attendance."
            </div>
          </div>

          {/* Section: Infrastructure Summary */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Sanctioned Infrastructure & Equipment Status
              </h4>
              <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                Score: {centre.infrastructure_score}%
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">Equipment Name</th>
                    <th className="p-2.5 text-center">Sanctioned</th>
                    <th className="p-2.5 text-center">Detected</th>
                    <th className="p-2.5">Apparent Availability</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {centre.inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="p-2.5">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        {item.is_critical && (
                          <span className="ml-1.5 text-[9px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded font-bold uppercase">
                            Critical
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-center font-medium text-slate-600">{item.expected_qty}</td>
                      <td className="p-2.5 text-center font-bold text-slate-900">{item.detected_qty}</td>
                      <td className="p-2.5 text-slate-600">
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            item.apparent_availability === 'Appears Available'
                              ? 'text-emerald-700'
                              : item.apparent_availability === 'Partially Obstructed'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {item.apparent_availability}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Compliant'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              AI assesses apparent visual availability and flags items for verification. Manual verification may be required.
            </p>
          </div>

          {/* Courses Profile */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Approved MSDE Courses:</span>
            <div className="flex flex-wrap gap-1.5">
              {centre.courses.map((course, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium shadow-2xs"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onGenerateReport(centre)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inspection Report</span>
            </button>
            <button
              onClick={() => onLaunchAudit(centre)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Launch Video Audit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
