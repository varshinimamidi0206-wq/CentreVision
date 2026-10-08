import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { AlertItem, TrainingCentre } from '../types';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Check,
  Building2,
  ChevronRight
} from 'lucide-react';

interface AlertsPageProps {
  onSelectCentreById?: (centreId: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onSelectCentreById }) => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReview = async (alertId: string) => {
    try {
      const updated = await api.reviewAlert(alertId);
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? updated : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      const updated = await api.resolveAlert(alertId);
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? updated : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return a.severity.toLowerCase() === 'critical';
    if (filter === 'warning') return a.severity.toLowerCase() === 'warning';
    return a.status.toLowerCase() === filter.toLowerCase();
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            ! Critical
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ⚠ Attention Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Information
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return (
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            New
          </span>
        );
      case 'Under Review':
        return (
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            Under Review
          </span>
        );
      case 'Resolved':
        return (
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Resolved
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            {t('alerts.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('alerts.subtitle')}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-1.5 text-xs font-semibold">
        {[
          { id: 'all', label: t('alerts.filter_all') },
          { id: 'new', label: t('alerts.filter_new') },
          { id: 'under review', label: t('alerts.filter_review') },
          { id: 'resolved', label: t('alerts.filter_resolved') },
          { id: 'critical', label: 'Critical Discrepancies' },
          { id: 'warning', label: 'Warnings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === tab.id
                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
            {t('alerts.no_alerts')}
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs transition-all hover:shadow-sm space-y-3 ${
                alert.severity === 'Critical'
                  ? 'border-l-4 border-l-rose-500 border-slate-200'
                  : alert.severity === 'Warning'
                  ? 'border-l-4 border-l-amber-500 border-slate-200'
                  : 'border-l-4 border-l-blue-500 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {alert.id}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{alert.type}</span>
                  {getSeverityBadge(alert.severity)}
                  {getStatusBadge(alert.status)}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {alert.description}
              </p>

              {/* Centre & Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{alert.centre_name}</span>
                  <span className="text-[10px] text-slate-400">({alert.centre_id})</span>
                </div>

                <div className="flex items-center gap-2">
                  {onSelectCentreById && (
                    <button
                      onClick={() => onSelectCentreById(alert.centre_id)}
                      className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-semibold text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{t('alerts.view_centre')}</span>
                    </button>
                  )}

                  {alert.status === 'New' && (
                    <button
                      onClick={() => handleMarkReview(alert.id)}
                      className="px-2.5 py-1 text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md font-semibold text-xs"
                    >
                      {t('alerts.mark_reviewed')}
                    </button>
                  )}

                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-2.5 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md font-semibold text-xs flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>{t('alerts.resolve')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
