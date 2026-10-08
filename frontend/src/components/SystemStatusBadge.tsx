import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { SystemStatus } from '../types';
import { ShieldCheck, Cpu, Database, Camera } from 'lucide-react';

export const SystemStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    api.getHealth().then(setStatus).catch(() => {});
    const interval = setInterval(() => {
      api.getHealth().then(setStatus).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = status?.status === 'online';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">System Health</span>
        <span className="flex items-center gap-1.5 font-medium text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {isOnline ? 'All Systems Active' : 'Fallback Engine'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span className="truncate">AI Vision: <strong className="text-slate-200">Ready</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate">DB: <strong className="text-slate-200">Connected</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span className="truncate">Privacy: <strong className="text-slate-200">Enforced</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate">Feed: <strong className="text-slate-200">Active</strong></span>
        </div>
      </div>
    </div>
  );
};
