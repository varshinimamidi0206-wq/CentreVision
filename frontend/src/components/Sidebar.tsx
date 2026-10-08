import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { SystemStatusBadge } from './SystemStatusBadge';
import {
  LayoutDashboard,
  Building2,
  Cpu,
  Video,
  Bell,
  FileSpreadsheet,
  Target,
  ShieldCheck,
  WifiOff,
  Settings,
  X,
  Sparkles,
  ExternalLink,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activeAlertCount?: number;
  onStartDemo?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  onClose,
  activeAlertCount = 12,
  onStartDemo
}) => {
  const { t, language, setLanguage, languages } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'centres', label: t('nav.centres'), icon: Building2 },
    { id: 'attendance', label: t('nav.attendance'), icon: UserCheck },
    { id: 'infrastructure', label: t('nav.infrastructure'), icon: Cpu },
    { id: 'video_analysis', label: t('nav.video_analysis'), icon: Video },
    {
      id: 'alerts',
      label: t('nav.alerts'),
      icon: Bell,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined
    },
    { id: 'reports', label: t('nav.reports'), icon: FileSpreadsheet },
    { id: 'accuracy', label: t('nav.accuracy'), icon: Target },
    { id: 'privacy', label: t('nav.privacy'), icon: ShieldCheck },
    { id: 'low_bandwidth', label: t('nav.low_bandwidth'), icon: WifiOff },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gov-800 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Branding */}
        <div className="p-5 border-b border-gov-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md border border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">CentreVision</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-400/30 uppercase tracking-wider">MSDE</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Compliance Monitoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-gov-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Start Demo Action Banner */}
        <div className="px-4 pt-3 pb-1">
          <button
            onClick={() => {
              if (onStartDemo) onStartDemo();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>START DEMO WALKTHROUGH</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-gov-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-blue-700' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gov-700/60 space-y-3 bg-gov-900/40">
          {/* Language selector in sidebar */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="text-[11px] text-slate-400">Language:</span>
            <div className="flex bg-gov-700/80 p-0.5 rounded-lg border border-gov-600">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1 text-[11px] rounded-md transition-all font-medium ${
                    language === l.code
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {l.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* System status */}
          <SystemStatusBadge />

          {/* Officer Profile */}
          <div className="pt-2 flex items-center justify-between border-t border-gov-700/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gov-600 flex items-center justify-center text-slate-200 border border-gov-500 font-bold text-xs">
                MS
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">M. S. Rao, IRPS</p>
                <p className="text-[10px] text-slate-400">Joint Director (Monitoring)</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
              <UserCheck className="w-3 h-3" />
              Verified
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
