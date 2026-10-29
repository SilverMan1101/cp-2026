import React, { useState, useEffect } from 'react';
import { AuditLog } from '../types';
import { apiService } from '../services/api';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const AuditView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    apiService.getAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Privacy Enforcement & Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tamper-evident logs of administrative access, report exports, and k-anonymity compliance
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4" />
          <span>GDPR / Workplace Privacy Compliant</span>
        </div>
      </div>

      {/* Privacy Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <Lock className="h-4 w-4" />
            <span>K-Anonymity (k = 5)</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Cohorts with fewer than 5 respondents automatically rollup to parent departments. Individual survey submissions can never be isolated.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>One-Way Token Hashing</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Survey submission tokens are salted and cryptographically hashed with SHA-256, decoupling employee identities from qualitative ratings.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
            <Eye className="h-4 w-4" />
            <span>Immutable Audit Logging</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All manager and HR report access events are tracked with timestamps, client IP addresses, and requested resource scopes.
          </p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Recent Access & Compliance Records</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource Scope</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4">Verification Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">{log.action}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{log.resource_type}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{log.user_id || 'ANONYMIZED'}</td>
                  <td className="py-3 px-4 text-slate-500">{log.ip_address}</td>
                  <td className="py-3 px-4 font-sans text-xs text-slate-600 dark:text-slate-400">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
