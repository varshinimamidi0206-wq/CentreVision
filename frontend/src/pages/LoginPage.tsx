import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import {
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Building2
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('officer.rao@msde.gov.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      {/* Background Decor */}
      <div className="w-full max-w-md space-y-6">
        {/* Emblem & Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-2xl shadow-lg border border-white/30 text-white mb-2">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            CentreVision
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-blue-700">
            AI-Powered Training Centre Compliance Monitoring
          </p>
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            {t('brand.tagline')}
          </p>
          <div className="pt-1">
            <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-300">
              Ministry of Skill Development & Entrepreneurship (MSDE)
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md space-y-6 text-xs">
          {/* Quick Demo Banner */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-center">
            <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wide flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Hackathon Evaluation Access
            </span>
            <button
              onClick={onLoginSuccess}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl shadow-xs transition-all hover:scale-102 flex items-center justify-center gap-2 text-xs"
            >
              <span>Continue in Demo Mode (Instant Access)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 absolute">
              OR OFFICIAL SIGN IN
            </span>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Official Email (gov.in / nic.in)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-sm transition-all"
            >
              Sign In to Compliance Portal
            </button>
          </form>

          {/* Privacy Note */}
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-relaxed">
            CentreVision operates in compliance with India's DPDP Act 2023. No facial biometric harvesting is performed.
          </div>
        </div>
      </div>
    </div>
  );
};
