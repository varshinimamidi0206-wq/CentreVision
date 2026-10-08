import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'compliant' | 'warning' | 'critical' | 'info';
  badge?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  badge,
  onClick
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'compliant':
        return {
          bg: 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300',
          iconBg: 'bg-emerald-100 text-emerald-700',
          textColor: 'text-emerald-900',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/70 border-amber-200 hover:border-amber-300',
          iconBg: 'bg-amber-100 text-amber-700',
          textColor: 'text-amber-900',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'critical':
        return {
          bg: 'bg-rose-50/70 border-rose-200 hover:border-rose-300',
          iconBg: 'bg-rose-100 text-rose-700',
          textColor: 'text-rose-900',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200'
        };
      case 'info':
        return {
          bg: 'bg-blue-50/70 border-blue-200 hover:border-blue-300',
          iconBg: 'bg-blue-100 text-blue-700',
          textColor: 'text-blue-900',
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        return {
          bg: 'bg-white border-slate-200 hover:border-slate-300',
          iconBg: 'bg-gov-100 text-gov-700',
          textColor: 'text-slate-900',
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border transition-all duration-200 shadow-sm ${styles.bg} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-2xl font-bold tracking-tight ${styles.textColor}`}>{value}</h3>
            {badge && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles.badgeBg}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 pt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl shadow-xs ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
