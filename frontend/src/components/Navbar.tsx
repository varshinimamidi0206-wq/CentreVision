import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Shield,
  Languages,
  ChevronDown,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onMenuToggle: () => void;
  activeAlertCount?: number;
  onAlertsClick: () => void;
  onStartDemo: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onMenuToggle,
  activeAlertCount = 12,
  onAlertsClick,
  onStartDemo,
  searchQuery,
  setSearchQuery
}) => {
  const { t, language, setLanguage, languages } = useTranslation();

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return t('dashboard.title');
      case 'centres':
        return t('nav.centres');
      case 'attendance':
        return t('attendance.title');
      case 'infrastructure':
        return t('infrastructure.title');
      case 'video_analysis':
        return t('video_workspace.title');
      case 'alerts':
        return t('alerts.title');
      case 'reports':
        return t('reports.title');
      case 'accuracy':
        return t('accuracy.title');
      case 'privacy':
        return t('privacy.title');
      case 'low_bandwidth':
        return t('low_bandwidth.title');
      case 'settings':
        return t('settings.title');
      default:
        return 'CentreVision';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left Section: Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {getPageTitle()}
            <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              MSDE GovTech
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 hidden md:block">
            {t('brand.tagline')} • Problem ID #26245
          </p>
        </div>
      </div>

      {/* Middle: Quick Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xs relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('common.search')}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* START DEMO CTA */}
        <button
          onClick={onStartDemo}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 active:scale-95"
          title="Start 2-Minute Guided Demo"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950 animate-bounce" />
          <span className="hidden sm:inline">{t('common.start_demo')}</span>
          <span className="sm:hidden">DEMO</span>
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg cursor-pointer border border-slate-200 font-medium">
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{languages.find((l) => l.code === language)?.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </div>
          <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 hidden group-hover:block z-50">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-100 flex items-center justify-between ${
                  language === l.code ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-700'
                }`}
              >
                <span>{l.nativeName}</span>
                <span className="text-[10px] text-slate-400 uppercase">{l.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onAlertsClick}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title={`${activeAlertCount} Active Compliance Alerts`}
        >
          <Bell className="w-4 h-4" />
          {activeAlertCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold border-2 border-white">
              {activeAlertCount}
            </span>
          )}
        </button>

        {/* Officer Avatar Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-gov-700 text-white font-bold text-xs flex items-center justify-center border border-gov-600">
            MS
          </div>
          <div className="text-left hidden lg:block leading-tight">
            <p className="text-xs font-semibold text-slate-800">Officer Rao</p>
            <p className="text-[10px] text-slate-500">MSDE Monitor</p>
          </div>
        </div>
      </div>
    </header>
  );
};
