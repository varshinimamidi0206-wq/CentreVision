import React, { useEffect, useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { DashboardSummary, TrainingCentre } from '../types';
import { KpiCard } from '../components/KpiCard';
import {
  Building2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  UserCheck,
  Cpu,
  Bell,
  ArrowRight,
  Search,
  Filter,
  Eye,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DashboardPageProps {
  onSelectCentre: (centre: TrainingCentre) => void;
  onNavigateTab: (tab: string) => void;
  searchFilter?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectCentre,
  onNavigateTab,
  searchFilter = ''
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const summary = await api.getDashboard();
      setData(summary);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const effectiveSearch = searchFilter || localSearch;

  const filteredCentres = (data?.centres || []).filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.location.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(effectiveSearch.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t('common.compliant')}
          </span>
        );
      case 'Attention Required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {t('common.attention_required')}
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {t('common.critical')}
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
            {t('dashboard.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs"
          >
            Export Compliance Summary
          </button>
          <button
            onClick={() => onNavigateTab('video_analysis')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-2xs"
          >
            New Video Audit
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard
          title={t('dashboard.total_centres')}
          value={data?.total_centres || 24}
          icon={Building2}
          variant="default"
          subtitle="MSDE Empaneled"
          onClick={() => onNavigateTab('centres')}
        />
        <KpiCard
          title={t('dashboard.compliant_centres')}
          value={data?.compliant_centres || 17}
          icon={CheckCircle}
          variant="compliant"
          subtitle="Meets all standards"
          onClick={() => {
            setStatusFilter('compliant');
            onNavigateTab('centres');
          }}
        />
        <KpiCard
          title={t('dashboard.attention_centres')}
          value={data?.attention_required_centres || 5}
          icon={AlertTriangle}
          variant="warning"
          subtitle="Minor discrepancy"
          onClick={() => {
            setStatusFilter('attention required');
            onNavigateTab('centres');
          }}
        />
        <KpiCard
          title={t('dashboard.critical_centres')}
          value={data?.critical_centres || 2}
          icon={XCircle}
          variant="critical"
          subtitle="Immediate action"
          onClick={() => {
            setStatusFilter('critical');
            onNavigateTab('centres');
          }}
        />
        <KpiCard
          title={t('dashboard.avg_attendance')}
          value={`${data?.average_attendance || 91}%`}
          icon={UserCheck}
          variant="info"
          badge="Target 85%"
          subtitle="State-wide match"
          onClick={() => onNavigateTab('attendance')}
        />
        <KpiCard
          title={t('dashboard.infra_compliance')}
          value={`${data?.infrastructure_compliance || 94}%`}
          icon={Cpu}
          variant="compliant"
          badge="Target 90%"
          subtitle="Approved assets"
          onClick={() => onNavigateTab('infrastructure')}
        />
        <KpiCard
          title={t('dashboard.active_alerts')}
          value={data?.active_alerts || 12}
          icon={Bell}
          variant="warning"
          badge="Action req."
          subtitle="Unresolved flags"
          onClick={() => onNavigateTab('alerts')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Attendance Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                {t('dashboard.attendance_trend')}
              </h3>
              <p className="text-[11px] text-slate-500">Hourly classroom attendance across monitored centres</p>
            </div>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Live Aggregate
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.attendance_trend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[600, 900]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="expected"
                  name="Sanctioned Roster Attendance"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="ai_estimated"
                  name="AI Estimated Visual Presence"
                  stroke="#2563eb"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Alert Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-amber-600" />
                {t('dashboard.alert_distribution')}
              </h3>
              <span className="text-xs font-bold text-slate-600">Total: 12</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.alert_distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {(data?.alert_distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {(data?.alert_distribution || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.category}</span>
                </div>
                <strong className="text-slate-900 font-bold">{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Infrastructure by Category */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              {t('dashboard.infra_by_category')}
            </h3>
            <p className="text-[11px] text-slate-500">Statutory asset availability compared against 90% compliance benchmark</p>
          </div>
        </div>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.infrastructure_compliance_categories || []}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[70, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="compliance" name="Current Detected Availability (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" name="MSDE Statutory Benchmark (90%)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Centre Compliance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header and Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t('dashboard.centres_table_title')}</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredCentres.length} of {data?.total_centres || 24} skill development centres
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Status Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {['all', 'compliant', 'attention required', 'critical'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'attention required' ? 'Attention' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">{t('dashboard.col_centre')}</th>
                <th className="py-3 px-4">{t('dashboard.col_location')}</th>
                <th className="py-3 px-4 text-center">{t('dashboard.col_attendance')}</th>
                <th className="py-3 px-4 text-center">{t('dashboard.col_infra')}</th>
                <th className="py-3 px-4 text-center">{t('dashboard.col_score')}</th>
                <th className="py-3 px-4">{t('dashboard.col_status')}</th>
                <th className="py-3 px-4">{t('dashboard.col_last_analysis')}</th>
                <th className="py-3 px-4 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCentres.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No training centres match your filters.
                  </td>
                </tr>
              ) : (
                filteredCentres.map((centre) => (
                  <tr
                    key={centre.id}
                    onClick={() => onSelectCentre(centre)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{centre.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{centre.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{centre.location}</div>
                      <div className="text-[11px] text-slate-400">Cap: {centre.capacity}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-bold text-slate-900">{centre.attendance_match_pct}%</div>
                      <div className="text-[11px] text-slate-500">
                        {centre.ai_estimated_presence}/{centre.expected_attendance}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-bold text-slate-900">{centre.infrastructure_score}%</div>
                      <div className="text-[11px] text-slate-500">
                        {centre.inventory.filter((i) => i.status === 'Compliant').length}/{centre.inventory.length} verified
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div
                        className={`text-sm font-black ${
                          centre.overall_compliance_score >= 90
                            ? 'text-emerald-700'
                            : centre.overall_compliance_score >= 75
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {centre.overall_compliance_score}%
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(centre.status)}</td>
                    <td className="py-3.5 px-4 text-slate-500">{centre.last_analysis}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCentre(centre);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
