import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, Alert } from '../types';
import { Activity, Bell, ShieldCheck, User as UserIcon, CheckCircle2, AlertTriangle, AlertCircle, Info, ChevronDown } from 'lucide-react';

interface NavbarProps {
  alerts: Alert[];
  onAcknowledgeAlert: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ alerts, onAcknowledgeAlert }) => {
  const { user, switchRole } = useAuth();
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const unreadAlerts = alerts.filter(a => !a.is_acknowledged);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      {/* Brand & Organization Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">EmotionSense™</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              v1.0 Enterprise
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">TechNova Solutions Inc. • Workplace Wellness & Risk Analytics</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* K-Anonymity Privacy Guarantee Shield */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>K-Anonymity (k ≥ 5) Guaranteed</span>
        </div>

        {/* Quick Role Switcher for Evaluation */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
          {(['HR_ADMIN', 'MANAGER', 'EMPLOYEE'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                user?.role === role
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {role === 'HR_ADMIN' ? 'HR Admin' : role === 'MANAGER' ? 'Manager' : 'Employee'}
            </button>
          ))}
        </div>

        {/* Notifications / Alerts Popover */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Real-time alerts"
          >
            <Bell className="h-5 w-5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">Real-Time Risk Alerts</span>
                <span className="text-xs text-slate-500">{unreadAlerts.length} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {alerts.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-500">No active alerts</p>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="py-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {alert.severity === 'CRITICAL' ? (
                            <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                          ) : alert.severity === 'WARNING' ? (
                            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          ) : (
                            <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          )}
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{alert.title}</span>
                        </div>
                        {!alert.is_acknowledged && (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                          >
                            Ack
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 pl-5">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs dark:bg-slate-800 dark:text-slate-300">
            {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">{user?.fullName}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-1">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
