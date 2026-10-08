import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { TrainingCentre } from '../types';
import {
  Building2,
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  LayoutGrid,
  List,
  MapPin,
  Users,
  Cpu,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CentresPageProps {
  onSelectCentre: (centre: TrainingCentre) => void;
  searchFilter?: string;
}

export const CentresPage: React.FC<CentresPageProps> = ({
  onSelectCentre,
  searchFilter = ''
}) => {
  const { t } = useTranslation();
  const [centres, setCentres] = useState<TrainingCentre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchFilter);
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'attendance' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  useEffect(() => {
    loadCentres();
  }, []);

  const loadCentres = async () => {
    setLoading(true);
    try {
      const data = await api.getCentres();
      setCentres(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const locations = Array.from(
    new Set(centres.map((c) => c.location.split(',')[0].trim()))
  );

  const filteredCentres = centres
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesLoc =
        locationFilter === 'all' || c.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesLoc;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'score') cmp = a.overall_compliance_score - b.overall_compliance_score;
      else if (sortBy === 'attendance') cmp = a.attendance_match_pct - b.attendance_match_pct;
      else cmp = a.name.localeCompare(b.name);
      return sortOrder === 'desc' ? -cmp : cmp;
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            {t('nav.centres')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of 24 government-funded skill development centres under active compliance oversight
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by centre name, ID or district..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="compliant">Compliant</option>
            <option value="attention required">Attention Required</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
          >
            <option value="all">All Districts ({locations.length})</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex gap-1.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="flex-1 py-2 px-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
          >
            <option value="score">Sort: Overall Score</option>
            <option value="attendance">Sort: Attendance</option>
            <option value="name">Sort: Centre Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              onClick={() => onSelectCentre(centre)}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {centre.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 group-hover:text-blue-600 transition-colors">
                      {centre.name}
                    </h3>
                  </div>
                  {getStatusBadge(centre.status)}
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{centre.location}</span>
                </p>

                {/* Score Pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-50 rounded-lg border border-slate-100 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Attendance</span>
                    <strong className="font-bold text-slate-800">{centre.attendance_match_pct}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Infrastructure</span>
                    <strong className="font-bold text-slate-800">{centre.infrastructure_score}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Overall</span>
                    <strong
                      className={`font-black ${
                        centre.overall_compliance_score >= 90
                          ? 'text-emerald-700'
                          : centre.overall_compliance_score >= 75
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {centre.overall_compliance_score}%
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Cap: {centre.capacity} trainees</span>
                <span className="flex items-center gap-1 text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                  Inspect Details
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Centre Name & ID</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Capacity</th>
                  <th className="py-3 px-4 text-center">Attendance Match</th>
                  <th className="py-3 px-4 text-center">Infrastructure</th>
                  <th className="py-3 px-4 text-center">Overall Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCentres.map((centre) => (
                  <tr
                    key={centre.id}
                    onClick={() => onSelectCentre(centre)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{centre.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{centre.id}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{centre.location}</td>
                    <td className="py-3 px-4 text-center">{centre.capacity}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{centre.attendance_match_pct}%</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{centre.infrastructure_score}%</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-black ${
                          centre.overall_compliance_score >= 90
                            ? 'text-emerald-700'
                            : centre.overall_compliance_score >= 75
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {centre.overall_compliance_score}%
                      </span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(centre.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCentre(centre);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 border border-blue-200"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
