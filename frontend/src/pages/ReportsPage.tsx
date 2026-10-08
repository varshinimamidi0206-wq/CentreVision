import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  UserCheck
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [centreId, setCentreId] = useState('TC-001');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateReport();
  }, [centreId]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const data = await api.getReport(centreId);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            {t('reports.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('reports.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateReport}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs"
          >
            {t('reports.generate_btn')}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('reports.print_btn')}</span>
          </button>
        </div>
      </div>

      {/* Select Centre Bar (no-print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-4 items-center text-xs">
        <div className="flex-1">
          <label className="font-semibold text-slate-700 block mb-1">
            {t('reports.select_centre')}
          </label>
          <select
            value={centreId}
            onChange={(e) => setCentreId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
          >
            <option value="TC-001">TC-001: Sri Skill Development Training Centre (Visakhapatnam)</option>
            <option value="TC-002">TC-002: Rural Skills Training Centre (Chittoor)</option>
            <option value="TC-003">TC-003: Advanced Technical Training Centre (Vijayawada)</option>
          </select>
        </div>

        <div className="w-full sm:w-64">
          <label className="font-semibold text-slate-700 block mb-1">
            {t('reports.date_range')}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              defaultValue="2026-09-01"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Official Government Inspection Document View */}
      {report && (
        <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-10 shadow-sm max-w-4xl mx-auto space-y-8 text-slate-900 font-sans print:border-none print:shadow-none print:p-0">
          {/* Official Emblem & Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
            <div className="inline-block p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 mb-1">
              <ShieldCheck className="w-8 h-8 mx-auto text-blue-700" />
            </div>
            <h3 className="font-black text-lg tracking-wide uppercase text-slate-900">
              {report.issuing_authority}
            </h3>
            <p className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
              {report.compliance_framework}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Statutory Electronic Audit Ref: <strong>{report.report_id}</strong> • Generated: {report.generated_at}
            </p>
          </div>

          {/* Centre Overview Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Training Centre</span>
              <strong className="text-slate-900 font-bold text-sm">{report.centre.name}</strong>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{report.centre.id}</p>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Location / District</span>
              <strong className="text-slate-900 font-bold">{report.centre.location}</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">State: {report.centre.state}</p>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Sanctioned Seating</span>
              <strong className="text-slate-900 font-bold text-sm">{report.centre.capacity} Trainees</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">Camera: {report.centre.camera_status}</p>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Composite Score</span>
              <strong
                className={`text-xl font-black ${
                  report.summary_scores.overall_compliance_score >= 90
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {report.summary_scores.overall_compliance_score}%
              </strong>
              <p className="text-[10px] font-bold text-slate-700">{report.summary_scores.status}</p>
            </div>
          </div>

          {/* Section: Attendance Audit */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>1. Trainee Presence Verification (Computer Vision)</span>
              <span className="text-xs font-mono font-bold text-blue-700">
                Score: {report.summary_scores.attendance_score}%
              </span>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Reported Roster Attendance</span>
                <strong className="text-lg font-bold text-slate-900">{report.attendance_analysis.official_reported}</strong>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-blue-800 block text-[10px] uppercase font-semibold">AI Estimated Presence</span>
                <strong className="text-lg font-bold text-blue-900">{report.attendance_analysis.ai_estimated_presence}</strong>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-amber-800 block text-[10px] uppercase font-semibold">Attendance Discrepancy</span>
                <strong className="text-lg font-bold text-amber-900">{report.attendance_analysis.variance} Trainees</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Methodology: {report.attendance_analysis.methodology}
            </p>
          </div>

          {/* Section: Infrastructure Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>2. Sanctioned Equipment & Infrastructure Inventory</span>
              <span className="text-xs font-mono font-bold text-indigo-700">
                Score: {report.summary_scores.infrastructure_score}%
              </span>
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Asset / Equipment Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-center">Sanctioned</th>
                    <th className="p-2.5 text-center">Visually Detected</th>
                    <th className="p-2.5">Apparent Availability</th>
                    <th className="p-2.5 text-right">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.infrastructure_inventory.map((it: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-slate-900">{it.item_name}</td>
                      <td className="p-2.5 text-slate-600">{it.category}</td>
                      <td className="p-2.5 text-center font-medium">{it.sanctioned_qty}</td>
                      <td className="p-2.5 text-center font-bold text-slate-900">{it.visually_detected_qty}</td>
                      <td className="p-2.5 text-slate-700">{it.visual_availability}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">{it.item_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Active Alerts Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              3. Recorded Discrepancy & Compliance Flags ({report.active_alerts.length})
            </h4>
            {report.active_alerts.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No non-compliance infractions recorded.</p>
            ) : (
              <div className="space-y-2">
                {report.active_alerts.map((al: any) => (
                  <div key={al.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between gap-4">
                    <div>
                      <span className="font-bold text-slate-900 block">{al.type}</span>
                      <p className="text-slate-600">{al.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {al.severity}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">{al.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy & Legal Certification */}
          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs space-y-1.5 text-purple-950">
            <div className="font-bold flex items-center gap-1.5 text-purple-900">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              Privacy & DPDP Act Certification
            </div>
            <p className="text-[11px] leading-relaxed text-purple-900">
              <strong>{report.privacy_certification.legal_compliance}</strong> • Facial Recognition: {report.privacy_certification.facial_recognition}.
              Zero biometric data captured or persisted.
            </p>
            <p className="text-[10px] text-purple-800 italic">
              {report.officer_verification_note}
            </p>
          </div>

          {/* Official Signatures Block */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-8">
                {t('reports.sign_officer')}
              </p>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                M. S. Rao, IRPS (Joint Director, Monitoring)
              </div>
              <span className="text-[10px] text-slate-500 block">MSDE Regional Directorate</span>
            </div>

            <div className="text-right">
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-8">
                {t('reports.sign_date')}
              </p>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                {report.generated_at.split('-')[0]}
              </div>
              <span className="text-[10px] text-slate-500 block">Digitally Certified Inspection Seal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
